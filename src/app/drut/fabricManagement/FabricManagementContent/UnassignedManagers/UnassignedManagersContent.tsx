import { useState, useEffect } from "react";

import {
  Col,
  Row,
  Notification,
  Spinner,
  Select,
} from "@canonical/react-components";
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import classess from "../../fabricManagement.module.css";
import { MANAGER_TYPES } from "../Managers/AddManager/constants";
import type { Manager } from "../Managers/type";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  error: string;
  fetchManagers: boolean;
  setManagers: React.Dispatch<React.SetStateAction<Manager[]>>;
  setError: (value: string) => void;
  setFetchManagers: (value: boolean) => void;
};

const managerOptions = [
  {
    value: "none",
    label: "No filter",
  },
  ...MANAGER_TYPES.map((value: string) => ({
    label: value,
    value: value,
  })),
];

const UnassignedManagersContent = ({
  error,
  setError,
  setManagers,
  fetchManagers,
  setFetchManagers,
}: Props): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [managersList, setManagersList] = useState<Manager[]>([]);
  const [managersListCopy, setManagersListCopy] = useState<Manager[]>([]);

  const abortController = new AbortController();

  useEffect(() => {
    if (fetchManagers) {
      getManagersData();
    }
  }, [fetchManagers]);

  useEffect(() => {
    setManagers(managersListCopy);
  }, [managersListCopy]);

  const getManagersData = async () => {
    setLoading(true);
    try {
      const promise = await fetchData(
        "dfab/managers/?rack_name=Default_Rack",
        false,
        abortController.signal
      );
      setFetchManagers(false);
      if (promise.status === 200) {
        let response = await promise.json();
        if (response) {
          response = response.map((data: Manager) => {
            return { ...data, checked: false };
          });
          setManagersList(response);
          setManagersListCopy(response);
        }
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getUnassignedManagerListTable = (
    managerList: Manager[],
    onParentCheckBoxChange: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void,
    onChildCheckBoxChange: (checked: boolean, checkedManager: Manager) => void
  ) => {
    const isIndeterminate: boolean = managersList.some(
      (manager: Manager) => manager.checked
    );
    const isFullyChecked: boolean =
      managerList.length > 0 &&
      managerList.every((manager: Manager) => manager.checked);

    return (
      <ThemeProvider theme={customDrutTheme}>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 0, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader sx={{ mb: 0 }}>
                <TableHead>
                  <TableRow className={classess.tableHeader}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={isIndeterminate && !isFullyChecked}
                        checked={isFullyChecked}
                        onChange={onParentCheckBoxChange}
                        inputProps={{
                          "aria-label": "select all managers",
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ width: 150 }}>
                      Name
                    </TableCell>
                    <TableCell align="left" sx={{ width: 130 }}>
                      Manager Type
                    </TableCell>
                    <TableCell align="left" sx={{ width: 220 }}>
                      Fully Qualified Group Name
                    </TableCell>
                    <TableCell align="left" sx={{ width: 180 }}>
                      Manufacturer
                    </TableCell>
                    <TableCell align="left" sx={{ width: 100 }}>
                      Protocol
                    </TableCell>
                    <TableCell align="left" sx={{ width: 150 }}>
                      IP Address
                    </TableCell>
                    <TableCell align="left" sx={{ width: 120 }}>
                      Port Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                {managersList && managersList.length > 0 ? (
                  <TableBody>
                    {managerList.map((manager: Manager, index: number) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={manager.checked}
                          tabIndex={-1}
                          key={manager.id}
                          selected={manager.checked}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={manager.checked}
                              onChange={(_, checked: boolean) => {
                                manager.checked = checked;
                                onChildCheckBoxChange(checked, manager);
                              }}
                            />
                          </TableCell>
                          <TableCell id={labelId} scope="row" align="left">
                            <TextField
                              className={classess.manager_name_input}
                              required
                              id="manager-name-input-text"
                              variant="standard"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                manager.name = e.target.value;
                              }}
                              label=""
                              defaultValue={manager.name}
                              placeholder="Manager Name"
                            />
                          </TableCell>
                          <TableCell id={labelId} scope="row" align="left">
                            {manager.manager_type}
                          </TableCell>
                          <TableCell id={labelId} align="left" scope="row">
                            {
                              <CustomizedTooltip
                                key={`FullyQualifiedGroupName_tooltip_${index}`}
                                title={manager?.rack_fqgn}
                                className="drut-col-name-left-sn-ellipsis"
                                placement={"bottom-start"}
                              >
                                <span>{manager?.rack_fqgn || "-"}</span>
                              </CustomizedTooltip>
                            }
                          </TableCell>
                          <TableCell id={labelId} align="left" scope="row">
                            {manager.manufacturer || "-"}
                          </TableCell>
                          <TableCell id={labelId} align="left" scope="row">
                            {manager.protocol || "-"}
                          </TableCell>
                          <TableCell id={labelId} align="left" scope="row">
                            {
                              <CustomizedTooltip
                                title={manager?.remote_redfish_uri}
                                className="drut-col-name-left-sn-ellipsis"
                                key={`IP_Address_tooltip_${index}`}
                                placement={"bottom-start"}
                              >
                                <span>
                                  <a
                                    target="_blank"
                                    href={manager?.remote_redfish_uri}
                                  >
                                    {manager?.ip_address || "-"}
                                  </a>
                                </span>
                              </CustomizedTooltip>
                            }
                          </TableCell>
                          <TableCell id={labelId} align="left" scope="row">
                            {manager.port_count || 0}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody className={classess.no_data_table_body}>
                    No Unassigned Managers available.
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  };

  useEffect(() => {
    if (searchText === "" && filter === "none") {
      setManagersList(managersListCopy);
    } else {
      let filterdManager = managersListCopy.filter((row: Manager) =>
        Object.values(row)
          .join("")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      switch (filter) {
        case "none":
          break;
        default:
          if (MANAGER_TYPES.includes(filter)) {
            filterdManager = filterdManager.filter(
              (manager) =>
                manager?.manager_type.toLowerCase() === filter.toLowerCase()
            );
            break;
          }
      }
      setManagersList(filterdManager);
    }
  }, [filter, searchText]);

  const onParentCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checkedManagerIds: number[] = [];
    setManagersList((managers: Manager[]) => {
      managers.forEach((manager: Manager) => {
        manager.checked = event.target.checked;
        checkedManagerIds.push(manager.id);
      });
      return [...managers];
    });
    setManagersListCopy((managers: Manager[]) => {
      managers.forEach(
        (manager: Manager) =>
          (manager.checked = checkedManagerIds.includes(manager.id)
            ? event.target.checked
            : manager.checked)
      );
      return [...managers];
    });
  };

  const onChildCheckBoxChange = (checked: boolean, checkedManager: Manager) => {
    setManagersListCopy((managers: Manager[]) => {
      const selectedManager: Manager | undefined = managers.find(
        (manager) => manager.id === checkedManager.id
      );
      if (selectedManager) {
        selectedManager.checked = checked;
      }
      return [...managers];
    });
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
            text="Loading..."
            key={`managerListSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <div>
          <Row>
            <Col size={3}>
              <Select
                defaultValue={"none"}
                name="group-filter"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFilter(e.target.value);
                }}
                options={managerOptions}
              />
            </Col>
            <Col size={9}>
              <DebounceSearchBox
                onDebounced={(debouncedText) => setSearchText(debouncedText)}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </Col>
          </Row>
          <Row>
            <div style={{ height: "100%", width: "100%" }}>
              {getUnassignedManagerListTable(
                managersList,
                onParentCheckBoxChange,
                onChildCheckBoxChange
              )}
            </div>
          </Row>
        </div>
      )}
    </>
  );
};

export default UnassignedManagersContent;
