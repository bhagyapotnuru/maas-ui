import type { SetStateAction } from "react";

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

import OxcPortsDropDown from "./OxcPortsDropDown";

import type {
  FicManager,
  OpticalSwitch,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const FICAccordionTable = ({
  fic,
  oxcPortOptions,
  setOxcResponse,
  setFicResponse,
  removeFicPeerPort,
}: {
  fic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  setFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
}): JSX.Element => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader aria-label="FIC table">
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell align="center">PCIE Switch Port</TableCell>
            <TableCell align="center">Peer Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fic.switches && Object.keys(fic.switches).length > 0 ? (
            Object.keys(fic.switches).map((pcieSwitchKey: string) =>
              Object.keys(fic.switches[pcieSwitchKey])
                .map((pcieSwitchPortKey: string) => (
                  <TableRow
                    key={`${fic.fqnn}_${pcieSwitchPortKey}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {`${pcieSwitchKey}`}&#8228;{`${pcieSwitchPortKey}`}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {!fic.switches[pcieSwitchKey][pcieSwitchPortKey]
                        .optical_switch ||
                      !fic.switches[pcieSwitchKey][pcieSwitchPortKey]
                        .optical_switch.name ? (
                        <OxcPortsDropDown
                          fic={fic}
                          pcieSwitch={pcieSwitchKey}
                          pcieSwitchPort={pcieSwitchPortKey}
                          oxcPortOptions={oxcPortOptions}
                          setOxcResponse={setOxcResponse}
                          setFicResponse={setFicResponse}
                        />
                      ) : (
                        <div className={classes.oxc_remove}>
                          <CustomizedTooltip
                            title={`${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.fqnn}`}
                          >
                            <span>
                              {`(${fic.switches[pcieSwitchKey][pcieSwitchPortKey].rx} - ${fic.switches[pcieSwitchKey][pcieSwitchPortKey].tx}) 
                         ${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.rack_name}.${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.name}`}
                            </span>
                          </CustomizedTooltip>
                          <div>
                            {fic.switches[pcieSwitchKey][pcieSwitchPortKey]
                              .isRemoving ? (
                              <Spinner
                                text={`Removing..`}
                                key={`oxc_remove_${Math.random()}`}
                              />
                            ) : (
                              <CustomizedTooltip
                                title={`Remove peer connection`}
                              >
                                <IconButton
                                  onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFicPeerPort(
                                      fic,
                                      pcieSwitchKey,
                                      pcieSwitchPortKey
                                    );
                                  }}
                                  color="error"
                                  aria-label="remove"
                                  component="label"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </CustomizedTooltip>
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                .reduce(
                  (acc: JSX.Element[], val: JSX.Element) => acc.concat(val),
                  []
                )
            )
          ) : (
            <div className={classes.no_data}>
              <span>No PCIE Switches available.</span>
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FICAccordionTable;
