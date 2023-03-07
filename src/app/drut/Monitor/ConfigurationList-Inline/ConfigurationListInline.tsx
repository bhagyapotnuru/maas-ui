import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  Table,
  TableRow,
  IconButton,
  Box,
  Toolbar,
  Typography,
  Tooltip,
  Button,
  TextField,
  // TextField,
} from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { fetchData } from "app/drut/config";

import classess from "../MonitorDashboardConfig.module.css";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

const TableCell = styled(MuiTableCell)(() => ({
  "&.MuiTableCell-root": {
    wordBreak: "break-all",
  },
}));

const onAppNameChange = (event: any, setAppName: (value: string) => void) => {
  setAppName(event.target.value);
};

const onAppUrlChange = (event: any, setAppUrl: (value: string) => void) => {
  setAppUrl(event.target.value);
};

const onClickSave = (
  config: MonitorConfiguration,
  appName: string,
  appUrl: string,
  setIsEditInProgress: (value: boolean) => void
) => {
  config.isEditable = false;
  config.cluster_type = appName;
  config.url = appUrl;
  setIsEditInProgress(false);
};

const onCloseRow = (
  config: MonitorConfiguration,
  configList: MonitorConfiguration[],
  setAppName: (value: string) => void,
  setAppUrl: (value: string) => void,
  setIsEditInProgress: (value: boolean) => void
) => {
  config.isEditable = false;
  if (config.id === 0) {
    configList.shift();
    setAppName("");
    setAppUrl("");
  }
  setIsEditInProgress(false);
};

const onEditRow = (
  config: MonitorConfiguration,
  setAppName: (value: string) => void,
  setAppUrl: (value: string) => void,
  setIsEditInProgress: (value: boolean) => void
) => {
  config.isEditable = true;
  setIsEditInProgress(true);
  setAppName(config.cluster_type);
  setAppUrl(config.url);
};

const theme = createTheme({
  typography: {
    fontFamily: [
      "Ubuntu",
      "-apple-system",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Cantarell",
      "Fira",
      "Sans",
      "Droid Sans",
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
    fontWeightRegular: 300,
  },
});

const onClickAddNewConfig = (
  setIsEditInProgress: (value: boolean) => void,
  setConfigList: (
    configList: (prevConfig: MonitorConfiguration[]) => MonitorConfiguration[]
  ) => void
) => {
  const newConfig: MonitorConfiguration = {
    cluster_type: "",
    url: "",
    isEditable: true,
    id: 0,
  } as MonitorConfiguration;
  setConfigList((prevConfig: MonitorConfiguration[]) => [
    newConfig,
    ...prevConfig,
  ]);
  setIsEditInProgress(true);
};

const editableTableRow = (
  config: MonitorConfiguration,
  appName: string,
  appUrl: string,
  configList: MonitorConfiguration[],
  setAppName: (appName: string) => void,
  setAppUrl: (appUrl: string) => void,
  setIsEditInProgress: (value: boolean) => void
) => (
  <TableRow
    key={config.id}
    sx={{
      "&:last-child td, &:last-child th": { border: 0 },
    }}
  >
    <TableCell>
      <TextField
        className={classess.config_input}
        defaultValue={appName}
        // error
        id="standard-error-helper-text"
        onChange={(e) => onAppNameChange(e, setAppName)}
        // helperText=""
        required
        variant="standard"
      />
    </TableCell>
    <TableCell>
      <TextField
        className={classess.config_input}
        defaultValue={appUrl}
        // error
        id="standard-error-helper-text"
        onChange={(e) => onAppUrlChange(e, setAppUrl)}
        // helperText=""
        required
        variant="standard"
      />
    </TableCell>
    <TableCell align="left">
      <IconButton
        aria-label="close"
        color="error"
        onClick={() =>
          onCloseRow(
            config,
            configList,
            setAppName,
            setAppUrl,
            setIsEditInProgress
          )
        }
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        aria-label="save"
        color="success"
        onClick={() =>
          onClickSave(config, appName, appUrl, setIsEditInProgress)
        }
      >
        <CheckIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

const nonEditableTableRow = (
  config: MonitorConfiguration,
  isEditInProgress: boolean,
  isLoading: boolean,
  setAppName: (appName: string) => void,
  setAppUrl: (appUrl: string) => void,
  setIsEditInProgress: (isEditInProgress: boolean) => void
) => (
  <TableRow
    key={config.id}
    sx={{
      "&:last-child td, &:last-child th": { border: 0 },
    }}
  >
    <TableCell>{config.cluster_type}</TableCell>
    <TableCell>{config.url}</TableCell>
    <TableCell align="left">
      <IconButton
        aria-label="delete"
        color="error"
        disabled={isEditInProgress || isLoading}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        aria-label="edit"
        color="primary"
        disabled={isEditInProgress || isLoading}
        onClick={() =>
          onEditRow(config, setAppName, setAppUrl, setIsEditInProgress)
        }
      >
        <EditIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

const ConfigurationList = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [configList, setConfigList] = useState([] as MonitorConfiguration[]);
  const [isEditInProgress, setIsEditInProgress] = useState(false);
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const abortController = new AbortController();

  useEffect(() => {
    fetchConfigurationList();
  }, []);

  async function fetchConfigurationList() {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `dfab/clusters/`,
        false,
        abortController.signal
      );
      const configListReponse: MonitorConfiguration[] = await response.json();
      setConfigList(configListReponse);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  // async function saveConfiguration(config: MonitorConfiguration) {
  //   try {
  //     setIsLoading(true);
  //     const response = await postData(`dfab/clusters/`, config, false);
  //     await response.json();
  //   } catch (e) {
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const getTableRowToRender = (config: MonitorConfiguration) =>
    config.isEditable
      ? editableTableRow(
          config,
          appName,
          appUrl,
          configList,
          setAppName,
          setAppUrl,
          setIsEditInProgress
        )
      : nonEditableTableRow(
          config,
          isEditInProgress,
          isLoading,
          setAppName,
          setAppUrl,
          setIsEditInProgress
        );

  return (
    <>
      {isLoading && (
        <Notification inline severity="information">
          <Spinner text={"Loading..."} />
        </Notification>
      )}
      {configList && (
        <ThemeProvider theme={theme}>
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
                    disabled={isEditInProgress || isLoading}
                    onClick={() =>
                      onClickAddNewConfig(setIsEditInProgress, setConfigList)
                    }
                    variant="outlined"
                  >
                    <AddIcon />
                  </Button>
                </Tooltip>
              </Toolbar>
              <TableContainer>
                <Table
                  aria-label="simple table"
                  stickyHeader
                  sx={{ minWidth: 650 }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell width={"20%"}>Application</TableCell>
                      <TableCell>Configured URL</TableCell>
                      <TableCell align="left" width={"15%"}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{configList.map(getTableRowToRender)}</TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default ConfigurationList;
