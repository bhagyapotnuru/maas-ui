import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import type { DataPath, TargetResourceBlock } from "../Models/DataPath";
import classes from "../NodeDataPath.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&.MuiTableCell-root": {
    wordBreak: "break-all",
  },
}));

const NodeDataPathContentTable = ({
  dataPath,
  targetResourceBlock,
}: {
  dataPath: DataPath;
  targetResourceBlock: TargetResourceBlock;
}): JSX.Element => {
  const getHealthIcon = (healthStatus: string) =>
    healthStatus === "OK"
      ? "p-icon--status-succeeded-small"
      : "p-icon--status-failed-small";

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, m: 0 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ p: 0, pl: "0.5rem" }}
                className={classes.data_path_id_column}
              >
                Data Path ID
              </TableCell>
              <TableCell align="center" sx={{ p: 0 }}>
                Initiator
              </TableCell>
              <TableCell
                align="center"
                sx={{ p: 0 }}
                className={classes.cross_connect_column}
              >
                Cross Connect
              </TableCell>
              <TableCell align="center" sx={{ p: 0 }}>
                Target
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {targetResourceBlock?.TargetEndpoints.map((tE) => (
              <TableRow
                key={tE.DataPathId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left" sx={{ p: 0 }}>
                  <div className={classes.data_path_id_content}>
                    <div>
                      <CustomizedTooltip
                        title={`Health Status: ${tE?.Status?.Health}`}
                      >
                        <span>
                          <i className={getHealthIcon(tE?.Status?.Health)}></i>
                        </span>
                      </CustomizedTooltip>
                    </div>
                    <div>{tE?.DataPathId || "-"}</div>
                  </div>
                </TableCell>
                <TableCell align="center" sx={{ p: 0 }}>
                  <div className={classes.endpoint_data}>
                    <div>{dataPath?.InitiatorEndpoint?.Name || "-"}</div>
                    <div className={classes.ports}>
                      <div className={classes.port_value}>
                        {"[ "}
                        <CustomizedTooltip title={`Upstream`}>
                          <div className={classes.upstream_port}>
                            <ArrowUpwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {`${dataPath?.InitiatorEndpoint?.UpstreamPort || "-"}`}
                      </div>
                      <div className={classes.port_sync}>
                        <SyncAltRoundedIcon />
                      </div>
                      <div className={classes.port_value}>
                        {`${tE?.Ports?.ConnectedIficDsPort || "-"}`}
                        <CustomizedTooltip title={`Downstream`}>
                          <div className={classes.downstream_port}>
                            <ArrowDownwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {" ]"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center" sx={{ p: "0.5rem 0" }}>
                  <div className={classes.oxc_cross_connect}>
                    <div>{tE?.XConnects?.Id}</div>
                    <div>
                      {tE?.XConnects?.ConnectedOxcPorts.map((xConn) => (
                        <div className={classes.oxc_port}>
                          <div>
                            <b>{`[RX]`}</b> {xConn?.Source}
                          </div>
                          <div>
                            {xConn?.Destination} <b>{`[TX]`}</b>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center" sx={{ p: 0 }}>
                  <div className={classes.endpoint_data}>
                    <div className={classes.ports}>
                      <div className={classes.port_value}>
                        {"[ "}
                        <CustomizedTooltip title={`Upstream`}>
                          <div className={classes.upstream_port}>
                            <ArrowUpwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {`${tE.Ports?.UpstreamPort?.PcieSegment || "-"}`}
                      </div>
                      <div className={classes.port_sync}>
                        <SyncAltRoundedIcon />
                      </div>
                      <div className={classes.port_value}>
                        {`${tE?.Ports?.DownstreamPort?.PcieSegment || "-"}`}
                        <CustomizedTooltip title={`Downstream`}>
                          <div className={classes.downstream_port}>
                            <ArrowDownwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {" ]"}
                      </div>
                    </div>
                    <div>{tE?.Name || "-"}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default NodeDataPathContentTable;
