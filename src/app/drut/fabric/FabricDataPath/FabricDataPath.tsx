import { useState, useEffect } from "react";

import { Row, Col, Link, Modal, Button } from "@canonical/react-components";

import { fetchData } from "../../config";

interface Props {
  data: any;
  dp?: any;
  onDataChange?: any;
  isList: boolean;
}

const FabricDataPath = ({
  data,
  dp,
  onDataChange,
  isList,
}: Props): JSX.Element => {
  const [pathData, setPathData] = useState([]);

  const [activeState, setActiveState]: [any, any] = useState(dp);
  const isOdd = (num: any) => {
    return num % 2;
  };
  const [modalState, setModalState] = useState(false);
  const [powerData, setPowerData] = useState({ dt: null, type: "" });

  const getClass = (index: number, data: any, location: any = "") => {
    try {
      let cstring = "";
      if (data?.length === 1) {
        cstring = "drut-tb-bottom";
      }
      if (location === "M") {
        if (index === 0) {
          return `drut-tb-top ${cstring}`;
        } else if (index + 1 === data?.length) {
          return `drut-tb-bottom`;
        }
      } else {
        if (index === 0) {
          return `drut-tb-top  ${cstring} ${
            location === "L" ? "drut-tb-left" : "drut-tb-right"
          }`;
        } else if (index + 1 === data?.length) {
          return `drut-tb-bottom ${
            location === "L" ? "drut-tb-left" : "drut-tb-right"
          }`;
        } else {
          return location === "L" ? "drut-tb-left" : "drut-tb-right";
        }
      }
      return "";
    } catch (err: any) {
      console.error(err);
      return "";
    }
  };

  const getToolTip = (sw: any = "", prt: any = "", type: any) => {
    setModalState(!modalState);
    fetchData(`dfab/opticalmodule/?switch=${sw}&port=${prt}`)
      .then((response: any) => {
        return response.json();
      })
      .then((dt: any) => {
        setPowerData({ dt: dt, type: type });
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

  const changeSate = (index: any) => {
    activeState[index] = !activeState[index];
    onDataChange(activeState);
    setActiveState(activeState);
    setTimeout(() => {
      setPathData(
        generateRowsDataPath(data?.ConnectedResourceBlocks || [], activeState)
      );
    }, 0);
  };

  const getExpSTatus = (dp: any, index: any) => {
    return dp[index];
  };

  const generateRowsDataPath = (dt: any, dp: any) => {
    try {
      if (dt && dt?.length) {
        return dt?.map((d: any, midx: any) => {
          return (
            <li
              key={`list_${midx}_key${Math.random()}`}
              className="p-accordion__group111"
            >
              <div
                key={`div1-${midx}_${Math.random()}`}
                role="heading"
                className="p-accordion__heading"
                style={{ display: isList ? "none" : "" }}
              >
                <button
                  key={`btn1-${midx}_${Math.random()}`}
                  type="button"
                  className="p-accordion__tab"
                  id={`${midx}_id`}
                  aria-controls={`${midx}_id_sec`}
                  aria-expanded={getExpSTatus(dp, midx + 1)}
                  onClick={() => changeSate(midx + 1)}
                >
                  {activeState[midx + 1]}
                  {`${midx + 1} ${d?.InitiatorResourceBlock?.Name} > ${
                    d?.TargetResourceBlock?.Name
                  }`}
                </button>
              </div>
              <section
                className="p-accordion__panel"
                key={`sec1-${midx}_${Math.random()}`}
                id={`${midx}_id_sec`}
                aria-hidden={!activeState[midx + 1]}
                aria-labelledby={`${midx}_id`}
              >
                <table
                  key={`tbl1-${midx}_${Math.random()}`}
                  style={{ tableLayout: "auto", width: "calc(100% - 2px)" }}
                >
                  <thead style={{ display: isList ? "none" : "" }}>
                    <tr key={`tr1-${midx}_${Math.random()}`}>
                      <th style={{ width: "10px" }}></th>
                      <th style={{ width: "20px" }}></th>
                      <th
                        colSpan={3}
                        style={{ width: "30%", textAlign: "left" }}
                      >
                        {d?.InitiatorResourceBlock?.Name} (Initiator)
                      </th>
                      <th>Cross Connect</th>
                      <th
                        colSpan={3}
                        style={{ width: "30%", textAlign: "center" }}
                      >
                        {d?.TargetResourceBlock?.Name} (Target)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!d?.DataPath?.length ? (
                      <tr key={`trc1-${midx}_${Math.random()}`}>
                        <td
                          colSpan={6}
                        >{`Data path missing for ${d?.InitiatorResourceBlock?.Name} > ${d?.TargetResourceBlock?.Name}`}</td>
                      </tr>
                    ) : null}
                    {d?.DataPath?.map((pt: any, index: any) => {
                      return (
                        <>
                          {pt?.ConnectedRemoteEndpoints &&
                          pt?.ConnectedRemoteEndpoints?.length ? (
                            <>
                              {pt?.ConnectedRemoteEndpoints?.map((cre: any) => {
                                return (
                                  <tr
                                    key={`drut-dp-${index}_${Math.random()}`}
                                    className={`drut-dp-${
                                      isOdd(index + 1) ? "odd" : "even"
                                    }`}
                                  >
                                    <td
                                      style={{ verticalAlign: "middle" }}
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "L"
                                      )}
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      style={{ verticalAlign: "middle" }}
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "M"
                                      )}
                                    >
                                      <div
                                        className={`drut-status drut-color-${
                                          cre?.PathToRemoteEndpoint?.Status
                                            ?.Health === "OK"
                                            ? "green"
                                            : "red"
                                        }`}
                                      ></div>
                                    </td>
                                    <td
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "L"
                                      )}
                                    >
                                      {pt?.InitiatorEndpoint?.Name}
                                    </td>
                                    <td
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "M"
                                      )}
                                    >
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.UpstreamPort
                                          ?.PcieSegment
                                      }
                                      {">"}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.PcieSegment
                                      }
                                      {<br />}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.UpstreamPort
                                          ?.PcieSegment
                                      }
                                      {"<"}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Initiator?.PORT?.DownstreamPort
                                          ?.PcieSegment
                                      }
                                    </td>
                                    <td
                                      style={{ minWidth: "100px" }}
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "R"
                                      )}
                                    >
                                      <Link
                                        className={"drut-tooltip-link"}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getToolTip(
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Initiator?.PORT?.DownstreamPort
                                              ?.SwitchId,
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Initiator?.PORT?.DownstreamPort
                                              ?.PcieSegment,
                                            "TX"
                                          );
                                        }}
                                      >
                                        {`[Tx]${
                                          cre?.PathToRemoteEndpoint?.Segments
                                            ?.Initiator?.PORT?.DownstreamPort
                                            ?.OpticalModule?.Name || "NA"
                                        }`}
                                      </Link>
                                      <br />
                                      <Link
                                        className={"drut-tooltip-link"}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getToolTip(
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Initiator?.PORT?.DownstreamPort
                                              ?.SwitchId,
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Initiator?.PORT?.DownstreamPort
                                              ?.PcieSegment,
                                            "RX"
                                          );
                                        }}
                                      >
                                        {`[Rx]${
                                          cre?.PathToRemoteEndpoint?.Segments
                                            ?.Initiator?.PORT?.DownstreamPort
                                            ?.OpticalModule?.Name || "NA"
                                        }`}
                                      </Link>
                                    </td>
                                    <td
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "M"
                                      )}
                                    >
                                      {cre?.PathToRemoteEndpoint?.Segments
                                        ?.XConnects &&
                                      cre?.PathToRemoteEndpoint?.Segments
                                        ?.XConnects?.length ? (
                                        <span>
                                          {cre?.PathToRemoteEndpoint?.Segments?.XConnects?.map(
                                            (xc: any) => {
                                              return (
                                                <span>
                                                  {`${xc?.Source?.Name}(${xc?.Source?.Port})`}
                                                  {">"}
                                                  {`${xc?.Destination?.Name}(${xc?.Destination?.Port})`}
                                                  <br />
                                                </span>
                                              );
                                            }
                                          )}
                                        </span>
                                      ) : (
                                        "No xConnects"
                                      )}
                                    </td>
                                    <td
                                      style={{ minWidth: "100px" }}
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "L"
                                      )}
                                    >
                                      <Link
                                        className={"drut-tooltip-link"}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getToolTip(
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Target?.PORT?.UpstreamPort
                                              ?.SwitchId,
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Target?.PORT?.UpstreamPort
                                              ?.PcieSegment,
                                            "RX"
                                          );
                                        }}
                                      >
                                        {`[Rx]${
                                          cre?.PathToRemoteEndpoint?.Segments
                                            ?.Target?.PORT?.UpstreamPort
                                            ?.OpticalModule?.Name || "NA"
                                        }`}{" "}
                                      </Link>
                                      <br />
                                      <Link
                                        className={"drut-tooltip-link"}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getToolTip(
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Target?.PORT?.UpstreamPort
                                              ?.SwitchId,
                                            cre?.PathToRemoteEndpoint?.Segments
                                              ?.Target?.PORT?.UpstreamPort
                                              ?.PcieSegment,
                                            "TX"
                                          );
                                        }}
                                      >
                                        {`[Tx]${
                                          cre?.PathToRemoteEndpoint?.Segments
                                            ?.Target?.PORT?.UpstreamPort
                                            ?.OpticalModule?.Name || "NA"
                                        }`}
                                      </Link>
                                    </td>
                                    <td
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "M"
                                      )}
                                    >
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.PcieSegment
                                      }
                                      {">"}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.DownstreamPort
                                          ?.PcieSegment
                                      }
                                      {<br />}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.UpstreamPort
                                          ?.PcieSegment
                                      }
                                      {"<"}
                                      {
                                        cre?.PathToRemoteEndpoint?.Segments
                                          ?.Target?.PORT?.DownstreamPort
                                          ?.PcieSegment
                                      }
                                    </td>
                                    <td
                                      className={getClass(
                                        index,
                                        d?.DataPath,
                                        "R"
                                      )}
                                    >
                                      {pt?.TargetEndpoint?.Name}
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : null}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </li>
          );
        });
      } else {
        return [];
      }
    } catch (err: any) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    setPathData(generateRowsDataPath(data?.ConnectedResourceBlocks || [], dp));
  }, [dp, activeState]);

  return (
    <>
      <Row>
        <Col size={12}>
          <aside className="p-accordion11">
            <ul className="p-accordion__list">{pathData}</ul>
            {pathData.length < 1 ? "Data path information not available." : ""}
          </aside>
        </Col>
      </Row>
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

export default FabricDataPath;
