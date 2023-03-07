import { useEffect, useState, useRef } from "react";

import {
  Col,
  Link,
  MainTable,
  Row,
  Button,
  Modal,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import { useWindowTitle } from "app/base/hooks/index";
import { NavLink } from "react-router-dom";

import { fetchData } from "../../config";
import { getParsedSummary, getSummaryInventry } from "../../summaryParser";
import { getTypeTitle } from "../../types";
import DSMeterChart from "../View/DSMeterChart";
import DSPieChart from "../View/DSPieChart";

const DashboardView = (): JSX.Element => {
  const mountedRef = useRef(true);
  const abcSummary = new AbortController();
  const abcNode = new AbortController();
  const abcEvent = new AbortController();
  const [cStatus, setCStatus] = useState({
    total: 0,
    counters: { Registered: 0, "Free Node": 0, "In Progress": 0, Failed: 0 },
  });
  // const [expandedRow, setExpandedRow] = useState(-1);
  const [blockStats, setBlockStats] = useState([]);
  const [rn, setRN] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [selectedData, setSelectedData] = useState({ name: "", data: null });

  useWindowTitle("MATRIX-Dashboard");

  const colorCodeNodes = {
    Registered: { color: COLOURS.POSITIVE, link: "positive" },
    Failed: { color: COLOURS.NEGATIVE, link: "negative" },
    "In Progress": { color: COLOURS.LINK_FADED, link: "link-faded" },
    "Free Node": { color: COLOURS.LINK, link: "link" },
  };

  const colorCode = {
    Composed: { color: COLOURS.POSITIVE, link: "positive" },
    Failed: { color: COLOURS.NEGATIVE, link: "negative" },
    Unavailable: { color: COLOURS.LINK_FADED, link: "link-faded" },
    Unused: { color: COLOURS.LINK, link: "link" },
  };

  const getClusterSummary = (summary: any) => {
    setBlockStats(getParsedSummary(summary));
  };

  const getClusterInvetory = (summary: any) => {
    const inv: any = getSummaryInventry(summary);
    setRN(inv);
  };

  const eventStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "p-icon--information";
      case "failed":
        return "p-icon--error";
      default:
        return;
    }
  };

  /*
  const handleClick = (index: any) => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
  };
*/
  const subDeviceCountList = (elm: any) => {
    if (!elm.data) return null;
    const fnd: Array<any> = [];
    const dt: any = elm.data;
    Object.keys(dt).forEach((key: string, index: any) => {
      const std: any = dt[key];
      fnd.push(
        <Row key={"subd" + index + Math.random()}>
          <Col size={12}>
            <div>
              <h5 className="">
                {std.length} {key}
              </h5>
              {drawSubtypeTbl(std)}
            </div>
          </Col>
        </Row>
      );
    });
    return fnd;
  };

  const drawSubtypeTbl = (data: any) => {
    return (
      <table className="drut-dashboard-subtype-table ">
        <tbody>
          <tr key={`hd_${Math.random()}`}>
            {Object.keys(data[0]).map((key, idxth: any) => (
              <th
                className={key === "name" ? "" : "drut-col-name-center"}
                key={`headerth_${idxth}_${Math.random()}`}
              >
                {key === "name" ? "TYPE" : key.toUpperCase()}
              </th>
            ))}
          </tr>
          {data.map((item: any, idxtr: any) => (
            <tr key={`subtype_${Math.random()}`}>
              {Object.keys(item).map((k) => (
                <td
                  className={k === "name" ? "" : "drut-col-name-center"}
                  key={`headertr_${idxtr}_${Math.random()}`}
                >
                  {item[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getEventIformation = (events: any) => {
    return events.map((elm: any, index: number) => {
      return {
        key: (elm.Id || "event") + Math.random(),
        className: "",
        columns: [
          {
            key: "Time",
            className: "time-col",
            content: (
              <span>
                <span style={{ marginRight: "2%" }}>
                  <Tooltip
                    followMouse={true}
                    key={`event_icon_tooltip_${index}`}
                    message={`Event Status: ${elm?.status}`}
                  >
                    <i className={eventStatusIcon(elm?.status)} />
                  </Tooltip>
                </span>
                {elm.created}
              </span>
            ),
          },
          {
            key: "description",
            className: "",
            content: (
              <span>{`${elm.type && elm.type.length ? `${elm.type} - ` : ""}${
                elm.description
              }`}</span>
            ),
          },
        ],
      };
    });
  };

  const renderRSTable = (inv: any) => {
    if (inv && inv.length) {
      return inv.map((elm: any, index: number) => {
        return {
          key: (elm.Id || "rst") + index + Math.random(),
          className: "",
          columns: [
            {
              key: "Type",
              className: "drut-col-dnd",
              content: (
                <span className="drut-device-block-name">
                  <Link
                    color="default"
                    key="nodeNameLink"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedData(elm);
                      setModalState(!modalState);
                    }}
                    title={elm?.name}
                  >
                    {`${getTypeTitle(elm?.name).title}`}
                  </Link>
                </span>
              ),
            },
            {
              key: "Total",
              className: "drut-col-name-center",
              content: <>{elm.total}</>,
            },
            {
              key: "Composed",
              className: "drut-col-name-center",
              content: <>{elm.Composed}</>,
            },
            {
              key: "Unused",
              className: "drut-col-name-center",
              content: <>{elm.Unused}</>,
            },
            {
              key: "Failed",
              className: "drut-col-name-center",
              content: <>{elm.Failed}</>,
            },
            {
              key: "Unavailable",
              className: "drut-col-name-center",
              content: <>{elm.Unavailable}</>,
            },
            {
              key: "Chart",
              className: "drut-col-dnd-auto",
              content: (
                <>
                  <Meter
                    data={[
                      {
                        color: colorCode["Composed"].color,
                        value: elm["Composed"],
                      },
                      {
                        color: colorCode["Unused"].color,
                        value: elm["Unused"],
                      },
                      {
                        color: colorCode["Failed"].color,
                        value: elm["Failed"],
                      },
                      {
                        color: colorCode["Unavailable"].color,
                        value: elm["Unavailable"],
                      },
                    ]}
                    max={elm.total}
                    segmented={false /*elm?.name === "Storage" ? true : false*/}
                    small
                  />
                </>
              ),
            },
          ] /*
          expanded: expandedRow === index,
          expandedContent: (
            <div className="element-container">
              <Row>
                <Col size={12}>{subDeviceCountList(elm)}</Col>
              </Row>
            </div>
          ),*/,
          sortData: {
            name: elm?.name,
            total: elm?.total,
            Composed: elm?.Composed,
            Unused: elm?.Unused,
            Failed: elm?.Failed,
          },
        };
      });
    } else {
      return [];
    }
  };

  const headers = [
    {
      content: "Type",
      sortKey: "name",
      className: "drut-col-dnd",
    },
    {
      content: "Total",
      sortKey: "total",
      className: "drut-col-name-center",
    },
    {
      content: "Composed",
      sortKey: "Composed",
      className: "drut-col-name-center",
    },
    {
      content: "Unused",
      sortKey: "Unused",
      className: "drut-col-name-center",
    },
    {
      content: "Failed",
      sortKey: "Failed",
      className: "drut-col-name-center",
    },
    {
      content: "Unavailable",
      sortKey: "Unavailable",
      className: "drut-col-name-center",
    },
    {
      content: "",
      sortKey: "Chart",
      className: "drut-col-dnd",
    },
  ];
  const getsChart = (states: any) => {
    const fn: Array<any> = [];
    if (states) {
      let idx = 0;
      states.forEach((elm: any, index: number) => {
        idx++;
        const box = "box" + idx;
        if (idx === 3) {
          idx = 0;
        }

        if (elm.chart === "PIE") {
          fn.push(
            <DSPieChart
              box={box}
              colorCode={colorCode}
              data={elm}
              key={`${elm.chart}_${index}_${+Math.random()}`}
            />
          );
        } else {
          fn.push(
            <DSMeterChart
              box={box}
              colorCode={colorCode}
              data={elm}
              key={`${elm.chart}_${index}_${Math.random()}`}
            />
          );
        }
      });
    }
    return (
      <>
        <div className="overall-dashboard-card">{fn.slice(0, 3)}</div> <hr />
        <div className="overall-dashboard-card">{fn.slice(3, fn.length)}</div>
      </>
    );
  };

  const getSummaryData = () => {
    setLoading(true);
    fetchData("dfab/summary/", false, abcSummary.signal)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          setLoading(false);
          if (result) {
            getClusterSummary(result);
            getClusterInvetory(result);
          }
        },
        (error: any) => {
          console.log(error);
          if (!mountedRef.current) return;
          setLoading(false);
        }
      );
  };

  const getEventData = (): any => {
    setLoading(true);
    fetchData(
      "dfab/events/?op=query&limit=10&dashboard=true",
      false,
      abcEvent.signal
    )
      .then((response: any) => response.json())
      .then(
        (result: any): any => {
          setLoading(false);
          if (result.events && result.events.length) {
            setEvents(result.events);
          }
        },
        (error: any): any => {
          console.log(error);
          if (!mountedRef.current) return;
          setLoading(false);
        }
      );
  };

  const getNodesData = (): any => {
    fetchData("dfab/nodes/", false, abcNode.signal)
      .then((response: any) => response.json())
      .then(
        (result: any): any => {
          setLoading(false);
          if (result && result.length) {
            const totalNodes = result.length;
            const trNodes = result.filter(
              (nd: any) =>
                nd.MachineId && (nd.MachineId !== null || nd.MachineId !== "")
            ).length;

            const trnpNodes = result.filter(
              (nd: any) =>
                nd.MachineId &&
                (nd.MachineId !== null || nd.MachineId !== "") &&
                nd.DataPathCreationOrderStatus === "IN_PROGRESS"
            ).length;

            const tpNodes = result.filter(
              (nd: any) => nd.DataPathCreationOrderStatus === "IN_PROGRESS"
            ).length;

            const tfNodes = result.filter(
              (nd: any) =>
                nd.Status &&
                nd.Status.Health !== "OK" &&
                nd.DataPathCreationOrderStatus !== "IN_PROGRESS"
            ).length;

            const dt = {
              total: totalNodes,
              counters: {
                "Free Node": totalNodes + trnpNodes - tpNodes - trNodes,
                Registered: trNodes,
                Failed: tfNodes,
                "In Progress": tpNodes,
              },
            };

            setCStatus(dt);
          }
        },
        (error: any): any => {
          console.log(error);
          if (!mountedRef.current) return;
          setLoading(false);
        }
      );
  };

  useEffect(() => {
    getSummaryData();
    getEventData();
    getNodesData();
    return () => {
      // Cleaning subscription
      mountedRef.current = false;
      abcSummary.abort();
      abcNode.abort();
      abcEvent.abort();
    };
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Row>
            <Col size={12}>
              <div className="drut-dashboard-summary-card-ns">
                <h4 className="p-muted-heading drut-db-head">
                  <NavLink to="/drut-cdi/resources">
                    RESOURCE BLOCK SUMMARY&nbsp;›
                  </NavLink>
                </h4>
                <hr />
                <div>{getsChart(blockStats)}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col size={8}>
              <div className="drut-dashboard-summary-card-ns">
                <h4 className="p-muted-heading drut-db-head">
                  <NavLink to="/drut-cdi/resources">
                    Devices Summary&nbsp;›
                  </NavLink>
                </h4>
                <hr />
                <MainTable
                  className="drut-items-border drut-bg-white"
                  emptyStateMsg="Resource data not available."
                  expanding
                  headers={headers}
                  key="nodeListTable"
                  responsive={false}
                  rows={renderRSTable(rn)}
                  sortable
                />
              </div>
            </Col>
            <Col size={4}>
              <div className="drut-dashboard-summary-card-ns">
                <div className="drut-dashboard-info-box-1">
                  <h4 className="p-muted-heading drut-db-head">
                    <NavLink to="/drut-cdi/nodes">Node Summary&nbsp;›</NavLink>
                  </h4>
                  <hr />
                  <div
                    className="drut-items-border drut-bg-white"
                    style={{
                      padding: "4px",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <DSPieChart
                        box={"box1"}
                        colorCode={colorCodeNodes}
                        data={{
                          chart: "PIE",
                          position: 0,
                          total: cStatus.total,
                          totalTitle: "Nodes",
                          title: "Nodes",
                          counters: cStatus.counters || [],
                          data: null,
                          unit: "",
                        }}
                        key={`NodeStatusKey`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col size={12}>
              <div className="drut-dashboard-summary-card1">
                <div className="drut-dashboard-info-box-1">
                  <h4
                    className="p-muted-heading drut-db-head"
                    style={{ maxWidth: "100%" }}
                  >
                    <NavLink to="/drut-cdi/dfab-events">
                      Event Summary&nbsp;›
                    </NavLink>
                    <span style={{ float: "right" }}>10 Latest</span>
                  </h4>
                  <hr />
                  <div className="dashboard-event-container1">
                    <MainTable
                      className="drut-items-border drut-bg-white event-logs-table"
                      rows={getEventIformation(events)}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}

      {/* Modal for the count details*/}
      <Modal
        open={modalState}
        style={{
          display: modalState ? "flex" : "none",
          padding: "2rem 4rem",
        }}
      >
        <div
          aria-describedby="modal-description"
          aria-labelledby="modal-title"
          aria-modal="true"
          className=""
          role="dialog"
          style={{ minWidth: "500px" }}
        >
          <header className="p-modal__header">
            <h2 className="p-modal__title" id="modal-title">
              {selectedData?.name === "ComputerSystem"
                ? "DPU"
                : selectedData?.name}{" "}
              {""} Stats
            </h2>
            <Button
              aria-controls="modal"
              aria-label="Close active modal"
              className="p-modal__close"
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
                <Col size={12}>{subDeviceCountList(selectedData)}</Col>
              </Row>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DashboardView;
