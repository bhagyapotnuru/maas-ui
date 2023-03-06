import { useEffect, useState } from "react";

import {
  Col,
  Row,
  Link,
  Tooltip,
  MainTable,
  Spinner,
  Button,
  Modal,
} from "@canonical/react-components";
import { JSONTree } from "react-json-tree";
import { NavLink, useParams } from "react-router-dom";

import { fetchResources } from "../../../config";
import { resourceData, resourcesByType } from "../../../parser";
import ResourceDetails from "../ResourceDetail";

import ResourceFilterControls from "./../../../filter/ResourceFilterControls";

interface Props {
  onChangeContent: any;
  selected: any;
}

const ResourceList = ({ onChangeContent, selected }: Props): JSX.Element => {
  const [fullRSData, setFullRSData] = useState({});
  const [resources, setResources] = useState({});
  const [expandedRow, setExpandedRow] = useState(-1);
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({});
  const [selectedData, setSelectedData] = useState({ Name: "" });
  const [modalState, setModalState] = useState(false);
  const parms: any = useParams();
  const [closeAccordions, setCloseAccordions] = useState(false);

  function getResourceData(id: any = null) {
    // onChangeContent({}, false);
    setLoading(true);
    fetchResources(id ? id : null)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          if (!id) {
            const rs = resourceData(result);
            setFilter(JSON.parse(JSON.stringify(rs[0].filter)));
            if (rs[0].filter) {
              delete rs[0].filter;
            }
            setResources(rs[0]);
            setFullRSData(rs[0]);
            onChangeContent(rs[1], false);
          } else {
            onChangeContent({}, true);
            let resourceData: any = {};
            if (result !== undefined) {
              resourceData = result;
            }
            setResources(resourceData);
          }
          setLoading(false);
        },
        (error: any) => {
          console.log(error);
          setLoading(false);
        }
      );
  }

  const handleClick = (index: any): void => {
    setLinkData("Resource Info");
    setCloseAccordions(true);
    setCurrentRowIndex(expandedRow === index ? -1 : index);
  };

  useEffect(() => {
    if (closeAccordions) {
      // setExpandedRow(-1);
      setCloseAccordions(false);
    } else {
      setExpandedRow(currentRowIndex);
    }
  }, [closeAccordions, currentRowIndex]);

  const onclickTabEvent = (e: any) => {
    setLinkData(e);
  };

  const setLinkData = (currentTab: any) => {
    const tabType = ["Resource Info", "Fabric Info"];
    const linkData = [];
    tabType.forEach((element, index) => {
      linkData.push({
        key: "linkdata" + index + Math.random(),
        active: currentTab === element ? true : false,
        label: element,
        onClick: () => onclickTabEvent(element),
      });
    });
  };

  const resourceBIcon = (elm: any) => {
    let fnd: Array<any> = [];
    try {
      if (elm && elm.ResourceBlockType) {
        fnd = fnd.concat(
          elm.ResourceBlockType.map((rbt: any) => rbt.charAt(0))
        );
      }
    } catch (err) {
      console.log(err);
    }
    return fnd.join(", ");
  };

  const iconName = (elm: any) => {
    if (
      elm?.CompositionStatus?.CompositionState === "Composed" ||
      elm?.CompositionStatus?.Reserved
    ) {
      return elm?.Status?.Health === "OK" ? (
        <div className="drut-status drut-color-green"></div>
      ) : (
        <div className="drut-status drut-color-red"></div>
      );
    }
    return <div className="drut-status drut-color-default"></div>;
  };

  const renderRSTable = (resources: any) => {
    const res = resourcesByType(resources, selected);
    if (res && res.length) {
      return res.map((elm: any, index: any) => {
        return {
          key: `${elm.Id}_${index}`,
          className:
            index === expandedRow
              ? "drut-table-selected-row"
              : "drut-table-un-selected-row",
          columns: [
            {
              key: "Status",
              className: "drut-col-sn",
              content: iconName(elm),
            },
            {
              key: "nodeName",
              className: "drut-col-name",
              content: (
                <Tooltip
                  className="doughnut-chart__tooltip"
                  followMouse={true}
                  message={`${elm.Name} [Type: ${resourceBIcon(elm)}]`}
                  position="right"
                >
                  <span className="drut-elapsis-block-name">
                    <Link
                      key="nodeNameLink"
                      title={elm?.Name}
                      onClick={(e) => {
                        e.preventDefault();
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
              key: "NodeName",
              className: "drut-col-name",
              content: (
                <>
                  {elm?.NodeId ? (
                    <NavLink
                      key={elm?.NodeId}
                      title={elm?.NodeName}
                      to={`/drut-cdi/nodes/${elm?.NodeId}`}
                    >
                      {elm?.NodeName || elm?.NodeId}
                    </NavLink>
                  ) : (
                    "NA"
                  )}
                  {elm?.MachineId ? (
                    <>
                      {" ("}
                      <NavLink
                        key={elm?.MachineId}
                        title={elm?.MachineName}
                        to={`/machine/${elm?.MachineId}/summary`}
                      >
                        {elm?.MachineName || elm?.MachineId}
                      </NavLink>
                      {")"}
                    </>
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              key: "DeviceCount",
              className: "drut-col-sn",
              content: <>{elm?.DeviceCount}</>,
            },
          ],
          expanded: expandedRow === index,
          expandedContent: (
            <>
              {expandedRow === index && (
                <div
                  style={{
                    maxHeight: "100vh",
                    overflow: "hidden",
                    overflowY: "scroll",
                  }}
                >
                  <ResourceDetails
                    id={`resource-detail${index}`}
                    data={elm}
                    loading={loading}
                    close={closeAccordions}
                    isMachinesPage={true}
                  />
                  <Button
                    onClick={() => {
                      setExpandedRow(-1);
                    }}
                    style={{ margin: "0px 8px 0px 0px" }}
                  >
                    <i className="p-icon--close"></i> Close
                  </Button>
                  <Button
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(elm));
                      delete newData.filterKey;
                      delete newData.filter;
                      delete newData.af;
                      delete newData.Ability;
                      delete newData.RTypes;
                      setSelectedData(newData);
                      setModalState(!modalState);
                    }}
                    style={{ margin: "0px 8px 0px 0px" }}
                  >
                    <i className="p-icon--external-link"></i> JSON{" "}
                  </Button>
                  <NavLink
                    className="p-button--neutral"
                    style={{ margin: "0px 8px 0px 0px" }}
                    key={elm?.NodeId}
                    to={`/drut-cdi/resources/${elm?.Id}`}
                  >
                    Know more <i className="p-icon--external-link"></i>
                  </NavLink>
                </div>
              )}
            </>
          ),
          sortData: {
            Name: elm.Name,
            Ability: elm.Ability,
            Status: elm?.CompositionStatus?.CompositionState,
            Description: elm?.Description,
            NodeName: elm?.NodeName,
            DeviceCount: elm?.DeviceCount,
          },
        };
      });
    } else {
      return [];
    }
  };

  const headers = [
    {
      content: "Status",
      sortKey: "Status",
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
      content: "Node (Machine)",
      sortKey: "NodeName",
      className: "drut-col-name",
    },
    {
      content: "Count",
      sortKey: "DeviceCount",
      className: "drut-col-sn",
    },
  ];

  const onFilterChange = (data: any) => {
    const rsd: any = JSON.parse(JSON.stringify(fullRSData));
    if (data && data.length) {
      if (Array.isArray(data)) {
        rsd["Offload"] = rsd["Offload"].filter((d: any) =>
          d.af.some((ab: any) => data.includes(ab))
        );
        rsd["Storage"] = rsd["Storage"].filter((d: any) =>
          d.af.some((ab: any) => data.includes(ab))
        );
        rsd["Compute"] = rsd["Compute"].filter((d: any) =>
          d.af.some((ab: any) => data.includes(ab))
        );
        rsd["Network"] = rsd["Network"].filter((d: any) =>
          d.af.some((ab: any) => data.includes(ab))
        );
        rsd["DPU"] = rsd["DPU"].filter((d: any) =>
          d.af.some((ab: any) => data.includes(ab))
        );
        setResources(rsd);
      } else {
        try {
          data = data.toUpperCase();
          rsd["Offload"] = rsd["Offload"].filter((d: any) =>
            filterTextLogic(
              d.Description,
              `${d.Name} ${d.NodeName || ""}`,
              data
            )
          );
          rsd["Storage"] = rsd["Storage"].filter((d: any) =>
            filterTextLogic(
              d.Description,
              `${d.Name} ${d.NodeName || ""}`,
              data
            )
          );
          rsd["Compute"] = rsd["Compute"].filter((d: any) =>
            filterTextLogic(
              d.Description,
              `${d.Name} ${d.NodeName || ""}`,
              data
            )
          );
          rsd["Network"] = rsd["Network"].filter((d: any) =>
            filterTextLogic(
              d.Description,
              `${d.Name} ${d.NodeName || ""}`,
              data
            )
          );
          rsd["DPU"] = rsd["DPU"].filter((d: any) =>
            filterTextLogic(
              d.Description,
              `${d.Name} ${d.NodeName || ""}`,
              data
            )
          );

          setResources(rsd);
        } catch (err) {
          console.log(err);
          setResources(fullRSData);
        }
      }
    } else {
      setResources(fullRSData);
    }
  };

  const filterTextLogic = (desc: any, name: any, data: any) => {
    const str = `${desc.join("")} ${name}`.toUpperCase();
    return str.search(data) >= 0 ? true : false;
  };

  useEffect(() => {
    setResources({});
    if (parms.id === undefined) {
      getResourceData(null);
    } else {
      getResourceData(parms.id);
    }
  }, []);

  useEffect(() => {
    setExpandedRow(-1);
  }, [selected]);

  return (
    <>
      <Row>
        <Col size={12} className="fabric-sel-main-container">
          {loading ? (
            <Spinner key="nodeListSpinner" />
          ) : (
            <>
              {parms.id === undefined ? (
                <>
                  <ResourceFilterControls
                    items={filter}
                    onFilterChange={onFilterChange}
                  />
                  <hr />
                  <MainTable
                    key="resourceTableTable"
                    expanding
                    defaultSort="Name"
                    defaultSortDirection="ascending"
                    responsive={false}
                    headers={headers}
                    rows={renderRSTable(resources)}
                    sortable
                    emptyStateMsg="Resource data not available."
                  />
                </>
              ) : (
                <ResourceDetails
                  id="details"
                  data={resources}
                  loading={loading}
                  close={closeAccordions}
                  isMachinesPage={true}
                />
              )}
            </>
          )}
        </Col>
      </Row>
      <Modal
        open={modalState}
        style={{
          display: modalState ? "flex" : "none",
          padding: "2rem 4rem",
        }}
      >
        <div
          className=""
          style={{ minWidth: "500px" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <header className="p-modal__header">
            <h2 className="p-modal__title" id="modal-title">
              {selectedData?.Name || ""}
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
            <JSONTree
              key={"jsonModal"}
              data={selectedData}
              theme={{
                scheme: "monokai",
                author: "Indu",
                base00: "#000000",
              }}
              keyPath={[]}
              shouldExpandNode={() => true}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ResourceList;
