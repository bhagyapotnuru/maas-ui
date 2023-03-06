import * as React from "react";
import { useEffect, useState } from "react";

import {
  Card,
  CheckboxInput,
  Col,
  MainTable,
  Notification,
  Row,
  Spinner,
  Tooltip,
  Accordion,
} from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useNavigate } from "react-router-dom-v5-compat";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import type {
  ComputerSystems,
  Description,
  Member,
  NetworkInterfaceSummary,
  Processors,
  RBTypeResp,
  ResourceBlock,
  StorageSummary,
} from "../Models/ResourceBlock";
import { CompositionState } from "../Models/ResourceBlock";
import type { ResourceBlockInfo } from "../Models/ResourceBlockInfo";
import classes from "../composedNode.module.scss";

import { fetchData, postData } from "app/drut/config";
import type {
  Rack,
  Zone,
} from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";
import { arrayObjectArray, genObjAccord } from "app/drut/parser";

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
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
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiTypography-root": {
    fontWeight: "400",
    padding: 0,
    color: "#707070",
    fontSize: 14,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const PageInformation = () => {
  return (
    <div className={classes.page_info_content}>
      <h4>Compose a System for your workload.</h4>
      <p>
        Our composition service lets you compose a computer system according to
        your need. To start with the composition process, you need a compute,
        please select a compute.
      </p>
    </div>
  );
};

