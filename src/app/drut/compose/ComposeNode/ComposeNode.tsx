import { useEffect, useState } from "react";

import {
  MainTable,
  Col,
  Row,
  Button,
  Input,
  Card,
  Spinner,
  Link,
  Tooltip,
  Notification,
  Accordion,
  CheckboxInput,
} from "@canonical/react-components";
import { createBrowserHistory } from "history";

import { fetchResources, postData } from "../../config";
import {
  // generateObjData,
  genObjAccord,
  arrayObjectArray,
  resourceData,
  resourcesByType,
  countDSPort,
} from "../../parser";
import { rsTypeUI } from "../../types";
// import { actions as resourceblockActions } from "app/store/resourceblock";
// import resourceblockSelectors from "app/store/resourceblock/selectors";
// import type { Resourceblock } from "app/store/resourceblock/types";
// import { ResourceblockMeta } from "app/store/resourceblock/types";
// import type { RootState } from "app/store/root/types";

const ComposeNode = (): JSX.Element => {
  const history = createBrowserHistory();
  const [loading, setLoading] = useState(false);
  const [aType, setAType] = useState("");
  const [countDSP, setCountDSP] = useState(0);
  const [countDSPSelected, setCountDSPSelected] = useState(0);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [resources, setResources] = useState(null);
  const [current, setCurrent] = useState("");
  const [isCompute, setIsCompute] = useState(false);

  const [expandedRow, setExpandedRow] = useState(-1);

  const [nodeName, setNodeName] = useState("");

  const handleNameChange = (e: any) => {
    setNodeName(e.target.value.trim());
  };

  const navigateRoute = (path: string) => {
    history.push(`${path}`);
  };
  // Resource block socket code
  // setSearchString("");
  /*
  const resourceblocks = useSelector((state: RootState) =>
    resourceblockSelectors.search(state, searchString)
  );
  const loadingr = useSelector(resourceblockSelectors.loading);
  const loadedr = useSelector(resourceblockSelectors.loaded);
  const savingr = useSelector(resourceblockSelectors.saving);
  const savedr = useSelector(resourceblockSelectors.saved);

  console.log("Resource Blocks", resourceblocks);
*/

  const handleClick = (index: number) => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
  };

  const getFabricData = (data: any) => {
    if (data.FabricInfo) {
      return data.FabricInfo;
    }
    return { FabricInfo: null };
  };

  const renderTabResources = () => {
    let res = resourcesByType(resources, current);
    res = res.filter((el: any) => {
      return !el.CompositionStatus.Reserved;
    });
    let table = [];
    if (res && res.length) {
      table = res.map((elm: any, index: any) => {
        return {
          key: elm.Id,
          className:
            index === expandedRow
              ? "drut-table-selected-row"
              : "drut-table-un-selected-row",
          columns: [
            {
              key: `checked${elm.Id}`,
              className: "drut-col-sn",
              content:
                current === "Compute" ? (
                  <>
                    <CheckboxInput
                      checked={elm.checked}
                      id={elm.Id}
                      label=""
                      name="csgroup"
                      onChange={(e) => onResourceSelection(e, elm, current)}
                    />
                  </>
                ) : (
                  <CheckboxInput
                    checked={elm.checked}
                    disabled={!elm.checked && countDSP - countDSPSelected <= 0}
                    id={elm.Id}
                    label=""
                    onChange={(e) => onResourceSelection(e, elm, current)}
                  />
                ),
            },
            {
              key: "nodeName",
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
                      color="default"
                      key="nodeNameLink"
                      onClick={() => {
                        handleClick(index);
                      }}
                      title={elm?.Name}
                    >
                      {`${elm?.Name}`}
                    </Link>
                  </span>
                </Tooltip>
              ),
            },
            {
              key: "Ability",
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
              key: "Description",
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
              key: "DeviceCount",
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
      <div style={{ padding: "0px 30px" }}>
        <MainTable
          className="drut-table-border"
          emptyStateMsg="Data not available."
          expanding
          headers={headers}
          key="computeTable"
          paginate={8}
          rows={table}
          sortable
        />

        <div>
          <Button
            className="compose-add-r-button has-icon"
            onClick={() => resetPanel()}
          >
            <i className="p-icon--plus"></i>
            <span>Finish Selection</span>
          </Button>
        </div>
      </div>
    );
  };

  const headers = [
    {
      content: "Status",
      sortKey: "checked",
      className: "drut-col-sn",
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

  const renderSelectedResources = (key: string) => {
    const selectedResource = [];
    const dt: any = resources && resources[key];
    if (dt && dt.length) {
      const selValue = dt.filter((data: any) => data.checked);
      if (selValue.length) {
        selValue.forEach((elm: any) => {
          selectedResource.push(
            <Col className="drut-composed-block-row" size={6}>
              <label>
                {elm.Name}, Device Count: {elm?.DeviceCount}, Status:{" "}
                {elm?.Status.Health} ({elm?.Status.State})
              </label>
              <hr />
              {printDescription(elm?.Description)}
            </Col>
          );
        });
      } else {
        selectedResource.push("");
      }
    } else {
      selectedResource.push("");
    }
    return <Row>{selectedResource}</Row>;
  };

  const printDescription = (description: any) => {
    return (
      <>
        {description.map((elm: any) => {
          return (
            <>
              <span className="drut-device-span">{elm}</span>
              <br />
            </>
          );
        })}
      </>
    );
  };

  const onResourceSelection = (e: any, data: any, current: any) => {
    e.preventDefault = true;
    if (current === "Compute") {
      if (countDSPSelected > 0) {
        clearSelection();
      }
      setCountDSP(countDSPort(data));
      setIsCompute(true);
    } else {
      data.checked
        ? setCountDSPSelected(countDSPSelected - 1)
        : setCountDSPSelected(countDSPSelected + 1);
    }
    const finalData = JSON.parse(JSON.stringify(resources));
    finalData[current] = [];
    const resourceData: any = resources && resources[current];
    resourceData.forEach((element: any) => {
      if (current === "Compute") {
        element.checked = false;
      }
      if (element.Id === data.Id) {
        element.checked = !element.checked;
      }
      finalData[current].push(element);
    });
    setResources(finalData);
  };

  const clearSelection = () => {
    setCountDSP(0);
    setCountDSPSelected(0);
    const finalData = JSON.parse(JSON.stringify(resources));
    rsTypeUI.forEach((ct: any) => {
      const resourceData: any = resources && resources[ct];
      resourceData.forEach((element: any) => {
        element.checked = false;
        finalData[ct].push(element);
      });
    });
    setResources(finalData);
  };

  const openSelectionPanel = (id: string) => {
    setCurrent(id);
  };

  const resetPanel = () => {
    setCurrent("");
  };

  function getResourceData() {
    setPageLoading(true);
    console.log("Calling in Composed Node.tsx ");
    fetchResources()
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          setPageLoading(false);
          const rs: any = resourceData(result);
          if (rs[0].filter) {
            delete rs[0].filter;
          }
          setResources(rs[0]);
        },
        (error: any) => {
          setPageLoading(false);
          console.log(error);
        }
      );
  }

  const clearPageData = () => {
    setIsCompute(false);
    setResources(null);
    setCurrent("");
    setNodeName("");
  };

  const composeAgain = () => {
    setAType("");
    setError("");
  };

  const validation = () => {
    const re = /^[a-zA-Z0-9-]+$/;
    if (!nodeName.match(re) || nodeName.length >= 255 || nodeName.length <= 0) {
      setError(
        `Error: Node name can be only alphanumeric, - and length can not be more than 255 char. `
      );
      return false;
    }
    return true;
  };

  const saveComposition = (type: any) => {
    setLoading(true);
    setAType(type);

    if (type === "C") {
      clearPageData();
      clearSelection();
    } else {
      if (!validation()) {
        setLoading(false);
        return;
      }
      const selBlocks: Array<any> = [];
      const dt: any = resources;
      Object.keys(dt).forEach((blKey: any) => {
        const selValue = dt[blKey].filter((data: any) => data.checked);
        if (selValue && selValue.length) {
          selValue.forEach((elm: any) => {
            selBlocks.push(elm.Id);
            if (elm && elm.ID) {
              selBlocks.push(elm.Id);
            }
          });
        }
      });

      const fnData = {
        Name: nodeName,
        ResourceBlocks: selBlocks,
      };
      postData("dfab/nodes/", fnData)
        .then((response: any) => {
          if (response.status === 200) {
            return response.json();
          } else {
            response.text().then((text: any) => {
              setError(`Error: ${text}`);
            });
            throw response.text;
          }
        })
        .then(
          () => {
            setLoading(false);
            if (type === "SN") {
              setAType("");
              setTimeout(() => {
                clearPageData();
                getResourceData();
              }, 1000);
            } else {
              navigateRoute("nodes");
            }
          },
          (error: any) => {
            setLoading(false);
            console.log(error);
          }
        )
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  const createBlock = (current: string, blocks = rsTypeUI) => {
    const ui: Array<any> = [];
    blocks.forEach((key: any) => {
      ui.push(
        <Col size={12}>
          <div className={"drut-compose-lable"}>
            {key === current ? (
              <Link
                className=""
                onClick={() => resetPanel()}
                style={{} /*{ float: "right" }*/}
              >
                <i className="p-icon--minus"></i>
                &nbsp;
                <strong className="p-muted-heading">{key} Block</strong>
                {key === "Compute" ? (
                  <strong className="p-muted-heading">
                    &nbsp;&nbsp;[Selected: {countDSPSelected}, Available:{" "}
                    {countDSP - countDSPSelected}]
                  </strong>
                ) : (
                  ""
                )}
              </Link>
            ) : (
              <Link
                className=""
                onClick={() => openSelectionPanel(key)}
                style={{} /*{ float: "right" }*/}
              >
                <i className="p-icon--plus"></i>
                &nbsp;
                <strong className="p-muted-heading">{key} Block</strong>
                {key === "Compute" ? (
                  <strong className="p-muted-heading">
                    &nbsp;&nbsp;[Selected: {countDSPSelected}, Available:{" "}
                    {countDSP - countDSPSelected}]
                  </strong>
                ) : (
                  ""
                )}
              </Link>
            )}
          </div>
          {/* hidden={current !== ""} style={{ padding: "0px 10px" }} */}
          <div>{renderSelectedResources(key)}</div>
          <div hidden={current !== key}>{renderTabResources()}</div>
        </Col>
      );
    });
    return ui;
  };

  useEffect(() => {
    getResourceData();
  }, []);

  return (
    <>
      <div
        className="l-application container-resource-compose"
        role="presentation"
      >
        <main className="l-main">
          <div>
            {pageLoading ? <Spinner key="nodeListSpinner" /> : ""}
            {!isCompute && current === "" ? (
              <Row>
                <Col size={12}>
                  <h4>Composed a System for your workload.</h4>
                  <p>
                    Our composition service lets you compose a computer system
                    according to your need. To start with the composition
                    process, you need a compute, please select a compute.
                  </p>
                  <p>
                    <Button
                      className="compose-add-r-button has-icon"
                      onClick={() => openSelectionPanel("Compute")}
                    >
                      <i className="p-icon--plus"></i>
                      <span>Select Compute Block</span>
                    </Button>
                  </p>
                </Col>
              </Row>
            ) : (
              <Row>{createBlock(current)}</Row>
            )}
          </div>
          {isCompute && current === "" ? (
            <div>
              <hr />
              <Card>
                <strong className="p-muted-heading">Composition Details</strong>
                <hr />
                <Row>
                  {aType === "" ? (
                    <>
                      <Col size={6}>
                        <Input
                          id="c_name"
                          label="Name"
                          onChange={(e) => handleNameChange(e)}
                          type="text"
                          value={nodeName}
                        />
                      </Col>
                      <Col size={12}>
                        <Button
                          className="p-button--default"
                          onClick={() => saveComposition("C")}
                        >
                          <span>Cancel</span>
                        </Button>
                        {/*
                        <Button
                          className="p-button--positive"
                          onClick={() => saveComposition("SN")}
                          disabled={!isCompute || !nodeName.length}
                        >
                          {loading ? (
                            <Spinner key="nodeListSpinner" />
                          ) : (
                            "Compose and Another"
                          )}
                        </Button>
                        */}
                        <Button
                          className="p-button--positive"
                          disabled={!isCompute || !nodeName.length}
                          onClick={() => saveComposition("S")}
                        >
                          Compose Systems
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <Col size={12}>
                      {loading ? (
                        <Spinner text="Composing a Node..." />
                      ) : (
                        <>
                          <Notification inline severity="negative">
                            {error}
                          </Notification>
                          <div>
                            <Button className="" onClick={() => composeAgain()}>
                              Verify and Compose Again
                            </Button>
                          </div>
                        </>
                      )}
                    </Col>
                  )}
                </Row>
              </Card>
            </div>
          ) : (
            ""
          )}
        </main>
      </div>
    </>
  );
};

ComposeNode.protoTypes = {};

export default ComposeNode;
