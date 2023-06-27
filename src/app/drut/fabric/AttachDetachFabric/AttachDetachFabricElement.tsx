import { useState, useEffect } from "react";

import {
  Spinner,
  Card,
  Col,
  Row,
  MainTable,
  Link,
  Tooltip,
  Accordion,
  Notification,
  Button,
  Modal,
  Input,
} from "@canonical/react-components";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import { styled, ThemeProvider } from "@mui/material/styles";
import { JSONTree } from "react-json-tree";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";

import { fetchResourceBlocksByQuery } from "../../api";
import { jsonTheme } from "../../config";
import { nStatus, nodeStatus, blockStatus } from "../../nodeStatus";
import {
  genObjAccord,
  arrayObjectArray,
  resourceData,
  resourcesByType,
  // countDSPort,
} from "../../parser";
import ResourceDetails from "../../resources/View/ResourceDetail";
import { getTypeTitle } from "../../types";
import DataPathInfo from "../FabricDataPath/DataPathInfo";

// import type { RouteParams } from "app/base/types";
import classess from "./AttachDetachFabric.module.css";
import CustomizedContextualMenu from "./CustomizedContextualMenu";
import FqnnSelect from "./FqnnSelect";

import {
  fetchFabricsNodeData,
  fetchNodeDataPath,
  saveNodeComposition,
  updateNodeCacheById,
  saveNodeCompositionByQuery,
} from "app/drut/api";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import customDrutTheme from "app/utils/Themes/Themes";

