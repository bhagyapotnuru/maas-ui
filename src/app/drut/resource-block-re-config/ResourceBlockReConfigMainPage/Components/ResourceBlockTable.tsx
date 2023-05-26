import { useContext } from "react";

import { Card, Col, Row, Spinner } from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import MainTable from "@canonical/react-components/dist/components/MainTable";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../../base/constants";
import { IN_PROGRESS, INPROGRESS } from "../../Constants/re-config.constants";
import type { Count, Member } from "../../Models/ResourceBlock";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import { getResourceDeviceInfo } from "./ResourceDeviceInfoContext";

import { arrayObjectArray as getSwitchPortInfo } from "app/drut/parser";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   // borderBottom: 0,
  // },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLOURS.ACCORDIAN_BG_TRUE
      : COLOURS.ACCORDIAN_BG_FALSE,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiTypography-root": {
    fontWeight: "400",
    padding: 0,
    color: COLOURS.ACCORDIAN_TEXT,
    fontSize: 14,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
  "&.MuiAccordionSummary-root": {
    minHeight: "2rem",
    maxHeight: "2rem",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const ResourceBlockTable = ({
  resourceBlockMembers,
}: {
  resourceBlockMembers: Member[];
}): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);

  const headers = [
    {
      content: "Name",
      sortKey: "name",
      className: "drut-col-name",
    },
    {
      content: "Capacity",
      sortKey: "capacity",
      className: `${classes.capacity_col_align}`,
    },
    {
      content: "Description",
      sortKey: "description",
      width: 280,
    },
    {
      content: "Fully Qualified Node Name",
      sortKey: "fqnn",
    },
    {
      content: "Count",
      sortKey: "deviceCount",
      className: "drut-col-sn",
    },
  ];

  if (context.selectedResourceBlock?.name !== "All") {
    context.setExpandedResourceBlock(resourceBlockMembers[0]?.Id || "");
    context.setCurrentRBToAttachOrDetach(resourceBlockMembers[0]);
  }

  const getRow = (currentRB: Member) => {
    return {
      key: currentRB.Id,
      className:
        currentRB.Id === context.expandedResourceBlock
          ? "drut-table-selected-row"
          : "drut-table-un-selected-row",
      columns: [
        {
          key: "nodeName",
          className: `${classes.col_md} ${classes.rb_content_align_center}`,
          content: (
            <CustomizedTooltip title={currentRB.Name} placement="right">
              <Button
                variant="text"
                onClick={() => {
                  context.setCurrentRBToAttachOrDetach(
                    context.expandedResourceBlock === currentRB.Id
                      ? ({} as Member)
                      : currentRB
                  );
                  context.setExpandedResource("");
                  context.setExpandedResourceBlock(
                    context.expandedResourceBlock === currentRB.Id
                      ? ""
                      : currentRB.Id
                  );
                }}
              >
                {currentRB?.Name}
              </Button>
            </CustomizedTooltip>
          ),
        },
        {
          key: "capacity",
          className: `${classes.col_md} ${classes.rb_content_align}`,
          content: (
            <div>
              {!currentRB?.capacity || currentRB.capacity.length === 0 ? (
                <div>
                  <span>-</span>
                </div>
              ) : (
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
              )}
            </div>
          ),
        },
        {
          key: "description",
          className: `${classes.rb_content_align}`,
          content: (
            <div>
              {!currentRB?.info || currentRB.info.length === 0 ? (
                <div>
                  <span>-</span>
                </div>
              ) : (
                <div>
                  {(currentRB?.info || []).map((info: string) => (
                    <div>{info}</div>
                  ))}
                </div>
              )}
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
          content: (
            <>
              {Object.keys(currentRB.Count).reduce(
                (acc, key) => acc + currentRB.Count[key as keyof Count] || 0,
                0
              )}
            </>
          ),
        },
      ],
      expanded: currentRB.Id === context.expandedResourceBlock,
      expandedContent: (
        <Row>
          <Col size={12}>
            {
              <div className="element-container">
                <div>
                  <Card>
                    <div className={classes.resource_info}>
                      <div>
                        <div className={classes.device_info_header}>
                          <strong className="p-muted-heading">
                            Device Information
                          </strong>
                          <div>
                            {![IN_PROGRESS, INPROGRESS].includes(
                              (
                                currentRB.EndpointActionStatus || ""
                              ).toLowerCase()
                            ) ? (
                              <CustomizedTooltip
                                title={
                                  context.isAnyActionInProgress
                                    ? "Action can't be performed as one of the resource action is in progress"
                                    : ""
                                }
                              >
                                <div className={classes.primary_btn}>
                                  <Button
                                    disabled={
                                      context.isAnyActionInProgress ||
                                      context.isAttachDetachInProgress ||
                                      context.resourceBlocksResponse.Links.Members.some(
                                        (m) =>
                                          [IN_PROGRESS, INPROGRESS].includes(
                                            (
                                              m.EndpointActionStatus || ""
                                            ).toLowerCase()
                                          )
                                      )
                                    }
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      context.setShowFreePoolResourcePopUp(
                                        true
                                      );
                                      context.setAttachDetachError("");
                                    }}
                                  >
                                    Add Resource
                                  </Button>
                                </div>
                              </CustomizedTooltip>
                            ) : (
                              <Spinner text="Action In-Progress under this resource block..." />
                            )}
                          </div>
                        </div>
                        <hr />
                        {currentRB.ComputerSystems?.length ||
                        currentRB.Storage?.length ||
                        currentRB.NetworkInterfaces?.length ||
                        currentRB.Processors?.length ? (
                          <>
                            {getResourceDeviceInfo(
                              currentRB,
                              context.setResourceToDelete,
                              false,
                              context.isAnyActionInProgress
                            ).map((deviceInfo: Section, index: number) => {
                              return (
                                <StyledAccordion
                                  expanded={
                                    (deviceInfo.key?.toString() || "") +
                                      currentRB.Id +
                                      index ===
                                    context.expandedResource
                                  }
                                  onChange={(e) => {
                                    context.setExpandedResource(
                                      (deviceInfo.key?.toString() || "") +
                                        currentRB.Id +
                                        index ===
                                        context.expandedResource
                                        ? ""
                                        : (deviceInfo.key?.toString() || "") +
                                            currentRB.Id +
                                            index
                                    );
                                  }}
                                >
                                  <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography>
                                      <strong>{deviceInfo.title}</strong>
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {deviceInfo.content}
                                  </AccordionDetails>
                                </StyledAccordion>
                              );
                            })}
                          </>
                        ) : (
                          <p>Device data not available!</p>
                        )}
                      </div>
                      <div>
                        <div>
                          <strong className="p-muted-heading">
                            Fabric Information
                          </strong>
                        </div>
                        <hr />
                        {currentRB.FabricInfo.length ? (
                          <>
                            {getSwitchPortInfo(
                              currentRB.FabricInfo,
                              "Switch Port"
                            ).map((switchInfo: Section, index: number) => {
                              return (
                                <StyledAccordion
                                  expanded={
                                    (switchInfo.key?.toString() || "") +
                                      currentRB.Id +
                                      index ===
                                    context.expandedResource
                                  }
                                  onChange={(e) => {
                                    context.setExpandedResource(
                                      (switchInfo.key?.toString() || "") +
                                        currentRB.Id +
                                        index ===
                                        context.expandedResource
                                        ? ""
                                        : (switchInfo.key?.toString() || "") +
                                            currentRB.Id +
                                            index
                                    );
                                  }}
                                >
                                  <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography>
                                      <strong>{switchInfo.title}</strong>
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {switchInfo.content}
                                  </AccordionDetails>
                                </StyledAccordion>
                              );
                            })}
                          </>
                        ) : (
                          <p>Fabric data not available!</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }
          </Col>
        </Row>
      ),
    };
  };

  const getRowsToRender = (
    resourceBlockMembers: Member[] = []
  ): MainTableRow[] => {
    return resourceBlockMembers.map((currentRB: Member) => getRow(currentRB));
  };

  return (
    <>
      <MainTable
        expanding
        paginate={8}
        key="ResourceBlockTable"
        headers={headers}
        rows={getRowsToRender(resourceBlockMembers)}
        sortable
        className="drut-table-border"
        emptyStateMsg={"Data not available."}
      />
    </>
  );
};

export default ResourceBlockTable;
