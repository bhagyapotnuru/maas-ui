import { Row, Spinner } from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { INPROGRESS, IN_PROGRESS } from "../../Constants/re-config.constants";
import type {
  ComputerSystem,
  ConnectedEntity,
  Endpoint,
  EndpointStatus,
  Member,
  NetworkInterface,
  Processor,
  StorageElement,
} from "../../Models/ResourceBlock";
import type { ResourceTypes } from "../../Models/ResourceTypes";
import classes from "../../resource-block-re-config.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const resourceTypes: string[] = [
  "Processors",
  "Storage",
  "ComputerSystems",
  "NetworkInterfaces",
];

export const getResourceDeviceInfo = (
  resourceBlockMember: Member,
  setResourceToAttachDetach: (value: Endpoint) => void,
  isAttachOperation: boolean,
  isActionInProgress: boolean,
  resourceToAttach: Endpoint = {} as Endpoint,
  setCurrentFreePoolBlock?: (freePoolBlock: Member) => void,
  addingToResource: Member | undefined = undefined,
  showActions = true,
  keys: Array<string> = resourceTypes
): Section[] => {
  const sections: Section[] = [];
  try {
    keys.forEach((key: string) => {
      const resources:
        | Processor[]
        | ComputerSystem[]
        | StorageElement[]
        | NetworkInterface[]
        | any
        | null
        | undefined =
        resourceBlockMember && resourceBlockMember[key as keyof ResourceTypes]
          ? resourceBlockMember[key as keyof ResourceTypes]
          : null;
      if (resources && resources.length) {
        if (["Processors", "ComputerSystems"].includes(key)) {
          const computeGpuTable: JSX.Element = getComputeGpuTable(
            resources,
            setResourceToAttachDetach,
            isAttachOperation,
            isActionInProgress,
            resourceToAttach,
            resourceBlockMember,
            addingToResource,
            showActions,
            setCurrentFreePoolBlock
          );
          if (computeGpuTable) {
            sections.push({
              title: `${key} (count: ${resources?.length || 0})`,
              key: `${key}_${resourceBlockMember.Id}`,
              content: <Row>{computeGpuTable}</Row>,
            });
          }
        } else if (["NetworkInterfaces", "Storage"].includes(key)) {
          const networkStorageTable = getNetworkStorageTable(
            prepareNetworkStorageData(resources),
            setResourceToAttachDetach,
            isAttachOperation,
            isActionInProgress,
            resourceToAttach,
            resourceBlockMember,
            addingToResource,
            showActions,
            setCurrentFreePoolBlock
          );
          if (networkStorageTable) {
            sections.push({
              title: `${key} (count: ${resources?.length || 0})`,
              key: `${key}_${resourceBlockMember.Id}`,
              content: <Row>{networkStorageTable}</Row>,
            });
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  return sections;
};

const getComputeGpuTable = (
  data: Processor[] | ComputerSystem[],
  setResourceToAttachDetach: (value: Endpoint) => void,
  isAttachOperation: boolean,
  isActionInProgress: boolean,
  resourceToAttach: Endpoint,
  resourceBlockMember: Member,
  addingToResource: Member | undefined,
  showActions: boolean,
  setCurrentFreePoolBlock?: (freePoolBlock: Member) => void
) => (
  <div className={classes.device_info_table}>
    {computeGpuTable(
      data,
      [
        { key: "Name" },
        { key: "Endpoint" },
        { key: "Manufacturer" },
        { key: "Model" },
        { key: "Health" },
        { key: "State" },
        { key: "Action" },
      ],
      setResourceToAttachDetach,
      isAttachOperation,
      isActionInProgress,
      resourceToAttach,
      resourceBlockMember,
      addingToResource,
      showActions,
      setCurrentFreePoolBlock
    )}
  </div>
);

const computeGpuTable = (
  data: Processor[] | ComputerSystem[],
  headers: { key: string }[],
  setResourceToAttachDetach: (value: Endpoint) => void,
  isAttachOperation: boolean,
  isActionInProgress: boolean,
  resourceToAttach: Endpoint,
  resourceBlockMember: Member,
  addingToResource: Member | undefined,
  showActions: boolean,
  setCurrentFreePoolBlock?: (freePoolBlock: Member) => void
) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 0, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "50vh" }} component={Paper}>
          <Table stickyHeader sx={{ mb: 0 }}>
            <TableHead>
              <TableRow>
                {(showActions
                  ? headers
                  : [
                      ...headers.filter((header) => header.key !== "Action"),
                      { key: "Status" },
                    ]
                ).map((header: { key: string }) => (
                  <TableCell align="left">{header.key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: Processor | ComputerSystem) => (
                <TableRow
                  key={row.Name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" valign="middle">
                    {row.Name || "-"}
                  </TableCell>
                  <TableCell align="left" valign="middle">
                    {`${row?.Endpoint.Name || "-"}`}
                  </TableCell>
                  <TableCell align="left" valign="middle">
                    {row.Manufacturer}
                  </TableCell>
                  <TableCell align="left" valign="middle">
                    {row.Model}
                  </TableCell>
                  <TableCell align="left" valign="middle">
                    {row.Status.Health}
                  </TableCell>
                  <TableCell align="left" valign="middle">
                    {row.Status.State}
                  </TableCell>
                  {
                    <TableCell align="left" valign="middle">
                      {isAttachOperation ? (
                        <div className={classes.contained_btn}>
                          {(isActionInProgress &&
                            resourceToAttach &&
                            resourceToAttach.Id === row.Endpoint.Id) ||
                          [IN_PROGRESS, INPROGRESS].includes(
                            (
                              row.Endpoint?.RecentActionStatus || ""
                            ).toLowerCase()
                          ) ? (
                            <span>
                              <Spinner
                                text={
                                  [IN_PROGRESS, INPROGRESS].includes(
                                    (
                                      row.Endpoint?.RecentActionStatus || ""
                                    ).toLowerCase()
                                  )
                                    ? `${
                                        showActions
                                          ? "In Progress..."
                                          : `Adding to ${
                                              addingToResource?.Name || ""
                                            }...`
                                      }`
                                    : "Adding Resource..."
                                }
                                key={`device_info_${Math.random()}`}
                              />
                            </span>
                          ) : (
                            <div>
                              {showActions ? (
                                <CustomizedTooltip
                                  title={
                                    isActionInProgress
                                      ? "Action can't be performed as one of the resource action is in progress"
                                      : ""
                                  }
                                >
                                  <div>
                                    <Button
                                      disabled={isActionInProgress}
                                      variant="contained"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setResourceToAttachDetach(row.Endpoint);
                                        if (setCurrentFreePoolBlock) {
                                          setCurrentFreePoolBlock(
                                            resourceBlockMember
                                          );
                                        }
                                      }}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </CustomizedTooltip>
                              ) : (
                                <span>Available</span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {[IN_PROGRESS, INPROGRESS].includes(
                            (
                              row.Endpoint?.RecentActionStatus || ""
                            ).toLowerCase()
                          ) ? (
                            <span>
                              <Spinner
                                text={"In Progress..."}
                                key={`device_info_${Math.random()}`}
                              />
                            </span>
                          ) : (
                            <CustomizedTooltip
                              placement="left"
                              title={
                                isActionInProgress
                                  ? "Action can't be performed as one of the resource action is in progress"
                                  : ""
                              }
                            >
                              <span>
                                <IconButton
                                  disabled={isActionInProgress}
                                  sx={{ p: 0 }}
                                  aria-label="delete"
                                  color="error"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setResourceToAttachDetach(row.Endpoint);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </CustomizedTooltip>
                          )}
                        </div>
                      )}
                    </TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

const networkStorageTable = (
  data: {
    Id: string;
    Name: string;
    Status: EndpointStatus;
    EndpointPortValue: string;
    Endpoint: Endpoint;
    PCI: string[];
  }[],
  headers: { key: string }[],
  setResourceToAttachDetach: (value: Endpoint) => void,
  isAttachOperation: boolean,
  isActionInProgress: boolean,
  resourceToAttach: Endpoint,
  resourceBlockMember: Member,
  addingToResource: Member | undefined,
  showActions: boolean,
  setCurrentFreePoolBlock?: (freePoolBlock: Member) => void
) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 0, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "50vh" }} component={Paper}>
          <Table stickyHeader sx={{ mb: 0 }}>
            <TableHead>
              <TableRow>
                {(showActions
                  ? headers
                  : [
                      ...headers.filter((header) => header.key !== "Action"),
                      { key: "Status" },
                    ]
                ).map((header: { key: string }) => (
                  <>
                    {header.key === "PCI" ? (
                      <TableCell sx={{ minWidth: 300, maxWidth: 300 }}>
                        Class / Device / Vendor Id
                      </TableCell>
                    ) : (
                      <TableCell align="left">{header.key}</TableCell>
                    )}
                  </>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(
                (row: {
                  Id: string;
                  Name: string;
                  Status: EndpointStatus;
                  EndpointPortValue: string;
                  Endpoint: Endpoint;
                  PCI: string[];
                }) => (
                  <TableRow
                    key={row.Id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" valign="middle">
                      {row.Name}
                    </TableCell>
                    <TableCell align="left" valign="middle">
                      {row.EndpointPortValue}
                    </TableCell>
                    <TableCell
                      align="left"
                      valign="middle"
                      sx={{ minWidth: 300, maxWidth: 300 }}
                    >
                      {row.PCI.join(", ")}
                    </TableCell>
                    <TableCell align="left" valign="middle">
                      {row.Status.State}
                    </TableCell>
                    <TableCell align="left" valign="middle">
                      {row.Status.Health}
                    </TableCell>
                    {
                      <TableCell align="left" valign="middle">
                        {isAttachOperation ? (
                          <div className={classes.contained_btn}>
                            {(isActionInProgress &&
                              resourceToAttach &&
                              resourceToAttach.Id === row.Endpoint.Id) ||
                            [IN_PROGRESS, INPROGRESS].includes(
                              (
                                row.Endpoint?.RecentActionStatus || ""
                              ).toLowerCase()
                            ) ? (
                              <span>
                                <Spinner
                                  text={
                                    [IN_PROGRESS, INPROGRESS].includes(
                                      (
                                        row.Endpoint?.RecentActionStatus || ""
                                      ).toLowerCase()
                                    )
                                      ? `${
                                          showActions
                                            ? "In Progress..."
                                            : `Adding to ${
                                                addingToResource?.Name || ""
                                              }...`
                                        }`
                                      : `Adding Resource...`
                                  }
                                  key={`device_info_${Math.random()}`}
                                />
                              </span>
                            ) : (
                              <div>
                                {showActions ? (
                                  <CustomizedTooltip
                                    title={
                                      isActionInProgress
                                        ? "Action can't be performed as one of the resource action is in progress"
                                        : ""
                                    }
                                  >
                                    <div>
                                      <Button
                                        disabled={isActionInProgress}
                                        variant="contained"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setResourceToAttachDetach(
                                            row.Endpoint
                                          );
                                          if (setCurrentFreePoolBlock) {
                                            setCurrentFreePoolBlock(
                                              resourceBlockMember
                                            );
                                          }
                                        }}
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  </CustomizedTooltip>
                                ) : (
                                  <span>Available</span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {[IN_PROGRESS, INPROGRESS].includes(
                              (
                                row.Endpoint?.RecentActionStatus || ""
                              ).toLowerCase()
                            ) ? (
                              <span>
                                <Spinner
                                  text={"In Progress..."}
                                  key={`device_info_${Math.random()}`}
                                />
                              </span>
                            ) : (
                              <CustomizedTooltip
                                placement="left"
                                title={
                                  isActionInProgress
                                    ? "Action can't be performed as one of the resource action is in progress"
                                    : ""
                                }
                              >
                                <div>
                                  <IconButton
                                    disabled={isActionInProgress}
                                    sx={{ p: 0 }}
                                    aria-label="delete"
                                    color="error"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setResourceToAttachDetach(row.Endpoint);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              </CustomizedTooltip>
                            )}
                          </div>
                        )}
                      </TableCell>
                    }
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

const getNetworkStorageTable = (
  data: {
    Id: string;
    Name: string;
    Status: EndpointStatus;
    EndpointPortValue: string;
    Endpoint: Endpoint;
    PCI: string[];
  }[],
  setResourceToAttachDetach: (value: Endpoint) => void,
  isAttachOperation: boolean,
  isActionInProgress: boolean,
  resourceToAttach: Endpoint,
  resourceBlockMember: Member,
  addingToResource: Member | undefined,
  showActions: boolean,
  setCurrentFreePoolBlock?: (freePoolBlock: Member) => void
) => (
  <div className={classes.device_info_table}>
    {networkStorageTable(
      data,
      [
        { key: "Name" },
        { key: "EndPoint" },
        { key: "PCI" },
        { key: "State" },
        { key: "Health" },
        { key: "Action" },
      ],
      setResourceToAttachDetach,
      isAttachOperation,
      isActionInProgress,
      resourceToAttach,
      resourceBlockMember,
      addingToResource,
      showActions,
      setCurrentFreePoolBlock
    )}
  </div>
);

const prepareNetworkStorageData = (
  resources: StorageElement[] | NetworkInterface[]
) => {
  return resources.map((resource: StorageElement | NetworkInterface) => {
    return {
      Id: resource.Id,
      Name: resource.Name,
      Status: resource.Endpoint.Status,
      EndpointPortValue: `${resource?.Endpoint?.Name || "-"}`,
      Endpoint: resource.Endpoint,
      PCI: resource.Endpoint.ConnectedEntities.map(
        (ce: ConnectedEntity) =>
          `${ce?.EntityPciId?.ClassCode} / ${ce?.EntityPciId?.DeviceId} / ${ce?.EntityPciId?.VendorId}`
      ),
    };
  });
};