const Step1Content = ({
  zones,
  selectedZone,
  setSelectedZone,
  enteredNodeName,
  setEnteredNodeName,
}: {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
}) => {
  return (
    <>
      <div className={classes.page_info}>
        <PageInformation />
        <div className={classes.page1_data}>
          <div className={classes.header_selections}>
            <div>
              <strong>
                Zone<span style={{ color: "red" }}>*</span> &#58;
              </strong>
            </div>
            <div>
              <ZoneSelect
                zones={zones}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
              />
            </div>
          </div>

          <div className={classes.header_selections}>
            <div>
              <strong>
                Node Name<span style={{ color: "red" }}>*</span> &#58;
              </strong>
            </div>
            <div>
              <NodeNameInputField
                enteredNodeName={enteredNodeName}
                setEnteredNodeName={setEnteredNodeName}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ResourceBlockTable = ({
  resourceBlocks = [],
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  setSelectedResourceBlocks,
  header,
  isMaxPortCountLimitReached,
}: {
  resourceBlocks: Member[];
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  header: string;
  isMaxPortCountLimitReached: boolean;
}) => {
  const [fullRBInfo, setFullRBInfo] = useState({} as ResourceBlockInfo);

  const [deviceInfo, setDeviceInfo] = useState([] as any);
  const [fabricInfo, setFabricInfo] = useState([] as any);
  const [fabricSwitchPortInfo, setFabricSwitchPortInfo] = useState([] as any);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFullRBInfo = async (rbId: string) => {
    try {
      setLoading(true);
      const promise: Response = await fetchData(`dfab/resourceblocks/${rbId}/`);
      if (promise.status === 200) {
        const response: ResourceBlockInfo = await promise.json();
        setFullRBInfo(response);
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Error fetching Data for Resource Block.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expandedResourceBlockRow.length > 0) {
      fetchFullRBInfo(expandedResourceBlockRow);
    }
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
                    if (e.target.checked && header === "Compute") {
                      resourceBlockMembers.forEach((m) => (m.checked = false));
                    }
                    currentRB.checked = e?.target?.checked;
                    setSelectedResourceBlocks((rbType: RBTypeResp) => {
                      rbType[header] = resourceBlockMembers.filter(
                        (rb: Member) => rb.checked
                      );
                      return { ...rbType };
                    });
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

const ResourceBlocksAccordion = ({
  resourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  header,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
}: {
  resourceBlocks: Member[];
  expandedResourceBlockRow: string;
  header: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
}) => {
  return (
    <StyledAccordion
      expanded={header === expandedResourceType}
      onChange={() =>
        setExpandedResourceType(header === expandedResourceType ? "" : header)
      }
    >
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Typography>
          <strong>
            {header} Block &nbsp; ({resourceBlocks.length})
          </strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ResourceBlockTable
          header={header}
          expandedResourceBlockRow={expandedResourceBlockRow}
          resourceBlocks={resourceBlocks}
          setExpandedResourceBlock={setExpandedResourceBlock}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={isMaxPortCountLimitReached}
        />
      </AccordionDetails>
    </StyledAccordion>
  );
};

const ResourceBlockPage = ({
  resourceBlocksByType,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  fetchingResourceBlocks,
}: {
  resourceBlocksByType: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
}) => {
  const keys = Object.keys(resourceBlocksByType);
  const isDataAvailable: boolean = keys.some(
    (key) => resourceBlocksByType[key]?.length > 0
  );
  return (
    <>
      {fetchingResourceBlocks ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={`Fetching Resource Blocks...`}
            key={`resource_blocks_spinner_${Math.random()}`}
          />
        </Notification>
      ) : isDataAvailable ? (
        keys.map((key: string) => {
          return (
            <ResourceBlocksAccordion
              header={key}
              expandedResourceBlockRow={expandedResourceBlockRow}
              resourceBlocks={resourceBlocksByType[key]}
              setExpandedResourceBlock={setExpandedResourceBlock}
              expandedResourceType={expandedResourceType}
              setExpandedResourceType={setExpandedResourceType}
              setSelectedResourceBlocks={setSelectedResourceBlocks}
              isMaxPortCountLimitReached={isMaxPortCountLimitReached}
            />
          );
        })
      ) : (
        <div className={classes.no_data}>Data Not Available</div>
      )}
    </>
  );
};

const IFICPool = ({
  computeResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  fetchingResourceBlocks,
}: {
  computeResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: Rack[];
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  fetchingResourceBlocks: boolean;
}) => {
  return (
    <div>
      <div className={classes.fic_block}>
        <span>
          <strong>IFIC Pool &#58;</strong>
        </span>
        <RackSelect
          racks={racks}
          selectedRack={selectedIFICRack}
          setSelectedRack={setSelectedIFICRack}
        />
      </div>
      {selectedIFICRack !== "" ? (
        <ResourceBlockPage
          expandedResourceBlockRow={expandedResourceBlockRow}
          resourceBlocksByType={computeResourceBlocks}
          setExpandedResourceBlock={setExpandedResourceBlock}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={false}
          fetchingResourceBlocks={fetchingResourceBlocks}
        />
      ) : (
        <div className={classes.no_data}>
          Please select Rack to fetch Resource Blocks
        </div>
      )}
    </div>
  );
};

const TFICPool = ({
  targetResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedTFICRack,
  setSelectedTFICRack,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  fetchingResourceBlocks,
}: {
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: Rack[];
  selectedTFICRack: string;
  setSelectedTFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
}) => {
  return (
    <div>
      <div className={classes.fic_block}>
        <span>
          <strong>TFIC Pool &#58;</strong>
        </span>
        <RackSelect
          racks={racks}
          selectedRack={selectedTFICRack}
          setSelectedRack={setSelectedTFICRack}
        />
      </div>
      {selectedTFICRack !== "" ? (
        <ResourceBlockPage
          expandedResourceBlockRow={expandedResourceBlockRow}
          resourceBlocksByType={targetResourceBlocks}
          setExpandedResourceBlock={setExpandedResourceBlock}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={isMaxPortCountLimitReached}
          fetchingResourceBlocks={fetchingResourceBlocks}
        />
      ) : (
        <div className={classes.no_data}>
          Please select Rack to fetch Resource Blocks
        </div>
      )}
    </div>
  );
};

const RackSelect = ({
  selectedRack,
  setSelectedRack,
  racks,
}: {
  selectedRack: string;
  setSelectedRack: (value: string) => void;
  racks: Rack[];
}) => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <Select
        placeholder="Select Rack"
        id="rack-select"
        label=""
        value={`${selectedRack}`}
        onChange={(e: SelectChangeEvent<string>) => {
          setSelectedRack(e.target.value);
        }}
        className={classes.select_value}
        variant="standard"
      >
        {racks.length === 0 ? (
          <MenuItem>
            <em>No Racks available</em>
          </MenuItem>
        ) : (
          [{ rack_id: 0, rack_name: "All", rack_fqgn: "All" }, ...racks].map(
            (rack: Rack) => (
              <MenuItem
                key={rack.rack_id}
                value={rack.rack_id}
                className={classes.header_selection_menu_item}
              >
                {rack.rack_name}
              </MenuItem>
            )
          )
        )}
      </Select>
    </FormControl>
  );
};

const StepperContent = ({
  stepIndex,
  zones,
  selectedZone,
  setSelectedZone,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  selectedTFICRack,
  setSelectedTFICRack,
  expandedResourceType,
  setExpandedResourceType,
  enteredNodeName,
  setEnteredNodeName,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  computeResourceBlocks,
  targetResourceBlocks,
  fetchingResourceBlocks,
}: {
  stepIndex: number;
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  computeResourceBlocks: RBTypeResp;
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: Rack[];
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  selectedTFICRack: string;
  setSelectedTFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
}) => {
  switch (stepIndex) {
    case 1:
      return (
        <Step1Content
          setSelectedZone={setSelectedZone}
          selectedZone={selectedZone}
          zones={zones}
          enteredNodeName={enteredNodeName}
          setEnteredNodeName={setEnteredNodeName}
        />
      );
    case 2:
      return (
        <IFICPool
          computeResourceBlocks={computeResourceBlocks}
          expandedResourceBlockRow={expandedResourceBlockRow}
          setExpandedResourceBlock={setExpandedResourceBlock}
          racks={racks}
          selectedIFICRack={selectedIFICRack}
          setSelectedIFICRack={setSelectedIFICRack}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          fetchingResourceBlocks={fetchingResourceBlocks}
        />
      );
    case 3:
      return (
        <TFICPool
          targetResourceBlocks={targetResourceBlocks}
          expandedResourceBlockRow={expandedResourceBlockRow}
          setExpandedResourceBlock={setExpandedResourceBlock}
          racks={racks}
          selectedTFICRack={selectedTFICRack}
          setSelectedTFICRack={setSelectedTFICRack}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={isMaxPortCountLimitReached}
          fetchingResourceBlocks={fetchingResourceBlocks}
        />
      );
    default:
      return <p>No Information</p>;
  }
};

const ZoneSelect = ({
  zones,
  selectedZone,
  setSelectedZone,
}: {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
}) => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <Select
        placeholder="Select Zone"
        id="zone-select"
        label=""
        value={`${selectedZone}`}
        onChange={(e: SelectChangeEvent<string>) => {
          setSelectedZone(e.target.value);
        }}
        className={classes.select_value}
        variant="standard"
      >
        {zones.length === 0 && (
          <MenuItem>
            <em>No Zones available</em>
          </MenuItem>
        )}
        {zones.map((zone: Zone) => (
          <MenuItem
            key={zone.zone_id}
            value={zone.zone_id}
            className={classes.header_selection_menu_item}
          >
            {zone.zone_fqgn}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const NodeNameInputField = ({
  enteredNodeName,
  setEnteredNodeName,
}: {
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
}) => {
  return (
    <TextField
      className={classes.input_field}
      required
      id="standard-required"
      label=""
      defaultValue=""
      placeholder="Node Name"
      variant="standard"
      value={enteredNodeName}
      onChange={(e) => {
        if (e.target.value.startsWith(" ")) {
          return;
        }
        setEnteredNodeName(e.target.value);
      }}
    />
  );
};

const ComposeNodeStepper = ({
  zones,
  selectedZone,
  setSelectedZone,
  computeResourceBlocks,
  targetResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  selectedTFICRack,
  setSelectedTFICRack,
  expandedResourceType,
  setExpandedResourceType,
  enteredNodeName,
  setEnteredNodeName,
  selectedResourceBlocks,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  setIsMaxPortCountLimitReached,
  selectedZoneName,
  setActiveStep,
  activeStep,
  fetchingResourceBlocks,
}: {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  computeResourceBlocks: RBTypeResp;
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: Rack[];
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  selectedTFICRack: string;
  setSelectedTFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
  selectedResourceBlocks: RBTypeResp;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  selectedZoneName: string;
  setActiveStep: (value: React.SetStateAction<number>) => void;
  activeStep: number;
  fetchingResourceBlocks: boolean;
}) => {
  const steps = [
    "Select Zone",
    "Select Compute Block",
    "Select Target Block(s)",
  ];

  const isStepOptional = (step: number) => step === 2;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextDisabled = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      return !selectedZone || !enteredNodeName;
    }
    if (stepIndex === 1) {
      const computeBlocks = selectedResourceBlocks["Compute"];
      return !computeBlocks || computeBlocks.length === 0;
    }
    return false;
  };

  const onCancelCompostion = () => {
    setActiveStep(0);
    setSelectedZone("");
    setSelectedIFICRack("");
    setSelectedTFICRack("");
    setExpandedResourceType("");
    setSelectedResourceBlocks({});
  };

  return (
    <div>
      {activeStep !== 0 && selectedIFICRack !== "" && (
        <div className={classes.node_details_box}>
          <ComposeNodeBlock
            enteredNodeName={enteredNodeName}
            selectedResourceBlocks={selectedResourceBlocks}
            setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
            selectedZone={selectedZoneName}
            onCancelCompostion={onCancelCompostion}
          />
        </div>
      )}
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          <div>
            <StepperContent
              stepIndex={activeStep + 1}
              zones={zones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              computeResourceBlocks={computeResourceBlocks}
              targetResourceBlocks={targetResourceBlocks}
              expandedResourceBlockRow={expandedResourceBlockRow}
              setExpandedResourceBlock={setExpandedResourceBlock}
              racks={racks}
              selectedIFICRack={selectedIFICRack}
              selectedTFICRack={selectedTFICRack}
              setSelectedIFICRack={setSelectedIFICRack}
              setSelectedTFICRack={setSelectedTFICRack}
              expandedResourceType={expandedResourceType}
              setExpandedResourceType={setExpandedResourceType}
              enteredNodeName={enteredNodeName}
              setEnteredNodeName={setEnteredNodeName}
              setSelectedResourceBlocks={setSelectedResourceBlocks}
              isMaxPortCountLimitReached={isMaxPortCountLimitReached}
              fetchingResourceBlocks={fetchingResourceBlocks}
            />
          </div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <div className={classes.text_button}>
              <Button
                variant="text"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </div>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep !== steps.length - 1 && (
              <div className={classes.contained_button}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isNextDisabled(activeStep)}
                >
                  Next
                </Button>
              </div>
            )}
          </Box>
        </React.Fragment>
      </Box>
    </div>
  );
};

const ComposeNodeBlock = ({
  enteredNodeName,
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  selectedZone,
  onCancelCompostion,
}: {
  enteredNodeName: string;
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  selectedZone: string;
  onCancelCompostion: () => void;
}) => {
  const [error, setError] = useState("");
  const [composing, setComposing] = useState(false);
  const navigate = useNavigate();
  const onClickCompose = async () => {
    try {
      setError("");
      setComposing(true);
      const resourceBlocks: string[] = Object.values(
        selectedResourceBlocks
      ).flatMap((members: Member[]) => members.flatMap((member) => member.Id));
      const payLoad: { Name: string; ResourceBlocks: string[] } = {
        Name: enteredNodeName,
        ResourceBlocks: resourceBlocks,
      };
      const promise = await postData("dfab/nodes/", payLoad);
      if (promise.status === 200) {
        navigate("/drut-cdi/nodes");
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Failed to Compose a Node.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setComposing(false);
    }
  };

  const targetRBs: string[] = Object.keys(selectedResourceBlocks).filter(
    (key: string) => key !== "Compute"
  );
  const isComputeBlockSelected: boolean =
    selectedResourceBlocks && selectedResourceBlocks["Compute"]?.length > 0;
  const selectedTargetRBsCount = targetRBs.reduce(
    (acc, val) => acc + selectedResourceBlocks[val].length,
    0
  );
  const totalIFICDownStreamPorts =
    selectedResourceBlocks["Compute"]?.[0]?.FabricInfo[0]?.DownstreamPorts || 0;
  setIsMaxPortCountLimitReached(
    selectedTargetRBsCount >= totalIFICDownStreamPorts
  );
  return (
    <>
      <div className={classes.node_details_content}>
        <div className={classes.node_details_header}>Node Details &#58;</div>
        <div className={classes.node_details_data}>
          <div>
            <span>
              <strong>Node Name &#58; &nbsp;</strong>
            </span>
            <span>{enteredNodeName}</span>
          </div>
          <div>
            <span>
              <strong>Selected Zone &#58; &nbsp;</strong>
            </span>
            <span>{selectedZone}</span>
          </div>
          <div>
            <span>
              <strong>Selected Compute Block &#58; &nbsp;</strong>
              {isComputeBlockSelected && (
                <span>
                  <strong>
                    {`[`}&nbsp;Total Ports &#58; &nbsp;{" "}
                    {totalIFICDownStreamPorts}
                    &#44; &nbsp; Available &#58; &nbsp;
                    {totalIFICDownStreamPorts - selectedTargetRBsCount}
                    &#44; &nbsp; Selected &#58; &nbsp;
                    {selectedTargetRBsCount} &nbsp;
                    {`]`}
                  </strong>
                </span>
              )}
              {isComputeBlockSelected ? (
                <div className={classes.node_details_resource_block}>
                  {selectedResourceBlocks["Compute"].map(
                    (computeBlock: Member) => {
                      return (
                        <div
                          className={
                            classes.node_details_resource_block_main_content
                          }
                        >
                          <div
                            className={
                              classes.node_details_resource_block_child_content
                            }
                          >
                            <div>
                              {computeBlock?.Manager?.ManagerNodeName || "-"}
                              &nbsp;
                              {"("}
                              {computeBlock?.Manager?.RackName || "-"}
                              {")"}&nbsp;&#x2010;&nbsp;{computeBlock.Name}
                              &#44;&nbsp;
                            </div>
                            <div>
                              <span>Device Count&#58;&nbsp;</span>
                              <span>{computeBlock.Count}&#44;&nbsp;</span>
                            </div>
                            <div>
                              <span>Status &#58; &nbsp;</span>
                              <span>
                                {computeBlock.Status.Health} &#10098;{" "}
                                {computeBlock.Status.State} &#10099;
                              </span>
                            </div>
                          </div>
                          <div>
                            {computeBlock.info.map((info: string) => (
                              <div>{info}</div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <span>No Compute Block Selected </span>
              )}
            </span>
          </div>
          <div>
            <span>
              <strong>Selected Target Block(s) &#58; &nbsp;</strong>
              {selectedTargetRBsCount > 0 ? (
                <div>
                  {targetRBs
                    .flatMap((key: string) => {
                      return (
                        <>
                          {selectedResourceBlocks[key]?.length > 0 && (
                            <div
                              className={classes.node_details_target_block_box}
                            >
                              <div>
                                <strong>{key}</strong>
                              </div>
                              <div
                                className={`${
                                  classes.node_details_target_block
                                } ${
                                  selectedResourceBlocks[key].length > 2
                                    ? classes.space_between
                                    : classes.start
                                }`}
                              >
                                {selectedResourceBlocks[key].map(
                                  (targetRb: Member) => (
                                    <div
                                      className={
                                        classes.node_details_target_block_content
                                      }
                                    >
                                      <div
                                        className={
                                          classes.node_details_target_block_details
                                        }
                                      >
                                        <div>
                                          {targetRb?.Manager?.ManagerNodeName ||
                                            "-"}
                                          &nbsp;
                                          {"("}
                                          {targetRb?.Manager?.RackName || "-"}
                                          {")"}&nbsp;&#x2010;&nbsp;
                                          {targetRb.Name}
                                          &#44;&nbsp;
                                        </div>
                                        <div
                                          className={classes.rb_device_details}
                                        >
                                          <div>
                                            <span>Device Count&#58;&nbsp;</span>
                                            <span>
                                              {targetRb.Count}&#44;&nbsp;
                                            </span>
                                          </div>
                                          <div>
                                            <span>Status&#58;&nbsp;</span>
                                            <span>
                                              {targetRb.Status.Health} &#10098;
                                              {targetRb.Status.State} &#10099;
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        {targetRb.info.map((info: string) => (
                                          <div>{info}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })
                    .reduce(
                      (acc: JSX.Element[], curr: JSX.Element) =>
                        acc.concat(curr),
                      []
                    )}
                </div>
              ) : (
                <span>No Target Resource Block(s) selected.</span>
              )}
            </span>
          </div>
        </div>
        <div className={`${classes.compose_button}`}>
          <div>
            {error && error.length > 0 && (
              <Notification
                style={{ margin: 0 }}
                key={`notification_${Math.random()}`}
                onDismiss={() => setError("")}
                inline
                severity="negative"
              >
                {error}
              </Notification>
            )}
          </div>
          <div className={classes.compose_node_button}>
            <div className={`${classes.text_button}`}>
              <Button
                variant="text"
                color="inherit"
                disabled={!isComputeBlockSelected || composing}
                sx={{ mr: 1 }}
                onClick={(e) => {
                  e.preventDefault();
                  onCancelCompostion();
                }}
              >
                Cancel
              </Button>
            </div>

            <div className={`${classes.contained_button}`}>
              <Button
                variant="contained"
                color="inherit"
                disabled={!isComputeBlockSelected || composing}
                sx={{ mr: 1 }}
                onClick={(e) => {
                  e.preventDefault();
                  onClickCompose();
                }}
              >
                {composing && (
                  <Spinner
                    color="white"
                    key={`managerListSpinner_${Math.random()}`}
                  />
                )}
                <span>
                  {composing ? `Composing Node...` : `Compose System`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ComposeNodeContent = (): JSX.Element => {
  const [zones, setZones] = useState([] as Zone[]);
  const [racks, setRacks] = useState([] as Rack[]);
  const [selectedZoneName, setSelectedZoneName] = useState("");

  const [selectedZone, setSelectedZone] = useState("");
  const [enteredNodeName, setEnteredNodeName] = useState("");
  const [selectedIFICRack, setSelectedIFICRack] = useState("");
  const [selectedTFICRack, setSelectedTFICRack] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingResourceBlocks, setFetchingResourceBlocks] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState("");

  const [expandedResourceBlockRow, setExpandedResourceBlock] = useState("");
  const [expandedResourceType, setExpandedResourceType] = useState("");

  const [computeResourceBlocks, setComputeResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [targetResourceBlocks, setTargetResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [selectedResourceBlocks, setSelectedResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [isMaxPortCountLimitReached, setIsMaxPortCountLimitReached] =
    useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const abortController = new AbortController();

  useEffect(() => {
    fetchZones();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof +selectedIFICRack === "number" && selectedZone) {
      fetchResourceBlocks("IFIC");
      return () => {
        abortController.abort();
      };
    } else return
  }, [selectedIFICRack]);

  useEffect(() => {
    if (typeof +selectedTFICRack === "number" && selectedZone) {
      fetchResourceBlocks("TFIC");
      return () => {
        abortController.abort();
      };
    } else return
  }, [selectedTFICRack]);

  useEffect(() => {
    if (selectedZone) {
      const zone: Zone | undefined = zones.find(
        (zone) => zone.zone_id === +selectedZone
      );
      setSelectedZoneName(zone?.zone_fqgn || "-");
      setRacks(zone?.racks || []);
      if (!!zone?.racks?.length) {
        setSelectedIFICRack("0");
        setSelectedTFICRack("0");
      } else {
        setSelectedIFICRack("");
        setSelectedTFICRack("");
      }
    }
  }, [selectedZone]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading...");
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response: Zone[] = await promise.json();
        const notDefaultZone = (zone: Zone) =>
          zone.zone_name.toLowerCase() !== "default_zone";
        setZones(response.filter(notDefaultZone));
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Error fetching Zones.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceBlocks = async (managerType: string) => {
    try {
      setFetchingResourceBlocks(true);
      const url = "dfab/resourceblocks/?";
      let params = {
        op: "get_new_schema",
        ZoneId: selectedZone,
        ManagerType: managerType,
      };
      if (activeStep === 1 && +selectedIFICRack !== 0) {
        params = { ...{ ...params, RackId: +selectedIFICRack } };
      } else if (activeStep === 2 && +selectedTFICRack !== 0) {
        params = { ...{ ...params, RackId: +selectedTFICRack } };
      }
      const queryParam: string = Object.keys(params)
        .map((key: string) => key + "=" + params[key as keyof typeof params])
        .join("&");
      const promise = await fetchData(
        url.concat(queryParam),
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response: ResourceBlock = await promise.json();
        if (managerType === "IFIC") {
          setComputeResourceBlocks(getRespByType(response.Links.Members));
          setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
            delete resourceBlocks["Compute"];
            return { ...resourceBlocks };
          });
        } else if (managerType === "TFIC") {
          setTargetResourceBlocks(getRespByType(response.Links.Members));
          setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
            Object.keys(resourceBlocks)
              .filter((key: string) => key !== "Compute")
              .forEach((key: string) => delete resourceBlocks[key]);
            return { ...resourceBlocks };
          });
        }
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Error fetching Resource Blocks.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setFetchingResourceBlocks(false);
    }
  };

  const getRBType = (resourceBlockType = "") => {
    switch (resourceBlockType) {
      case "Processor" || "Processors":
        return "Offload";
      case "ComputerSystem" || "ComputerSystems":
        return "DPU";
      default:
        return resourceBlockType;
    }
  };

  const getRespByType = (rbMembers: Member[]): RBTypeResp => {
    return prepCapacityAndDesp(rbMembers).reduce(
      (prev: RBTypeResp, curr: Member) => {
        const rbType: string = getRBType(curr.ResourceBlockType[0]);
        return {
          ...prev,
          [rbType]: [...(prev[rbType] || []), curr],
        };
      },
      {}
    );
  };

  const prepCapacityAndDesp = (rbMembers: Member[]) => {
    const isUnused = (v: Member) =>
      v.CompositionStatus.CompositionState === CompositionState.UNUSED;
    const unusedResourceBlocks: Member[] = rbMembers.filter(isUnused);
    unusedResourceBlocks.forEach((member: Member) => {
      member.capacity = [];
      member.info = [];
      member.Description.forEach((d: Description) => {
        member.info.push(
          `(${getRBType(d.ResourceBlockType).charAt(0).toUpperCase()})-[${
            d?.Manufacturer || "-"
          }] [${d?.Model || "-"}]`
        );
        if (member?.Summary?.Processors) {
          const o: Processors = member.Summary.Processors;
          member.capacity.push(`${o.Count} of ${o.TotalCores} CORE(O)`);
          member.capacity.push(`${o.MaxSpeedMHz}MHZ(O)`);
        }
        if (member?.Summary?.NetworkInterfaces) {
          const n: NetworkInterfaceSummary = member.Summary.NetworkInterfaces;
          member.capacity.push(`${n.MaxSpeedGbps}Mbps(N)`);
        }
        if (member?.Summary?.Storage) {
          const s: StorageSummary = member.Summary.Storage;
          member.capacity.push(`${s.CapacityGigaBytes}GB(S)`);
        }
        if (member?.Summary?.ComputerSystems) {
          const c: ComputerSystems = member.Summary.ComputerSystems;
          const key: string = member.ResourceBlockType.includes("Compute")
            ? "C"
            : "D";
          member.capacity.push(
            `${c.Processor.Count} of ${c.Processor.TotalCores}(${key})`
          );
          member.capacity.push(`${c.Memory.TotalSystemMemoryGiB}GB(M)`);
        }
      });
    });
    return unusedResourceBlocks;
  };

  return (
    <>
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
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={loadingMessage}
            key={`managerListSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <div>
          <ComposeNodeStepper
            zones={zones}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            racks={racks}
            selectedIFICRack={selectedIFICRack}
            selectedTFICRack={selectedTFICRack}
            setSelectedIFICRack={setSelectedIFICRack}
            setSelectedTFICRack={setSelectedTFICRack}
            computeResourceBlocks={computeResourceBlocks}
            targetResourceBlocks={targetResourceBlocks}
            expandedResourceBlockRow={expandedResourceBlockRow}
            setExpandedResourceBlock={setExpandedResourceBlock}
            expandedResourceType={expandedResourceType}
            setExpandedResourceType={setExpandedResourceType}
            enteredNodeName={enteredNodeName}
            setEnteredNodeName={setEnteredNodeName}
            selectedResourceBlocks={selectedResourceBlocks}
            setSelectedResourceBlocks={setSelectedResourceBlocks}
            isMaxPortCountLimitReached={isMaxPortCountLimitReached}
            setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
            selectedZoneName={selectedZoneName}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            fetchingResourceBlocks={fetchingResourceBlocks}
          />
        </div>
      )}
    </>
  );
};
export default ComposeNodeContent;
