import { useEffect, useState, useRef, Fragment } from "react";

import {
  Col,
  ContextualMenu,
  MainTable,
  Notification,
  SearchBox,
  Row,
  Tooltip,
  Spinner,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";

import { fetchData, deleteData, throwHttpMessage } from "../../config";
import { nodeStatus, nStatus } from "../../nodeStatus";
import RegisterMachineForm from "../RegisterNode/RegisterNode";

import classess from "./NodeList.module.css";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  page: any;
  onNodeDetail: any;
  dataId: any;
};

const NodeList = ({ page, onNodeDetail }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const abortController = new AbortController();
  const abcFabric = new AbortController();
  const abcDataPath = new AbortController();
  const abcEvent = new AbortController();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const [nodeFullData, setNodeFullData] = useState([]);
  const [nodes, setNodes] = useState([]);
  const filteredMachines = useSelector((state: RootState) => {
    return machineSelectors.search(state, '', []);
  });

  localStorage.setItem("myFavoriteSandwich", "tuna");
  if (localStorage.getItem("matching-machine") === null) {
    localStorage.setItem("matching-machine", JSON.stringify([]));
  }

  filteredMachines.forEach((element: any) => {
    if (element.hardware_uuid && element.hardware_uuid !== null) {
      const dt: any = localStorage.getItem("matching-machine");
      const ls: any = JSON.parse(dt);
      const chk = ls.find(
        (dt: any) =>
          dt.hardware_uuid.toLowerCase() === element.hardware_uuid.toLowerCase()
      );
      if (!chk) {
        ls.push({
          hardware_uuid: element.hardware_uuid,
          system_id: element.system_id,
          fqdn: element.fqdn,
        });
        localStorage.setItem("matching-machine", JSON.stringify(ls));
      }
    }
  });

  useEffect(() => {
    filteredMachines.forEach((dt: any) => {
      dispatch(machineActions.get(dt.system_id, ''));
      dispatch(machineActions.setActive(dt.system_id));
    });

    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
      // Clean up any machine errors etc. when closing the details.
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);

  const parms: any = useParams();
  let setTimeOut: any;
  const [rData, setrData] = useState({
    rfu: "",
    user: "",
    pass: "",
    protocol: "",
    details: { id: "", name: "", mac: [] },
  });
  // const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fabrics, setFabrics]: [any, any] = useState([]);
  const [isRegister, setIsRegister] = useState(false);

  const getNodesData = (fetch = false) => {
    setSearchText("");
    setLoading(!fetch);
    fetchData("dfab/nodes/", false, abortController.signal)
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then(
        (dt: any) => {
          if (dt && dt.length) {
            const inProgress = dt.find((d: any) =>
              nStatus.includes(d.DataPathCreationOrderStatus)
            );
            if (inProgress !== undefined) {
              setTimeOut = setTimeout(() => {
                clearTimeout(setTimeOut);
                if (parms.id === undefined) {
                  getNodesData(true);
                }
              }, 6000);
            }
            const result = dt.map((dt: any) => {
              if (!dt.MachineName) {
                dt.MachineName = "";
              }

              return dt;
            });

            setNodes(result);
            setNodeFullData(result);
            if (!parms || !parms.id) {
              //  nodeDetails(parms.id);
              onNodeDetail(null);
            }
          } else {
            setNodes([]);
          }
          setLoading(false);
        },
        (error: any) => {
          setLoading(false);
          console.log(error);
        }
      );
  };

  async function getFabricsData() {
    await fetchData("dfab/fabrics/", false, abcFabric.signal)
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then(
        (result: any) => {
          if (result) {
            setFabrics(result);
          }
        },
        (error: any) => {
          setLoading(false);
          console.log(error);
        }
      );
  }

  const deleteNode = (node: any) => {
    setLoading(true);
    deleteData(`dfab/nodes/${node.Id}/`)
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then(
        () => {
          getNodesData();
        },
        (error: any) => {
          getNodesData();
          setLoading(false);
          console.log(error);
        }
      );
  };

  const getDpCreationOrderStatusIcon = (composedNodeState: string) => {
    if (composedNodeState === "COMPLETED") {
      return "p-icon--success";
    } else if (composedNodeState === "IN_PROGRESS") {
      return "p-icon--status-in-progress";
    } else if (composedNodeState === "FAILED") {
      return "p-icon--error";
    } else if (composedNodeState === "PENDING") {
      return "p-icon--status-waiting";
    } else return
  };

  const getStatusIcon = (node: any) =>
    node?.Status?.Health === "OK"
      ? "p-icon--status-succeeded-small"
      : "p-icon--status-failed-small";

  const generateRows = (nodes: any) => {
    if (nodes && nodes.length) {
      return nodes.map((node: any, index: number) => {
        return {
          key: `${node.Id}_${index}_${Math.random()}`,
          className: "",
          columns: [
            {
              key: `HealthStatus_${index}_${Math.random()}`,
              content: (
                <Tooltip
                  key={`tp_${Math.random()}`}
                  className="doughnut-chart__tooltip"
                  followMouse={true}
                  message={`Health Status: ${node?.Status?.Health}`}
                  position="btm-center"
                >
                  <i
                    style={{ height: "1.8rem", width: "1.8rem" }}
                    className={getStatusIcon(node)}
                  ></i>
                </Tooltip>
              ),
              className: "drut-col-sn",
            },
            {
              key: `DataPathCreationOrderStatus_${index}_${Math.random()}`,
              content: (
                <span className={classess["datapath-creation-order-status"]}>
                  <Tooltip
                    key={`tp_${Math.random()}`}
                    className="doughnut-chart__tooltip"
                    followMouse={true}
                    message={`Datapath Creation Order Status: ${node?.DataPathCreationOrderStatus}`}
                    position="btm-center"
                  >
                    <i
                      className={getDpCreationOrderStatusIcon(
                        node?.DataPathCreationOrderStatus
                      )}
                    ></i>
                  </Tooltip>
                  <span
                    className={classess["datapath-status"]}
                  >{`(${node?.DataPathCreationOrderStatus})`}</span>
                </span>
              ),
              className: "drut-col-sn",
            },
            {
              key: `nodeName_${index}_${Math.random()}`,
              content: (
                <NavLink
                  key={`lnnode_${Math.random()}`}
                  title={node?.Name}
                  to={`/drut-cdi/nodes/${node?.Id || ""}`}
                >
                  {node?.Name}
                </NavLink>
              ),
              className: "drut-col-name-center",
            },
            {
              key: `Processor_${index}_${Math.random()}`,
              content: (
                <span>{`${node?.ProcessorSummary?.Count || 0} (Cores: ${
                  node?.ProcessorSummary?.TotalCores || 0
                })`}</span>
              ),
              className: "drut-col-name-center",
            },
            {
              key: `Memory_${index}_${Math.random()}`,
              content: (
                <span>{`${
                  node?.MemorySummary?.TotalSystemMemoryGiB || 0
                } GB`}</span>
              ),
              className: "drut-col-name-center",
            },
            {
              key: `Network_${index}_${Math.random()}`,
              content: <span>{`${node?.NetworkSummary?.Count || 0}`}</span>,
              className: "drut-col-name-center",
            },
            {
              key: `Offload_${index}_${Math.random()}`,
              content: <span>{`${node?.OffloadSummary?.Count || 0}`}</span>,
              className: "drut-col-name-center",
            },
            {
              key: `MachineName_${index}_${Math.random()}`,
              content: (
                <div>
                  {node?.MachineId ? (
                    <NavLink
                      key={`machine_${Math.random()}`}
                      to={`/machine/${node?.MachineId || ""}/summary`}
                    >
                      {node?.MachineFqdn || node?.MachineName || "NA"}
                    </NavLink>
                  ) : (
                    "-"
                  )}
                </div>
              ),
              className: "drut-col-name-center",
            },
            {
              content: getStatusLink(node),
              className: "drut-table-btn",
            },
          ],
          sortData: {
            Name: node.Name,
            MachineName: node?.MachineName,
            ProcessorSummary: node?.ProcessorSummary?.Count,
            MemorySummary: node?.MemorySummary?.TotalSystemMemoryGiB,
            NetworkSummary: node?.NetworkSummary?.Count,
            OffloadSummary: node?.OffloadSummary?.Count,
            HealthStatus: node?.Status?.Health,
          },
        };
      });
    } else {
      return [];
    }
  };

  const getStatusLink = (node: any) => {
    if (node?.MachineId) {
      if (node?.DataPathCreationOrderStatus === "IN_PROGRESS") {
        return (
          <Tooltip
            className="doughnut-chart__tooltip"
            followMouse={true}
            message={`${
              nodeStatus(node?.DataPathCreationOrderStatus).message
            } on this Machine.`}
            position="btm-center"
          >
            <Spinner key="statusSpinner" />
          </Tooltip>
        );
      } else {
        return "-";
      }
    }
    if (nodeStatus(node?.DataPathCreationOrderStatus).status) {
      return (
        <Tooltip
          className="doughnut-chart__tooltip"
          followMouse={true}
          message={`${nodeStatus(node?.DataPathCreationOrderStatus).message}`}
          position="btm-center"
        >
          <Spinner key="statusSpinner" />
        </Tooltip>
      );
    } else {
      return (
        <ContextualMenu
          key={`cmenu_${Math.random()}`}
          data-testid="row-menu"
          hasToggleIcon={true}
          links={[
            {
              children: "Delete Node",
              "data-test": "delete-node-link",
              onClick: () => deleteNode(node),
            },
            {
              children: "Register Node",
              "data-test": "register-node-link",
              onClick: () => registerNode(node),
            },
          ]}
        />
      );
    }
  };

  const headers = [
    {
      content: "Health",
      sortKey: "HealthStatus",
      className: "drut-col-sn",
    },
    {
      content: "Datapath Status",
      sortKey: "DatapathCreationOrderStatus",
      className: "drut-col-name-center",
    },
    {
      content: "Name",
      sortKey: "Name",
      className: "drut-col-name-center",
    },
    {
      content: "Processor",
      sortKey: "ProcessorSummary",
      className: "drut-col-name-center",
    },
    {
      content: "Memory",
      sortKey: "MemorySummary",
      className: "drut-col-name-center",
    },
    {
      content: "Network",
      sortKey: "NetworkSummary",
      className: "drut-col-name-center",
    },
    {
      content: "Offload",
      sortKey: "OffloadSummary",
      className: "drut-col-name-center",
    },
    {
      content: "Machine",
      sortKey: "MachineName",
      className: "drut-col-name-center",
    },
    {
      className: "drut-table-btn",
      content: "",
      sortKey: "Action",
    },
  ];

  const onSearchValueChange = (e: any) => {
    setSearchText(e);
  };

  const fiterString = (e: any) => {
    const rsd: any = JSON.parse(JSON.stringify(nodeFullData));
    if (e === "") {
      setNodes(rsd);
    } else {
      const str: any = e.toUpperCase();
      const fn = rsd.filter((node: any) => {
        const ev: any = `${node.Name} ${node.MachineFqdn || ""}`.toUpperCase();
        return ev.includes(str);
      });
      setNodes(fn);
    }
  };

  const onRegisterNodeAction = (type: any) => {
    if (type === "CLOSE") {
      setIsRegister(false);
      setrData({
        rfu: "",
        protocol: "",
        user: "",
        pass: "",
        details: { name: "", mac: [], id: "" },
      });
    }
  };

  const registerNode = (node: any) => {
    setIsRegister(true);
    const details: any = {};
    details.id = node.Id;
    details.name = node.Name;
    details.mac = node.MACAddress || ["00:00:00:00:00:00"];

    if (fabrics && fabrics.length) {
      setrData({
        rfu: parseURL(fabrics[0].url),
        protocol: getProtocol(fabrics[0].url),
        user: fabrics[0].user,
        pass: fabrics[0].password,
        details,
      });
    }
  };

  const parseURL = (url: string) => {
    const ip = url.split("/")[2].split(":")[0];
    const port = url.split("/")[2].split(":")[1];
    return `${ip}:${port}`;
  };

  const getProtocol = (url: string) => {
    if (url.includes("https")) {
      return "https";
    }
    return "http";
  };

  useEffect(() => {
    setError("");
    getNodesData();

    getFabricsData();
    // Clearing timeout if pending on unmount
    return () => {
      // clearing settimeout
      console.log("clearing settimeout: Stop refreshing!!!");
      clearTimeout(setTimeOut);
      abortController.abort();
      abcDataPath.abort();
      abcFabric.abort();
      abcEvent.abort();
    };
  }, [page]);

  return (
    <Fragment key={`${Math.random()}`}>
      {error && error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          inline
          severity="negative"
        >
          {error}
        </Notification>
      )}

      {isRegister && (
        <Fragment key={`r_${Math.random()}`}>
          <h3>
            Registering Node: <b>{rData?.details?.name}</b>
          </h3>
          <RegisterMachineForm
            key={`RegisterMachine_${Math.random()}`}
            data={rData}
            onRegisterNodeAction={onRegisterNodeAction}
          />
        </Fragment>
      )}

      {!parms.id && (
        <div>
          <Row>
            <Col size={12}>
              {loading ? (
                <Spinner key={`nodeListSpinner_${Math.random()}`} />
              ) : (
                <Fragment key={`nl_${Math.random()}`}>
                  <Row className="u-nudge-down--small">
                    <Col size={12}>
                      <SearchBox
                        key={`searchbox_${Math.random()}`}
                        onChange={(e) => {
                          onSearchValueChange(e);
                          intervalRef.current = setTimeout(() => {
                            fiterString(e);
                          }, 30);
                        }}
                        placeholder="Search Nodes"
                        value={searchText}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <MainTable
                    key={`nodeListTable_${Math.random()}`}
                    className="p-table--network-node p-table-expanding--light"
                    defaultSort="Name"
                    defaultSortDirection="ascending"
                    headers={headers}
                    rows={generateRows(nodes)}
                    sortable
                    emptyStateMsg="No node created yet or Node data not available."
                  />
                </Fragment>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  );
};

export default NodeList;
