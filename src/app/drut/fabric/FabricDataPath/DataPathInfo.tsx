import { useState, useEffect } from "react";

import {
  Button,
  Col,
  Link,
  Modal,
  Row,
  Tooltip,
} from "@canonical/react-components";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { styled, ThemeProvider } from "@mui/material/styles";

import classess from "./FabricDataPath.module.css";

import { fetchTxRxData } from "app/drut/api";
import {
  Accordion1 as Accordion,
  AccordionDetails,
  AccordionSummary,
} from "app/drut/components/accordion";
import customDrutTheme from "app/utils/Themes/Themes";

interface Props {
  data: any;
  isList: boolean;
}

const DataPathInfo = ({ data, isList }: Props): JSX.Element => {
  const [modalState, setModalState] = useState(false);
  const [powerData, setPowerData] = useState({ dt: null, type: "" });
  const [parentExpanded, setParentExpanded] = useState([] as string[]);

  const TableCell = styled(MuiTableCell)(({ theme }) => ({
    "&.MuiTableCell-root": {
      wordBreak: "break-all",
    },
  }));

  useEffect(() => {
    if (typeof data !== "string") {
      const targetRBs: any[] = (data?.ConnectedResourceBlocks as []).map(
        (cRb: any) => cRb?.TargetResourceBlock?.Id
      );
      setParentExpanded(targetRBs);
    }
  }, []);

  const handleParentChange = (panel: any) => (event: any, newExpanded: any) => {
    setParentExpanded((prev: any) =>
      newExpanded
        ? [...prev, panel]
        : [...prev.filter((expVal: string) => expVal !== panel)]
    );
  };

  const getTxRXInfo = (sw: any = "", prt: any = "", type: any) => {
    setModalState(!modalState);
    fetchTxRxData(sw, prt)
      .then((dt: any) => {
        setPowerData({ dt: dt, type: type });
      })
      .catch((e) => {
        console.log(e);
      });
    return "No information";
  };

  const getPowerInfo = (powerData: any) => {
    const arr: any = [];
    if (powerData.dt) {
      Object.keys(powerData.dt).forEach((k) => {
        if (k.indexOf(powerData.type) === 0) {
          arr.push(
            <tr>
              <td>{k}</td>
              <td style={{ width: "15px" }}>:</td>
              <td>{powerData.dt[k]}</td>
            </tr>
          );
        }
      });
    }
    return (
      <div style={{ maxWidth: "350px" }}>
        <h3>Port Name: {powerData?.dt?.Name || ""}</h3>
        <table>{arr}</table>
      </div>
    );
  };

  const getStatusIcon = (healthStatus: any) =>
    healthStatus === "OK"
      ? "p-icon--status-succeeded-small"
      : "p-icon--status-failed-small";

  const dataPathAccordionDoM =
    typeof data !== "string" &&
    data?.ConnectedResourceBlocks?.map((connectedRB: any, pIndex: number) => (
      <Accordion
        expanded={parentExpanded.includes(connectedRB?.TargetResourceBlock?.Id)}
        onChange={handleParentChange(connectedRB?.TargetResourceBlock?.Id)}
      >
        <AccordionSummary
          className={isList ? classess.list_view : ""}
          aria-controls={`_${pIndex}_content`}
          id={`_${pIndex}_header`}
        >
          <Typography>{`${connectedRB?.InitiatorResourceBlock?.Name} > ${connectedRB?.TargetResourceBlock?.Name}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650, margin: 0 }}
              size="small"
              aria-label="simple table"
            >
              <TableHead className={isList ? classess.list_view : ""}>
                <TableRow>
                  <TableCell className={classess.status_col} align="center">
                    Health
                  </TableCell>
                  <TableCell
                    className={classess.datapath_id_col}
                    align="center"
                  >
                    Data Path ID
                  </TableCell>
                  <TableCell align="center" className={classess.initiator_col}>
                    {`${connectedRB?.InitiatorResourceBlock?.Name} (Initiator)`}
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classess.crossconnect_col}
                  >
                    Cross Connect
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classess.resourceblock_col}
                  >
                    {`${connectedRB?.TargetResourceBlock?.Name} (Target)`}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!connectedRB?.DataPath?.length ? (
                  <tr key={`trc1-${pIndex}_${Math.random()}`}>
                    <td
                      colSpan={6}
                    >{`Data path missing for ${connectedRB?.InitiatorResourceBlock?.Name} > ${connectedRB?.TargetResourceBlock?.Name}`}</td>
                  </tr>
                ) : null}
                {(connectedRB.DataPath as []).map(
                  (cRbDP: any, cIndex: number) => {
                    return (cRbDP?.ConnectedRemoteEndpoints as []).map(
                      (cRbDpEP: any, c1Index: number) => {
                        return (
                          <TableRow
                            className={`drut-dp-${
                              (cIndex + 1) % 2 ? "odd" : "even"
                            }`}
                          >
                            <TableCell
                              className={`${classess.status_col} ${classess.border_right}`}
                              align="center"
                              key={`drut-dp-${c1Index}_${Math.random()}`}
                            >
                              <Tooltip
                                key={`tp_${Math.random()}`}
                                className="doughnut-chart__tooltip"
                                followMouse={true}
                                message={`Health Status: ${cRbDpEP?.PathToRemoteEndpoint?.Status?.Health}`}
                                position="btm-center"
                              >
                                <i
                                  style={{ height: "1.8rem", width: "1.8rem" }}
                                  className={getStatusIcon(
                                    cRbDpEP?.PathToRemoteEndpoint?.Status
                                      ?.Health
                                  )}
                                ></i>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              className={`${classess.datapath_id_col} ${classess.border_right}`}
                            >
                              {cRbDpEP.PathToRemoteEndpoint?.DataPathId}
                            </TableCell>
                            <TableCell
                              className={`${classess.border_right} ${
                                isList ? classess.initiator_col : ""
                              }`}
                            >
                              <div className={`${classess.flex_data}`}>
                                <div>{cRbDP.InitiatorEndpoint?.Name}</div>
                                <div>
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Initiator?.PORT?.UpstreamPort
                                      ?.PcieSegment
                                  }
                                  {">"}
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Initiator?.PORT?.DownstreamPort
                                      ?.PcieSegment
                                  }
                                  <br />
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Initiator?.PORT?.UpstreamPort
                                      ?.PcieSegment
                                  }
                                  {"<"}
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Initiator?.PORT?.DownstreamPort
                                      ?.PcieSegment
                                  }
                                </div>
                                <div>
                                  <Link
                                    className={"drut-tooltip-link"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getTxRXInfo(
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.SwitchId,
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.PcieSegment,
                                        "TX"
                                      );
                                    }}
                                  >
                                    {`[Tx]${
                                      cRbDpEP?.PathToRemoteEndpoint?.Segments
                                        ?.Initiator?.PORT?.DownstreamPort
                                        ?.OpticalModule?.Name || "NA"
                                    }`}
                                  </Link>
                                  <br />
                                  <Link
                                    className={"drut-tooltip-link"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getTxRXInfo(
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.SwitchId,
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.PcieSegment,
                                        "RX"
                                      );
                                    }}
                                  >
                                    {`[Rx]${
                                      cRbDpEP?.PathToRemoteEndpoint?.Segments
                                        ?.Initiator?.PORT?.DownstreamPort
                                        ?.OpticalModule?.Name || "NA"
                                    }`}
                                  </Link>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className={`${classess.border_right} ${
                                isList ? classess.crossconnect_col : ""
                              }`}
                            >
                              {cRbDpEP?.PathToRemoteEndpoint?.Segments
                                ?.XConnects &&
                              cRbDpEP?.PathToRemoteEndpoint?.Segments?.XConnects
                                ?.length ? (
                                <>
                                  {cRbDpEP?.PathToRemoteEndpoint?.Segments?.XConnects?.map(
                                    (xc: any) => {
                                      return (
                                        <div>
                                          <div
                                            className={`${classess.cross_connect_flex}`}
                                          >
                                            <div>
                                              {/* (Array(Math.max(num1, num2)).fill(0)) */}
                                              {`${xc?.Source?.Name}(${
                                                xc?.Source?.Port?.length === 1
                                                  ? "0" + xc?.Source?.Port
                                                  : xc?.Source?.Port
                                              })`}
                                            </div>
                                            {">"}
                                            <div>
                                              {`${xc?.Destination?.Name}(${
                                                xc?.Destination?.Port
                                                  ?.length === 1
                                                  ? "0" + xc?.Destination?.Port
                                                  : xc?.Destination?.Port
                                              })`}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              ) : (
                                "No xConnects"
                              )}
                            </TableCell>
                            <TableCell
                              className={`${
                                isList ? classess.resourceblock_col : ""
                              }`}
                            >
                              <div className={`${classess.flex_data}`}>
                                <div>
                                  <Link
                                    className={"drut-tooltip-link"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getTxRXInfo(
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.SwitchId,
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.PcieSegment,
                                        "RX"
                                      );
                                    }}
                                  >
                                    {`[Rx]${
                                      cRbDpEP?.PathToRemoteEndpoint?.Segments
                                        ?.Target?.PORT?.UpstreamPort
                                        ?.OpticalModule?.Name || "NA"
                                    }`}{" "}
                                  </Link>
                                  <br />
                                  <Link
                                    className={"drut-tooltip-link"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getTxRXInfo(
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.SwitchId,
                                        cRbDpEP?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.PcieSegment,
                                        "TX"
                                      );
                                    }}
                                  >
                                    {`[Tx]${
                                      cRbDpEP?.PathToRemoteEndpoint?.Segments
                                        ?.Target?.PORT?.UpstreamPort
                                        ?.OpticalModule?.Name || "NA"
                                    }`}
                                  </Link>
                                </div>
                                <div>
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Target?.PORT?.UpstreamPort?.PcieSegment
                                  }
                                  {">"}
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Target?.PORT?.DownstreamPort
                                      ?.PcieSegment
                                  }
                                  {<br />}
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Target?.PORT?.UpstreamPort?.PcieSegment
                                  }
                                  {"<"}
                                  {
                                    cRbDpEP?.PathToRemoteEndpoint?.Segments
                                      ?.Target?.PORT?.DownstreamPort
                                      ?.PcieSegment
                                  }
                                </div>
                                <div>{cRbDP?.TargetEndpoint?.Name}</div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    ));

  return (
    <>
      {typeof data === "string" && <p>{data}</p>}
      {typeof data !== "string" && (
        <ThemeProvider theme={customDrutTheme}>
          {dataPathAccordionDoM}
        </ThemeProvider>
      )}
      {/* Modal for the count details*/}
      <Modal
        id="power-info"
        open={modalState}
        style={{
          display: modalState ? "flex" : "none",
          padding: "2rem 4rem",
        }}
      >
        <div
          className=""
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <header className="p-modal__header">
            <h2 className="p-modal__title" id="modal-title">
              {"Power Information"}
            </h2>
            <Button
              className="p-modal__close"
              aria-label="Close active modal"
              aria-controls="modal"
              onClick={() => {
                setModalState(!modalState);
              }}
            >
              Close
            </Button>
          </header>
          <div style={{ maxHeight: "600px", overflow: "auto" }}>
            <div className="element-container">
              <Row>
                <Col size={12}>{getPowerInfo(powerData)}</Col>
              </Row>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DataPathInfo;
