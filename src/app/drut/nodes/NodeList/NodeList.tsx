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
import { NavLink, useParams } from "react-router-dom";

import { nodeStatus, nStatus } from "../../nodeStatus";
import RegisterMachineForm from "../RegisterNode/RegisterNode";

import classess from "./NodeList.module.css";
import ResetForm from "./ResetForm";

import { fetchDashboardNodeData, deleteNodeById } from "app/drut/api";
import { getIconByStatus } from "app/drut/fabricManagement/FabricManagementContent/Managers/type";

type Props = {
  page: any;
  onNodeDetail: any;
  dataId: any;
  setOpenResetForm?: any;
  setSelectedNode?: any;
  openResetForm?: boolean;
  selectedNode?: any;
};

const NodeList = ({
  page,
  onNodeDetail,
  setOpenResetForm,
  setSelectedNode,
  openResetForm,
  selectedNode,
}: Props): JSX.Element => {
  // const dispatch = useDispatch();
  const abortController = new AbortController();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const [nodeFullData, setNodeFullData] = useState([]);
  const [nodes, setNodes] = useState([]);

  const parms: any = useParams();
  let setTimeOut: any;
  const [rData, setrData] = useState({
    details: { id: "", name: "", mac: [] },
  });

  const [loading, setLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const getNodesData = (fetch = false) => {
    setSearchText("");
    setLoading(!fetch);
    fetchDashboardNodeData(abortController.signal)
      .then((dt: any) => {
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
            onNodeDetail(null);
          }
        } else {
          setNodes([]);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        setError(error);
      });
  };

  const deleteNode = (node: any) => {
    setLoading(true);
    deleteNodeById(node.Id)
      .then(() => {
        getNodesData();
      })
      .catch((error: any) => {
        setLoading(false);
        setError(error);
      });
  };

  const resetNodeById = (node: any) => {
    setSelectedNode(node);
    setOpenResetForm(true);
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
                      className={getIconByStatus(
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
            {
              children: "Reset Node",
              "data-test": "register-node-link",
              onClick: () => resetNodeById(node),
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

    setrData({ details: details });
  };

  useEffect(() => {
    setError("");
    getNodesData();

    // Clearing timeout if pending on unmount
    return () => {
      clearTimeout(setTimeOut);
      abortController.abort();
    };
  }, [page]);

  const errorValue = error?.toString();

  return (
    <Fragment key={`${Math.random()}`}>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
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

      {openResetForm && (
        <ResetForm
          setOpenResetForm={setOpenResetForm}
          selectedNode={selectedNode}
          setError={setError}
        />
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
