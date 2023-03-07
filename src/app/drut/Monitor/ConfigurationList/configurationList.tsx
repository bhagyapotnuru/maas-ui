import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, ThemeProvider } from "@mui/material/styles";
import monitorDasboardUrls from "app/drut/Monitor/url";
import { deleteData, fetchData } from "app/drut/config";
import DeleteConfirmationModal from "app/utils/Modals/DeleteConfirmationModal";
import customDrutTheme from "app/utils/Themes/Themes";
import { Link } from "react-router-dom";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

const TableCell = styled(MuiTableCell)(() => ({
  "&.MuiTableCell-root": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const getRows = (
  configResponse: MonitorConfiguration[],
  setConfigToDelete: (configToDelete: MonitorConfiguration) => void
): JSX.Element[] =>
  (configResponse || []).map((config: MonitorConfiguration) => (
    <TableRow
      key={config.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell>{config.cluster_type}</TableCell>
      <Tooltip arrow placement="top" title={config.url}>
        <TableCell>{config.url}</TableCell>
      </Tooltip>
      <TableCell>{config.header}</TableCell>
      <Tooltip arrow placement="top" title={config.description}>
        <TableCell>{config.description}</TableCell>
      </Tooltip>
      <TableCell>{config.display ? "Yes" : "No"}</TableCell>
      <TableCell align="left">
        <IconButton
          aria-label="delete"
          color="error"
          onClick={(e) => {
            e.preventDefault();
            setConfigToDelete(config);
          }}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          aria-label="edit"
          color="primary"
          component={Link}
          to={monitorDasboardUrls.monitorDashboardActions.eventDetails({
            id: config.id,
          })}
        >
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ));

const ConfigurationList = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [configResponse, setConfigResponse] = useState(
    [] as MonitorConfiguration[]
  );
  const [configToDelete, setConfigToDelete] = useState(
    {} as MonitorConfiguration | null | undefined
  );
  const abortController = new AbortController();
  useEffect(() => {
    fetchConfigurationList();
    return () => {
      abortController.abort();
    };
  }, []);

  const fetchConfigurationList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `dfab/clusters/`,
        false,
        abortController.signal
      );
      const configResponse: MonitorConfiguration[] = await response.json();
      setConfigResponse(
        configResponse.filter((response) => response.cluster_type !== "Maas")
      );
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = async () => {
    try {
      setIsLoading(true);
      await deleteData(`dfab/clusters/${configToDelete?.id}/`);
      setConfigToDelete(null);
      await fetchConfigurationList();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmHandler = () => {
    deleteConfiguration();
  };

  const onBackDropClickHandler = () => {
    setConfigToDelete(null);
  };

  const onCancelHandler = () => {
    setConfigToDelete(null);
  };

  return (
    <>
      {configToDelete && configToDelete.id && (
        <DeleteConfirmationModal
          message={`
          The "${configToDelete.cluster_type}" configuration "${configToDelete.header} " 
          will be deleted permanently. Are you sure ?`}
          onClickBackDrop={onBackDropClickHandler}
          onClickCancel={onCancelHandler}
          onConfirm={onConfirmHandler}
          title="Delete Confirmation"
        />
      )}
      {isLoading && (
        <Notification inline severity="information">
          <Spinner text={"Loading..."} />
        </Notification>
      )}
      {!isLoading && (
        <ThemeProvider theme={customDrutTheme}>
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <Toolbar
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                }}
              >
                <Typography
                  component="div"
                  id="tableTitle"
                  sx={{ flex: "1 1 100%" }}
                  variant="h6"
                >
                  Monitor Dashboard configs
                </Typography>
                <Tooltip title="Add new config.">
                  <Button
                    component={Link}
                    disabled={isLoading}
                    to={monitorDasboardUrls.monitorDashboardActions.index}
                    variant="outlined"
                  >
                    <AddIcon />
                  </Button>
                </Tooltip>
              </Toolbar>
              <TableContainer sx={{ maxHeight: "100%" }}>
                <Table
                  aria-label="configuration table"
                  stickyHeader
                  sx={{ minWidth: 650 }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell width={"11%"}>Cluster Type</TableCell>
                      <TableCell>Configured URL</TableCell>
                      <TableCell>Widget Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell width={"10%"}>Displaying</TableCell>
                      <TableCell align="left" width={"10%"}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getRows(configResponse, setConfigToDelete)}
                  </TableBody>
                </Table>
                {!configResponse ||
                  (configResponse.length === 0 && (
                    <div>
                      <p style={{ margin: "1% auto", textAlign: "center" }}>
                        No Monitor Configurations Found
                      </p>
                    </div>
                  ))}
              </TableContainer>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default ConfigurationList;