interface Props {
  nodeId?: string;
  isMachinesPage: boolean;
  isRefreshInProgress?: boolean;
  isRefreshAction?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`node-details-tabpanel-${index}`}
      aria-labelledby={`node-details-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} className={classess.node_details_tab_panel}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `node-details-tab-${index}`,
    "aria-controls": `node-details-tabpanel-${index}`,
  };
};

const Tabs = styled(MuiTabs)(({ theme }) => ({
  "&.MuiTabs-root .MuiTabs-indicator": {
    backgroundColor: "currentcolor",
  },
  "&.MuiTabs-root .Mui-selected": {
    backgroundColor: "white",
  },
  "&.MuiTabs-root .MuiButtonBase-root": {
    textTransform: "capitalize",
  },
}));

const AttachDetachFabricElement = ({
  nodeId,
  isMachinesPage,
  isRefreshInProgress,
  isRefreshAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [node, setNode]: [any, any] = useState(null);

  const [modalState, setModalState] = useState(false);
  const [downPorts, setDownPorts]: [any, any] = useState({
    available: 0,
    used: 0,
  });
  const [inProgress, setInProgress]: [any, any] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(isRefreshInProgress);
  const [isDataPath, setIsDataPath]: [any, any] = useState(false);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  // const [hwUUID, setHwUUID]: [any, any] = useState(null);
  const [isComposed, setIsComposed]: [any, any] = useState(true);
  const [isCDIEnabled, setIsCDIEnabled]: [any, any] = useState(true);
  const [dataPath, setDataPath]: [any, any] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [current, setCurrent] = useState("");
  const [resources, setResources] = useState({} as any);
  const [individualResource, setIndividualResource] = useState({} as any);
  const [cRefresh, setCRefresh] = useState(false);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [rbID, setRbID] = useState("");
  const [composedNodeId, setComposedNodeId] = useState("");
  const [fqnn, setFqnn] = useState({
    uniqueFqnn: [{ label: "All", value: "All" }],
    selectedFqnn: "All",
  } as any);
  const { id } = useParams<any>();
  const machine: any = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const [checkedResourceBlocks, setCheckedResourceBlocks] = useState([] as any);

  useEffect(() => {
    if (!isRefreshAction) {
      loadMachine();
    }
    return () => {
      clearTimeout(setTimeOut);
    };
  }, [isRefreshAction]);

  useEffect(() => {
    if (cRefresh) {
      loadMachine();
    }
    return () => {
      clearTimeout(setTimeOut);
    };
  }, [cRefresh]);

  useEffect(() => {
    const computeBlockId = node?.ComputeBlocks[0]?.Id;
    if (computeBlockId && !machine?.dfab_computeblock_id) {
      getResourceData(true, computeBlockId);
    }
  }, [node?.ComputeBlocks[0]?.Id]);

  useEffect(() => {
    if (machine) {
      if (!isEmpty(machine?.dfab_computeblock_id)) {
        setRbID(machine.dfab_computeblock_id);
      }
      if (machine?.dfab_computeblock_id && machine?.dfab_node_id) {
        getResourceData(true, machine?.dfab_computeblock_id);
      }
      if (machine.dfab_cdi === false) {
        setIsCDIEnabled(false);
      }
      if (isEmpty(machine.dfab_node_id)) {
        setIsComposed(false);
      }
    }
  }, [machine]);

  let setTimeOut: any;
  const generateAtributes = (elmArr: any = [], data: any) => {
    if (!data) {
      return [];
    }
    if (data?.Summary && data?.Summary?.ComputerSystems !== undefined) {
      data.Summary = data.Summary.ComputerSystems;
    }
    // data.Summary.Status = data?.Status || "NA";
    data = data.Summary;
    const fnd: any = [];
    elmArr.forEach((key: string) => {
      const keyData = data && data[key] ? data[key] : null;
      if (data && keyData && Object.keys(keyData)) {
        fnd.push(
          <Col size={3}>
            <Card
              className="drut-node-machine-summary-card"
              style={{ marginBottom: "0px" }}
            >
              <div className="drut-node-info-box-1">
                <strong className="p-muted-heading">{key}</strong>
                <hr />
                {populateObjectData(keyData)}
              </div>
            </Card>
          </Col>
        );
      }
    });
    return fnd;
  };

  const populateObjectData = (data: any) => {
    const fnd: Array<any> = [];
    const sub: Array<any> = [];
    Object.keys(data).forEach((key) => {
      if (data[key] && typeof data[key] === "object") {
        sub.push(
          <JSONTree
            data={data[key]}
            theme={jsonTheme}
            keyPath={[key]}
            shouldExpandNode={() => false}
          />
        );
      } else {
        fnd.push(
          <p>
            <b>{key}</b>: {data[key]}
          </p>
        );
      }
    });
    return fnd.concat(sub);
  };

  const getResourceDetails = (id: any) => {
    if (id) {
      setLoading(true);
      fetchResourceBlocksByQuery(id ? `${id}/` : null)
        .then((result: any) => {
          // setResources(result);
          setIndividualResource(result);
          setLoading(false);
        })
        .catch((error: any) => {
          setError(error);
          setLoading(false);
        });
    }
  };

  const getResourceData = (
    shouldFetchFabricsNodeData = true,
    computeBlockId = null
  ) => {
    setLoading(true);
    fetchResourceBlocksByQuery(`?ComputeBlockId=${computeBlockId}`)
      .then((result: any) => {
        const rs = resourceData(result);
        if (shouldFetchFabricsNodeData) {
          if (machine && !isEmpty(machine.dfab_computeblock_id)) {
            setRbID(machine.dfab_computeblock_id);
          }
          if ((machine && !isEmpty(machine.dfab_node_id)) || nodeId) {
            setIsComposed(true);
          } else {
            setIsComposed(false);
          }

          if (machine && machine.dfab_cdi === false) {
            setIsCDIEnabled(false);
          }
        }
        setResources(rs[0]);
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        setError(error);
      });
  };

  const isEmpty = (str: any = "") => {
    return !str || str.length === 0;
  };

  const onClickResource = (event: any, resourceBlockId: any) => {
    if (
      loading ||
      (nodeStatus(node?.DataPathCreationOrderStatus).status &&
        loadingText.length > 0) ||
      inProgress
    ) {
      return;
    }
    event.preventDefault();
    getResourceDetails(resourceBlockId);
    setModalState(!modalState);
  };

  const onResourceBlockChecked = (checked: boolean, data: any) => {
    setCheckedResourceBlocks(checked ? [{ Id: data.Id }] : []);
  };

  const getResourceBlocks = (node: any, inProgress = false) => {
    if (node && node.ResourceBlocks && node.ResourceBlocks.length) {
      const computeBlockName = node?.ComputeBlocks[0]?.Name;
      const computeBlockId = node?.ComputeBlocks[0]?.Id;
      return node.ResourceBlocks.map((resourceBlock: any) => {
        return (
          <div
            style={{
              paddingBottom: "5px",
              backgroundColor: blockStatus(
                resourceBlock?.CompositionStatus?.CompositionState
              ).status
                ? "#c0ede0" //#8bb9ab"
                : "",
              display: "flow-root",
            }}
          >
            <div style={{ padding: "0px 6px" }}>
              <Row key="" className={classess["resource_block_row"]}>
                <Col size={1} className="u-align--right">
                  <div style={{ display: "grid" }}>
                    <Input
                      className="p-checkbox__input"
                      type="checkbox"
                      onChange={(e) =>
                        onResourceBlockChecked(e.target.checked, resourceBlock)
                      }
                      checked={checkedResourceBlocks.some(
                        (rb: { Id: string }) => rb.Id === resourceBlock.Id
                      )}
                      disabled={
                        loading ||
                        (nodeStatus(node?.DataPathCreationOrderStatus).status &&
                          loadingText.length > 0) ||
                        inProgress
                      }
                    ></Input>
                  </div>
                </Col>
                <Col size={8}>
                  <h4 style={{ marginTop: "10px" }}>
                    <NavLink
                      className={
                        loading || inProgress
                          ? classess.nav_link_disable
                          : classess.nav_link_enable
                      }
                      key={`${computeBlockId}_${resourceBlock?.Id}`}
                      style={{ fontSize: "initial" }}
                      to="#"
                      onClick={(e: any) => onClickResource(e, computeBlockId)}
                    >
                      {computeBlockName || "NA"} <b>(Compute)</b>
                    </NavLink>
                    <b style={{ fontSize: "large", fontWeight: "bold" }}>
                      {" > "}
                    </b>
                    <NavLink
                      className={
                        loading || inProgress
                          ? classess.nav_link_disable
                          : classess.nav_link_enable
                      }
                      key={resourceBlock?.Id}
                      style={{ fontSize: "initial" }}
                      to="#"
                      onClick={(e: any) =>
                        onClickResource(e, resourceBlock?.Id)
                      }
                    >
                      {resourceBlock?.Name}
                      <b>
                        (
                        {
                          getTypeTitle(resourceBlock?.ResourceBlockType[0])
                            .title
                        }
                        )
                      </b>
                    </NavLink>
                  </h4>
                </Col>
                <Col size={3} className="u-align--right">
                  {blockStatus(
                    resourceBlock?.CompositionStatus?.CompositionState
                  ).status && (
                    <Spinner
                      text={resourceBlock?.CompositionStatus?.CompositionState}
                    />
                  )}
                </Col>
              </Row>
              <div
                style={{ borderBottom: "1px solid #E2E2E2", padding: "2px" }}
              ></div>

              <div>
                <Row>
                  {generateAtributes(
                    [
                      "Storage",
                      "NetworkInterfaces",
                      "ComputerSystems",
                      "Processors",
                      "Processor",
                      "Memory",
                      "Status",
                    ],
                    resourceBlock
                  )}
                </Row>
              </div>
            </div>
          </div>
        );
      });
    } else if (!loading) {
      return (
        <aside className="p-accordion11">
          No resource blocks attached with this machine.
        </aside>
      );
    }
  };

  useEffect(() => {
    const res = resourcesByType(resources, current);
    const uniqueFqnn = [...new Set(res.map((val: any) => val.Manager.Fqnn))];
    const values = [
      { label: "All", value: "All" },
      ...uniqueFqnn.map((val: any) => ({
        label: val,
        value: val,
      })),
    ];
    setFqnn({ uniqueFqnn: values, selectedFqnn: "All" });
  }, [current]);

  const selectResourceBlocks = (type: any) => {
    setCurrent(type);
  };

  const attachSelectedResource = (elm: any) => {
    actionResourceBlock(elm, "A");
  };

  const actionResourceBlock = async (data?: any, action?: any) => {
    const nodeID: any = node.Id;
    try {
      let actionURL = "";
      let blockId = "";
      setLoading(true);
      let message = "";

      if (action === "D") {
        message = "Detaching resource block...";
        blockId = data.Id;
        actionURL = `${nodeID}/?op=remove_resource_block`;
      } else {
        message = "Attaching resource block...";
        blockId = data.Id;
        actionURL = `${nodeID}/?op=add_resource_block`;
      }
      setLoadingText(message);
      const fData = {
        ResourceBlock: blockId,
      };
      setCurrent("");
      setInProgress(true);
      await saveNodeCompositionByQuery(fData, actionURL);
      getFabricsNodeData(nodeID);
      setTimeout(() => {
        getResourceData(true, node?.ComputeBlocks[0]?.Id);
        setLoadingText("");
      }, 6000);
      setCheckedResourceBlocks([]);
    } catch (e: any) {
      setError(e);
      getFabricsNodeData(nodeID);
    } finally {
      setLoading(false);
    }
  };

  const getFabricsNodeData = (id: any, fetch = false) => {
    if (!id) {
      return;
    }
    setLoading(true);
    fetchFabricsNodeData(id)
      .then((result: any) => {
        if (result) {
          setNode({ ...result });
          if (result.ComputeBlocks && result.ComputeBlocks.length) {
            const totalCount = result.DownstreamPorts;
            /*result.ComputeBlocks.forEach((cm: any) => {
                totalCount = totalCount + countDSPort(cm);
              });*/
            const used =
              result.ResourceBlocks && result.ResourceBlocks.length
                ? result.ResourceBlocks.length
                : 0;
            setDownPorts({ available: totalCount - used, used });
          }
          const inProg = nStatus.includes(result.DataPathCreationOrderStatus);
          setInProgress(inProg);
          if (inProg) {
            setTimeOut = setTimeout(() => {
              clearTimeout(setTimeOut);
              getFabricsNodeData(id, true);
            }, 6000);
          }
        }
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        setError(error);
      });
  };

  const getNodeDataPath = async (id: any) => {
    try {
      setLoading(true);
      const dataPathResponse = await fetchNodeDataPath(id);
      setDataPath(dataPathResponse);
      setIsDataPath(!isDataPath);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // Resource selection

  const getFabricData = (data: any) => {
    if (data.FabricInfo) {
      return data.FabricInfo;
    }
    return { FabricInfo: null };
  };

  const handleClick = (index: any) => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
  };

  const loadNodeDataPath = () => {
    if ((machine && !isEmpty(machine.dfab_node_id)) || nodeId) {
      getNodeDataPath(nodeId || machine.dfab_node_id);
    }
  };

  const renderTabResources = () => {
    let res = resourcesByType(resources, current);
    res = res.filter((el: any) => {
      return (
        el.CompositionStatus.CompositionState === "Unused" &&
        (fqnn.selectedFqnn === "All"
          ? true
          : el.Manager.Fqnn === fqnn.selectedFqnn)
      );
    });
    let table = [];
    if (res && res.length) {
      table = res.map((elm: any, index: number) => {
        return {
          key: `${elm.Id}_${index}`,
          className:
            index === expandedRow
              ? "drut-table-selected-row"
              : "drut-table-un-selected-row",
          columns: [
            {
              key: `checked${elm.Id}`,
              className: "drut-col-name-center",
              content: (
                <>
                  <Button
                    className="compose-add-r-button p-button--positive has-icon"
                    onClick={() => attachSelectedResource(elm)}
                  >
                    Attach
                  </Button>
                </>
              ),
            },
            {
              key: `nodename_${elm.Name}_${index}`,
              className: "drut-col-name",
              content: (
                <Tooltip
                  className="doughnut-chart__tooltip"
                  followMouse={true}
                  message={`${elm.Name}`}
                  position="right"
                >
                  <span className="drut-elapsis-block-name">
                    <Link
                      key="nodeNameLink"
                      title={elm?.Name}
                      onClick={() => {
                        handleClick(index);
                      }}
                      color="default"
                    >
                      {`${elm?.Name}`}
                    </Link>
                  </span>
                </Tooltip>
              ),
            },
            {
              key: `Ability_${index}`,
              className: "drut-col-name",
              content: (
                <>
                  {elm?.Ability.map((elmDT: any) => {
                    return (
                      <>
                        {elmDT} <br />
                      </>
                    );
                  })}
                </>
              ),
            },
            {
              key: `Description_${index}`,
              content: (
                <>
                  {elm?.Description.map((elm: any) => {
                    return (
                      <>
                        {elm} <br />{" "}
                      </>
                    );
                  })}
                </>
              ),
            },
            {
              key: "FullyQualifiedGroupName",
              content: <>{elm?.Manager?.Fqnn || "-"}</>,
            },
            {
              key: `DeviceCount_${index}`,
              className: "drut-col-sn",
              content: <>{elm?.DeviceCount}</>,
            },
          ],
          expanded: expandedRow === index,
          expandedContent:
            expandedRow === index ? (
              <Row>
                <Col size={12}>
                  {
                    <div className="element-container">
                      <div>
                        <Card>
                          <strong className="p-muted-heading">
                            Device Information
                          </strong>
                          <hr />
                          {genObjAccord(elm).length ? (
                            <Accordion
                              className=""
                              sections={genObjAccord(elm)}
                            />
                          ) : (
                            <p>Device data not available.</p>
                          )}
                          <strong className="p-muted-heading">
                            Fabric Information
                          </strong>
                          <hr />
                          {arrayObjectArray(getFabricData(elm), "FabricInfo")
                            .length ? (
                            <Accordion
                              className=""
                              sections={arrayObjectArray(
                                getFabricData(elm),
                                "Switch Port"
                              )}
                            />
                          ) : (
                            <p>Fabric data not available!</p>
                          )}
                        </Card>
                      </div>
                    </div>
                  }
                </Col>
              </Row>
            ) : (
              ""
            ),
          sortData: {
            DeviceCount: elm?.DeviceCount,
            checked: elm?.checked,
            Ability: elm.Ability,
            Name: elm.Name,
            Description: elm?.Description,
          },
        };
      });
    }

    return (
      <Card>
        <strong className="p-muted-heading">
          Attach 1 of {res.length} {current} blocks
        </strong>
        <MainTable
          expanding
          paginate={8}
          key="computeTable"
          headers={selectionHeaders}
          rows={table}
          sortable
          className="drut-table-border"
          emptyStateMsg="Data not available."
        />

        <Button
          hasIcon
          className="drut-button"
          onClick={() => selectResourceBlocks("")}
        >
          <i className="p-icon--close"></i> <span>Close</span>
        </Button>
      </Card>
    );
  };

  const selectionHeaders = [
    {
      content: "",
      sortKey: "checked",
      className: "drut-col-name-center",
    },
    {
      content: "Name",
      sortKey: "Name",
      className: "drut-col-name",
    },
    {
      content: "Capacity",
      sortKey: "Ability",
      className: "drut-col-name",
    },
    {
      content: "Description",
      sortKey: "Description",
    },
    {
      content: "Fully Qualified Group Name",
      sortKey: "FullyQualifiedGroupName",
    },
    {
      content: "Count",
      sortKey: "DeviceCount",
      className: "drut-col-sn",
    },
  ];

  const forceRefresh = async (id: any = machine?.dfab_node_id) => {
    try {
      setIsRefreshing(true);
      await updateNodeCacheById(id);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const refresh = async () => {
    await forceRefresh();
    if (tabValue === 0) {
      loadMachine();
    } else if (tabValue === 1) {
      loadNodeDataPath();
    }
  };

  const loadMachine = (): any => {
    getFabricsNodeData(nodeId || machine.dfab_node_id);
  };

  const getCompositionTemplates = (
    isComposed: any,
    composedNodeId: any,
    nodeName: any
  ) => {
    if (
      !isComposed &&
      !composedNodeId &&
      !nodeName &&
      machine &&
      machine.dfab_cdi === true
    ) {
      return (
        <Notification inline>
          {loading ? (
            <Spinner text={"Composing machine as Drut CDI node."} />
          ) : (
            <>
              <Row>
                <Col size={12}>
                  <p style={{ width: "100%", maxWidth: "100%" }}>
                    This machine is not part of Drut CDI solution. If you want
                    to manage this machine with Drut CDI, please compose it by
                    clicking compose button.
                  </p>
                </Col>
              </Row>
              <Row hidden={composedNodeId?.length >= 1}>
                <Col size={12}>
                  <Button
                    className="p-button--default"
                    onClick={() => saveComposition()}
                  >
                    <span>Compose</span>
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Notification>
      );
    } else {
      return null;
    }
  };

  const saveComposition = () => {
    setLoading(true);
    const fnData = {
      Name: `drut-auto-node-${Math.floor(Date.now())}`,
      ResourceBlocks: [rbID],
    };

    saveNodeComposition(fnData)
      .then((dt: any) => {
        if (dt && dt.Id) {
          dispatch(machineActions.get(machine.system_id));
          setError(`Fetching data...`);
          setTimeout(() => {
            setError(``);
            setComposedNodeId(dt.Id);
            setLoading(false);
            setCRefresh(true);
          }, 2000);
        } else {
          setLoading(false);
          setError(`Id is not found in compose node response!`);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        setCRefresh(true);
        setError(error);
      });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      loadNodeDataPath();
    }
    setTabValue(newValue);
  };

  const isLoadingInProgress: boolean =
    loading || inProgress || isRefreshing || isRefreshInProgress;
  const errorValue = error?.toString();

  return (
    <>
      {isLoadingInProgress ||
      nodeStatus(node?.DataPathCreationOrderStatus).status ? (
        <Notification inline severity="information">
          <Spinner
            text={
              isRefreshing || isRefreshInProgress
                ? "Refreshing..."
                : loadingText ||
                  nodeStatus(node?.DataPathCreationOrderStatus).message
            }
          />
        </Notification>
      ) : (
        ""
      )}
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
        </Notification>
      )}
      {getCompositionTemplates(isComposed, composedNodeId, node?.Name)}
      {!isCDIEnabled ? (
        <Notification inline severity="information">
          This machine is not equipped to support dynamic hardware resource
          compose-ability.
        </Notification>
      ) : null}
      {node && node.Name && (
        <>
          <Row>
            <Col size={4}>
              <h4>
                <b>Node Name: </b>
                {node?.Name || "NA"}{" "}
                <span style={{ fontSize: ".8em" }}>
                  {` [Selected: ${downPorts.used}, Available :${
                    downPorts.available > 0 ? downPorts.available : "0"
                  }]`}
                </span>
              </h4>
            </Col>
            <Col size={5}>
              {current && (
                <FqnnSelect
                  selectedFqnn={fqnn.selectedFqnn}
                  setFqnn={setFqnn}
                  uniqueFqnn={fqnn.uniqueFqnn}
                />
              )}
            </Col>
            <Col size={3} className="u-align--right">
              {(nodeStatus(node?.DataPathCreationOrderStatus).status &&
                loadingText.length > 0) ||
              inProgress ? (
                ""
              ) : (
                <CustomizedContextualMenu
                  isMachinesPage={isMachinesPage}
                  isResourceBlocksTab={tabValue === 0}
                  onRefresh={refresh}
                  onDetach={() =>
                    actionResourceBlock(checkedResourceBlocks[0], "D")
                  }
                  onResourceBlockTypeSelection={(resourceBlockType: any) =>
                    selectResourceBlocks(resourceBlockType)
                  }
                  hasCheckedItems={
                    checkedResourceBlocks && checkedResourceBlocks.length > 0
                  }
                  hasDownStreamPorts={downPorts.available > 0}
                  hasResourceBlocks={node.ResourceBlocks?.length > 0}
                />
              )}
            </Col>
          </Row>

          <hr />
          {/* Attach Resource Block Resources */}
          {current.length ? renderTabResources() : ""}
          <>
            {isMachinesPage && (
              <ThemeProvider theme={customDrutTheme}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      display: "flex",
                    }}
                  >
                    <Tabs
                      sx={{ width: "100%" }}
                      value={tabValue}
                      onChange={handleChange}
                      aria-label="node detail tabs"
                      textColor="inherit"
                    >
                      <Tab label="Resource Blocks" {...a11yProps(0)} />
                      <Tab label="Data Path" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    {!isRefreshing && getResourceBlocks(node, inProgress)}
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    {(loading || isRefreshing) && (
                      <Notification inline severity="information">
                        <Spinner
                          text={isRefreshing ? "Refreshing..." : "Loading..."}
                        />
                      </Notification>
                    )}
                    {!loading && !isRefreshing && (
                      <DataPathInfo
                        data={dataPath}
                        isList={false}
                      ></DataPathInfo>
                    )}
                  </TabPanel>
                </Box>
              </ThemeProvider>
            )}
          </>
          {!isMachinesPage && getResourceBlocks(node, inProgress)}
        </>
      )}
      {/* Modal for the count details*/}
      <Modal
        id="resource-block-model"
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
              {"Resource Details"}
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
                <Col size={12}>
                  <ResourceDetails
                    id={
                      individualResource && individualResource.Id
                        ? individualResource.Id
                        : ""
                    }
                    data={individualResource}
                    loading={loading}
                    isMachinesPage={isMachinesPage}
                  />{" "}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttachDetachFabricElement;
