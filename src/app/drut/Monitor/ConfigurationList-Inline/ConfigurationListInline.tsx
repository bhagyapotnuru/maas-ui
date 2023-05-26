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

import classess from "../MonitorDashboardConfig.module.scss";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import { fetchData } from "app/drut/config";

const TableCell = styled(MuiTableCell)(({ theme }) => ({
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
        required
        // error
        id="standard-error-helper-text"
        defaultValue={appName}
        // helperText=""
        variant="standard"
        onChange={(e) => onAppNameChange(e, setAppName)}
      />
    </TableCell>
    <TableCell>
      <TextField
        className={classess.config_input}
        required
        // error
        id="standard-error-helper-text"
        defaultValue={appUrl}
        // helperText=""
        variant="standard"
        onChange={(e) => onAppUrlChange(e, setAppUrl)}
      />
    </TableCell>
    <TableCell align="left">
      <IconButton
        aria-label="close"
        onClick={() =>
          onCloseRow(
            config,
            configList,
            setAppName,
            setAppUrl,
            setIsEditInProgress
          )
        }
        color="error"
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
        disabled={isEditInProgress || isLoading}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="edit"
        onClick={() =>
          onEditRow(config, setAppName, setAppUrl, setIsEditInProgress)
        }
        disabled={isEditInProgress || isLoading}
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
                  sx={{ flex: "1 1 100%" }}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Monitor Dashboard configs
                </Typography>
                <Tooltip title="Add new config.">
                  <Button
                    variant="outlined"
                    onClick={() =>
                      onClickAddNewConfig(setIsEditInProgress, setConfigList)
                    }
                    disabled={isEditInProgress || isLoading}
                  >
                    <AddIcon />
                  </Button>
                </Tooltip>
              </Toolbar>
              <TableContainer>
                <Table
                  stickyHeader
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
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
