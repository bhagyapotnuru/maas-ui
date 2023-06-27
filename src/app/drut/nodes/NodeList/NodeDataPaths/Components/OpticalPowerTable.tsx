import { useContext, useEffect, useState } from "react";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import type { DataPath, TargetEndpoint } from "../Models/DataPath";
import type { OpticalModule, OpticalPower } from "../Models/OpticalPower";
import type { OpticalPowerValues } from "../Models/OpticalPowerValues";
import classes from "../NodeDataPath.module.scss";
import NodeDataPathContext from "../Store/NodeDataPath-Context";
import type { NodeDataPathType } from "../Store/NodeDataPathType";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&.MuiTableCell-root": {
    wordBreak: "break-all",
  },
}));

const OpticalPowerTable = ({
  opticalPowers = [],
}: {
  opticalPowers: OpticalPower[];
}): JSX.Element => {
  const context: NodeDataPathType = useContext(NodeDataPathContext);
  const tE: TargetEndpoint | undefined =
    context.currentDataPath?.targetRB.TargetEndpoints[0];
  const allDsPorts: string | undefined =
    context.currentDataPath?.targetRB.TargetEndpoints.map(
      (t) => t?.Ports?.DownstreamPort?.PcieSegment
    ).join(", ");
  const dataPath: DataPath | undefined = context.currentDataPath?.dataPath;

  const [iOpticalValues, setIOpticalValues] = useState(
    undefined as OpticalModule | undefined
  );
  const [tOpticalValues, setTOpticalValues] = useState(
    undefined as OpticalModule | undefined
  );

  const [iPowerType, setIPowerType] = useState("mW");
  const [tPowerType, setTPowerType] = useState("mW");

  const [iOpticalPowers, setIOpticalPowers] = useState(
    [] as OpticalPowerValues[]
  );
  const [tOpticalPowers, setTOpticalPowers] = useState(
    [] as OpticalPowerValues[]
  );

  const handleIChange = (event: SelectChangeEvent) => {
    setIPowerType(event.target.value);
  };

  const handleTChange = (event: SelectChangeEvent) => {
    setTPowerType(event.target.value);
  };

  useEffect(() => {
    const iOpticalPower: OpticalPower | undefined = opticalPowers.find(
      (o) => o.Switch === dataPath?.InitiatorEndpoint?.SwitchId
    );
    const tOpitcalPower: OpticalPower | undefined = opticalPowers.find(
      (o) => o.Switch === tE?.Ports?.UpstreamPort?.SwitchId
    );
    if (iOpticalPower) {
      setIOpticalValues(iOpticalPower.OpticalModule);
    }
    if (tOpitcalPower) {
      setTOpticalValues(tOpitcalPower.OpticalModule);
    }
  }, [opticalPowers]);

  useEffect(() => {
    if (iOpticalValues) {
      setIOpticalPowers(getOpticalPowers(iOpticalValues));
    }
  }, [iOpticalValues]);

  useEffect(() => {
    if (tOpticalValues) {
      setTOpticalPowers(getOpticalPowers(tOpticalValues));
    }
  }, [tOpticalValues]);

  const getOpticalPowers = (opticalValues: OpticalModule) => {
    return [...Array(4)].map((_, i) => {
      const RX_P: string =
        opticalValues[`RX${i + 1}_POWER` as keyof typeof opticalValues];
      const RX_Val = (RX_P || "").split("/");

      const TX_P: string =
        opticalValues[`TX${i + 1}_POWER` as keyof typeof opticalValues];
      const TX_Val = (TX_P || "").split("/");
      return {
        dBmRx: RX_Val[1],
        mWRx: RX_Val[0],
        dBmTx: TX_Val[1],
        mWTx: TX_Val[0],
      };
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, m: 0 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.opv_initiator}>
                <div className={classes.optical_power_val_heading}>
                  <span>Initiator</span>
                  <div className={classes.optical_power_heading_info}>
                    <div>{dataPath?.InitiatorEndpoint.Name || "-"}</div>
                    <div className={classes.ports}>
                      <div className={classes.port_value}>
                        {"[ "}
                        <CustomizedTooltip title={`Upstream`}>
                          <div className={classes.upstream_port}>
                            <ArrowUpwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {`${dataPath?.InitiatorEndpoint.UpstreamPort || "-"}`}
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
                </div>
              </TableCell>
              <TableCell
                align="center"
                className={classes.cross_connect_column}
              >
                Cross Connect
              </TableCell>
              <TableCell align="center" className={classes.opv_target}>
                <div className={classes.optical_power_val_heading}>
                  <span> Target</span>
                  <div className={classes.optical_power_heading_info}>
                    <div className={classes.ports}>
                      {"[ "}
                      <div className={classes.port_value}>
                        <CustomizedTooltip title={`Upstream`}>
                          <div className={classes.upstream_port}>
                            <ArrowUpwardRoundedIcon />
                          </div>
                        </CustomizedTooltip>
                        {`${tE?.Ports?.UpstreamPort?.PcieSegment || "-"}`}
                      </div>
                      <div className={classes.port_sync}>
                        <SyncAltRoundedIcon />
                      </div>
                      <div className={classes.port_value}>
                        <CustomizedTooltip
                          title={allDsPorts}
                          className={classes.optical_power_target_ds_ports}
                        >
                          <span>{`${allDsPorts || "-"}`}</span>
                        </CustomizedTooltip>
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
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={tE?.DataPathId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" sx={{ p: 0 }}>
                <div className={classes.endpoint_data}>
                  <div className={classes.power_values}>
                    {iOpticalValues &&
                    Object.keys(iOpticalValues || {}).length > 0 ? (
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 0, minWidth: 120 }}
                          size="small"
                        >
                          <Select
                            labelId="opv-power"
                            id="opv-power"
                            value={iPowerType}
                            onChange={handleIChange}
                            label=""
                          >
                            {["mW/dBm", "mW", "dBm"].map((powerType) => (
                              <MenuItem
                                className={classes.header_selection_menu_item}
                                value={powerType}
                              >
                                {powerType}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className={classes.optical_power_values_heading}>
                          <div>
                            <b>RX</b>
                          </div>
                          <div>
                            <b>TX</b>
                          </div>
                        </div>
                        {iPowerType === "mW/dBm" ? (
                          <div className={classes.optical_powers}>
                            {[...Array(4)].map((_, i) => (
                              <div className={classes.optical_power_values}>
                                <div>
                                  <strong>{`[RX${i + 1}] `}</strong>
                                  {iOpticalValues[
                                    `RX${
                                      i + 1
                                    }_POWER` as keyof typeof iOpticalValues
                                  ] || "NA"}
                                </div>
                                <div>
                                  {iOpticalValues[
                                    `TX${
                                      i + 1
                                    }_POWER` as keyof typeof iOpticalValues
                                  ] || "NA"}
                                  <strong>{` [TX${i + 1}]`}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={classes.optical_powers}>
                            {iOpticalPowers.map((v, i) => (
                              <div className={classes.optical_power_values}>
                                <div>
                                  <strong>{`[RX${i + 1}] `}</strong>
                                  {v[`${iPowerType}Rx` as keyof typeof v] ||
                                    "NA"}
                                </div>
                                <div>
                                  {v[`${iPowerType}Tx` as keyof typeof v] ||
                                    "NA"}
                                  <strong>{` [TX${i + 1}]`}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={classes.no_power_values}>
                        No Optical Module present
                      </div>
                    )}
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
                          <b>{`[RX]`}</b> {xConn.Source}
                        </div>
                        <div>
                          {xConn.Destination} <b>{`[TX]`}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell align="center" sx={{ p: 0 }}>
                <div className={classes.endpoint_data}>
                  <div className={classes.power_values}>
                    {tOpticalValues &&
                    Object.keys(tOpticalValues || {}).length > 0 ? (
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 0, minWidth: 120 }}
                          size="small"
                        >
                          <Select
                            labelId="opv-power-t"
                            id="opv-power-t"
                            value={tPowerType}
                            onChange={handleTChange}
                            label=""
                          >
                            {["mW/dBm", "mW", "dBm"].map((powerType) => (
                              <MenuItem
                                className={classes.header_selection_menu_item}
                                value={powerType}
                              >
                                {powerType}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className={classes.optical_power_values_heading}>
                          <div>
                            <b>RX</b>
                          </div>
                          <div>
                            <b>TX</b>
                          </div>
                        </div>
                        {tPowerType === "mW/dBm" ? (
                          <div className={classes.optical_powers}>
                            {[...Array(4)].map((_, i) => (
                              <div className={classes.optical_power_values}>
                                <div>
                                  <strong>{`[RX${i + 1}] `}</strong>
                                  {tOpticalValues[
                                    `RX${
                                      i + 1
                                    }_POWER` as keyof typeof tOpticalValues
                                  ] || "NA"}
                                </div>
                                <div>
                                  {tOpticalValues[
                                    `TX${
                                      i + 1
                                    }_POWER` as keyof typeof tOpticalValues
                                  ] || "NA"}
                                  <strong>{` [TX${i + 1}]`}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={classes.optical_powers}>
                            {tOpticalPowers.map((v, i) => (
                              <div className={classes.optical_power_values}>
                                <div>
                                  <strong>{`[RX${i + 1}] `}</strong>
                                  {v[`${tPowerType}Rx` as keyof typeof v] ||
                                    "NA"}
                                </div>
                                <div>
                                  {v[`${tPowerType}Tx` as keyof typeof v] ||
                                    "NA"}
                                  <strong>{` [TX${i + 1}]`}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={classes.no_power_values}>
                        No Optical Module present
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default OpticalPowerTable;
