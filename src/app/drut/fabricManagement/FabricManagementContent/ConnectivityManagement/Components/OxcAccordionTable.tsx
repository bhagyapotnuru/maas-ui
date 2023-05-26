// import RemoveIcon from "@mui/icons-material/Remove";
import { Spinner } from "@canonical/react-components";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import classes from "../../../fabricManagement.module.scss";

import type {
  OpticalSwitch,
  OxcPort,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const OXCAccordionTable = ({
  oxc,
  removeOxcConnection,
}: {
  oxc: OpticalSwitch;
  removeOxcConnection: (oxc: OpticalSwitch, oxcPort: OxcPort) => void;
}): JSX.Element => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader aria-label="oxc table">
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell align="center" style={{ width: 70 }}>
              IN
            </TableCell>
            <TableCell align="center" style={{ width: 70 }}>
              OUT
            </TableCell>
            <TableCell align="center">Connected FIC Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oxc.ports && oxc.ports.length > 0 ? (
            oxc.ports.map((oxcPort: OxcPort) => (
              <TableRow
                key={`${oxcPort.rx}-${oxcPort.tx}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {oxcPort?.rx}
                </TableCell>
                <TableCell align="center">{oxcPort?.tx}</TableCell>
                <TableCell align="center" sx={{ p: 0 }}>
                  {oxcPort?.connectedPcie ? (
                    <div className={classes.oxc_remove}>
                      <CustomizedTooltip
                        title={`(${oxcPort.connectedPcie.manager_type}) ${oxcPort.connectedPcie.manager_fqnn}`}
                      >
                        <span>
                          {`(${oxcPort.connectedPcie.manager_type}) ${oxcPort.connectedPcie.rack_name}
                    .${oxcPort.connectedPcie.manager_name}
                    .${oxcPort.connectedPcie.pcie_switch}
                    .${oxcPort.connectedPcie.pcie_switch_port}`}
                        </span>
                      </CustomizedTooltip>
                      {
                        <div>
                          {!oxcPort.isRemoving ? (
                            <CustomizedTooltip title={`Remove peer connection`}>
                              <IconButton
                                onClick={(e: any) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeOxcConnection(oxc, oxcPort);
                                }}
                                color="error"
                                aria-label="remove"
                                component="label"
                              >
                                <CancelIcon />
                              </IconButton>
                            </CustomizedTooltip>
                          ) : (
                            <Spinner
                              text={`Removing..`}
                              key={`oxc_remove_${Math.random()}`}
                            />
                          )}
                        </div>
                      }
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div className={classes.no_data}>
              <span>No Ports available.</span>
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OXCAccordionTable;
