import { useEffect, useState } from "react";

import {
  Accordion,
  Card,
  CheckboxInput,
  Col,
  MainTable,
  Notification,
  Row,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import Button from "@mui/material/Button";

import type { Member, RBTypeResp } from "../../Models/ResourceBlock";
import type { ResourceBlockInfo } from "../../Models/ResourceBlockInfo";
import classes from "../../composedNode.module.scss";

import { fetchResourceBlocksById } from "app/drut/api";
import { arrayObjectArray, genObjAccord } from "app/drut/parser";

const ResourceBlockTable = ({
  resourceBlocks = [],
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  setSelectedResourceBlocks,
  header,
  isMaxPortCountLimitReached,
  setTargetResourceBlocks,
}: {
  resourceBlocks: Member[];
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  header: string;
  isMaxPortCountLimitReached: boolean;
  setTargetResourceBlocks?: (value: RBTypeResp) => void;
}): JSX.Element => {
  const [fullRBInfo, setFullRBInfo] = useState({} as ResourceBlockInfo);

  const [deviceInfo, setDeviceInfo] = useState([] as any);
  const [fabricInfo, setFabricInfo] = useState([] as any);
  const [fabricSwitchPortInfo, setFabricSwitchPortInfo] = useState([] as any);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const abortController = new AbortController();

  const fetchFullRBInfo = async (rbId: string) => {
    try {
      setLoading(true);
      const response: ResourceBlockInfo = await fetchResourceBlocksById(
        rbId,
        abortController.signal
      );
      setFullRBInfo(response);
    } catch (e: any) {
      const defaultError = "Error fetching Data for Resource Block.";
      setError(e ? e : defaultError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expandedResourceBlockRow.length > 0) {
      fetchFullRBInfo(expandedResourceBlockRow);
    }
    return () => {
      abortController.abort();
    };
  }, [expandedResourceBlockRow]);

  useEffect(() => {
    setDeviceInfo(genObjAccord(fullRBInfo));
    setFabricInfo(arrayObjectArray(getFabricData(fullRBInfo), "FabricInfo"));
    setFabricSwitchPortInfo(
      arrayObjectArray(getFabricData(fullRBInfo), "Switch Port")
    );
  }, [fullRBInfo]);

  const getFabricData = (data: any) =>
    data.FabricInfo ? data.FabricInfo : { FabricInfo: null };

  const headers = [
    {
      content: "Status",
      sortKey: "checked",
      className: "drut-col-sn",
    },
    {
      content: "Name",
      sortKey: "name",
      className: "drut-col-name",
    },
    {
      content: "Capacity",
      sortKey: "capacity",
      className: "drut-col-name",
    },
    {
      content: "Description",
      sortKey: "description",
      width: 280,
    },
    {
      content: "Fully Qualified Group Name",
      sortKey: "fqgn",
    },
    {
      content: "Count",
      sortKey: "deviceCount",
      className: "drut-col-sn",
    },
  ];

  const getRowsToRender = (
    resourceBlockMembers: Member[] = [],
    expandedResourceBlockRow: string,
    setExpandedResourceBlock: (value: string) => void
  ): MainTableRow[] => {
    const errorValue = error?.toString();

    return resourceBlockMembers.map((currentRB: Member) => {
      return {
        key: currentRB.Id,
        className:
          currentRB.Id === expandedResourceBlockRow
            ? "drut-table-selected-row"
            : "drut-table-un-selected-row",
        columns: [
          {
            key: `checked_${currentRB.Id}_${Math.random()}`,
            className: `${classes.col_sn} ${classes.rb_content_align_center}`,
            content: (
              <Tooltip
                className="doughnut-chart__tooltip"
                followMouse={true}
                message={`${
                  !currentRB.checked && isMaxPortCountLimitReached
                    ? "No available free downstream ports to Attach."
                    : ""
                }`}
                position="right"
              >
                <CheckboxInput
                  label=""
                  id={currentRB.Id}
                  disabled={!currentRB.checked && isMaxPortCountLimitReached}
                  checked={currentRB.checked}
                  onChange={(e: any) => {
                    if (
                      e.target.checked &&
                      header.toLowerCase() === "compute"
                    ) {
                      resourceBlockMembers.forEach((m) => (m.checked = false));
                    }
                    currentRB.checked = e?.target?.checked;
                    if (
                      header.toLowerCase() === "compute" &&
                      setTargetResourceBlocks
                    ) {
                      setSelectedResourceBlocks({
                        Compute: resourceBlockMembers.filter(
                          (rb: Member) => rb.checked
                        ),
                      });
                      setTargetResourceBlocks({} as RBTypeResp);
                    } else {
                      setSelectedResourceBlocks((rbType: RBTypeResp) => {
                        rbType[header] = resourceBlockMembers.filter(
                          (rb: Member) => rb.checked
                        );
                        return { ...rbType };
                      });
                    }
                  }}
                />
              </Tooltip>
            ),
          },
          {
            key: "nodeName",
            className: `${classes.col_md} ${classes.rb_content_align_center}`,
            content: (
              <Tooltip
                className="doughnut-chart__tooltip"
                followMouse={true}
                message={`${currentRB.Name}`}
                position="right"
              >
                <Button
                  variant="text"
                  onClick={() => {
                    setExpandedResourceBlock(
                      expandedResourceBlockRow === currentRB.Id
                        ? ""
                        : currentRB.Id
                    );
                  }}
                >
                  {currentRB?.Name}
                </Button>
              </Tooltip>
            ),
          },
          {
            key: "capacity",
            className: `${classes.col_md} ${classes.rb_content_align_center}`,
            content: (
              <div>
                {(currentRB?.capacity || []).map(
                  (capacity: string, index: number) => (
                    <div>
                      {currentRB.capacity.length > 3 &&
                        currentRB.capacity.length / 2 === index && (
                          <div style={{ margin: "1rem 6px" }}></div>
                        )}
                      {capacity}
                    </div>
                  )
                )}
              </div>
            ),
          },
          {
            key: "description",
            className: `${classes.rb_content_align}`,
            content: (
              <div>
                {(currentRB?.info || []).map((info: string) => (
                  <div>{info}</div>
                ))}
              </div>
            ),
            width: 280,
            maxWidth: 280,
          },
          {
            key: "fqnn",
            className: `${classes.rb_content_align_left}`,
            content: <>{currentRB?.Manager?.Fqnn || "-"}</>,
          },
          {
            key: "count",
            className: `${classes.col_sn} ${classes.rb_content_align_center}`,
            content: <>{currentRB.Count}</>,
          },
        ],
        expanded: currentRB.Id === expandedResourceBlockRow,
        expandedContent: (
          <Row>
            {errorValue && !errorValue?.includes("AbortError") && (
              <Notification
                onDismiss={() => setError("")}
                inline
                severity="negative"
              >
                {errorValue}
              </Notification>
            )}
            {loading ? (
              <Notification
                key={`notification_${Math.random()}`}
                inline
                severity="information"
              >
                <Spinner
                  text={`Fetching Resource Block Information...`}
                  key={`managerListSpinner_${Math.random()}`}
                />
              </Notification>
            ) : (
              <Col size={12}>
                {
                  <div className="element-container">
                    <div>
                      <Card>
                        <strong className="p-muted-heading">
                          Device Information
                        </strong>
                        <hr />
                        {deviceInfo.length ? (
                          <Accordion className="" sections={deviceInfo} />
                        ) : (
                          <p>Device data not available.</p>
                        )}
                        <strong className="p-muted-heading">
                          Fabric Information
                        </strong>
                        <hr />
                        {fabricInfo.length ? (
                          <Accordion
                            className=""
                            sections={fabricSwitchPortInfo}
                          />
                        ) : (
                          <p>Fabric data not available!</p>
                        )}
                      </Card>
                    </div>
                  </div>
                }
              </Col>
            )}
          </Row>
        ),
      };
    });
  };

  return (
    <>
      <MainTable
        expanding
        paginate={8}
        key="computeTable"
        headers={headers}
        rows={getRowsToRender(
          resourceBlocks,
          expandedResourceBlockRow,
          setExpandedResourceBlock
        )}
        sortable
        className="drut-table-border"
        emptyStateMsg="Data not available."
      />
    </>
  );
};

export default ResourceBlockTable;
