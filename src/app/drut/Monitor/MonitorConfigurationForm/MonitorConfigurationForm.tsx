import { useEffect, useState } from "react";

import Notification from "@canonical/react-components/dist/components/Notification";
import Spinner from "@canonical/react-components/dist/components/Spinner";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiFormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { styled, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";

import classess from "../MonitorDashboardConfig.module.scss";
import {
  SHELL_IN_A_BOX_CLUSTER_TYPES,
  OTHER_TYPES,
  OTHERS,
} from "../ShellInABoxWidget/constants";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import monitorUrls from "../url";

import {
  fetchResourcePoolsData,
  fetchMonitorDataById,
  fetchClusterTypesData,
  createOrUpdateMonitorConfigurations,
} from "app/drut/api";
import customDrutTheme from "app/utils/Themes/Themes";

interface State {
  clusterTypes: string[];
  selectedClusterType: string;
  configUrl: string;
  userName: string;
  password: string;
  widgetName: string;
  description: string;
  showPassword: boolean;
  gridlayout?: any;
  shellInTheBoxUrl: string;
  display: boolean;
  resourcepools: string[];
  selectedResourcePool: string;
}

const renderErrorFieldHtml = (errorMessage: string) => (
  <span className={classess.config_input_error}>
    {errorMessage || "*This field is required."}
  </span>
);

const compareStringsIgnoreCase = (string1: string, string2: string) =>
  string1.toLowerCase() === string2.toLowerCase();

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return urlString !== "" && !!urlPattern.test(urlString);
};

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  "&.MuiFormControl-root": {
    width: "-webkit-fill-available",
  },
}));

const clusterTypeSelection = (
  values: State,
  setValues: (values: State) => void,
  clusterTypeOnError: boolean,
  setClusterTypeOnError: (value: boolean) => void
) => (
  <div>
    <FormControl sx={{ m: 1, minWidth: "30ch" }} variant="standard">
      <TextField
        className={classess.config_input}
        error={clusterTypeOnError}
        id="cluster-type-simple-select-standard"
        label="Select Cluster Type"
        onChange={(e) => {
          setValues({
            ...values,
            selectedClusterType: e.target.value as string,
          });
          setClusterTypeOnError(false);
        }}
        required
        select
        value={values.selectedClusterType ?? ""}
        variant="standard"
      >
        {values.clusterTypes.map((clusterType: string) => {
          return <MenuItem value={clusterType}>{clusterType}</MenuItem>;
        })}
      </TextField>
      <div className={classess.error_field}>
        {clusterTypeOnError && renderErrorFieldHtml("")}
      </div>
    </FormControl>
  </div>
);

const resourcePoolSelection = (
  values: State,
  setValues: (values: State) => void,
  resourcePoolOnError: boolean,
  setResourcePoolOnError: (value: boolean) => void
) => {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: "30ch" }} variant="standard">
        <TextField
          className={classess.config_input}
          error={resourcePoolOnError}
          id="resource-pool-simple-select-standard"
          label="Select Resource Pool"
          onChange={(e) => {
            setValues({
              ...values,
              selectedResourcePool: e.target.value as string,
            });
            setResourcePoolOnError(false);
          }}
          required
          select
          value={values.selectedResourcePool ?? ""}
          variant="standard"
        >
          {values.resourcepools.map((rPool: string) => {
            return <MenuItem value={rPool}>{rPool}</MenuItem>;
          })}
        </TextField>
      </FormControl>
      <div className={classess.error_field}>
        {resourcePoolOnError && renderErrorFieldHtml("")}
      </div>
    </div>
  );
};

const configUrl = (
  values: State,
  setValues: (values: State) => void,
  configUrlDomOnError: boolean,
  setConfigUrlOnError: (value: boolean) => void,
  placeHolder: string
) => (
  <div>
    <FormControl required sx={{ m: 1, width: "100%" }} variant="standard">
      <InputLabel htmlFor="standard-configurl">{placeHolder}</InputLabel>
      <Input
        className={classess.config_input}
        error={configUrlDomOnError}
        id="standard-configurl"
        onBlur={(e) => {
          if (!isValidUrl(e.target.value)) {
            setConfigUrlOnError(true);
          }
        }}
        onChange={(e) => {
          setValues({ ...values, configUrl: e.target.value as string });
          setConfigUrlOnError(false);
        }}
        value={values.configUrl}
      />
    </FormControl>
    <div className={classess.error_field}>
      {configUrlDomOnError &&
        renderErrorFieldHtml(
          !values.configUrl ? "" : "Please enter a valid URL."
        )}
    </div>
  </div>
);

const shellInTheBoxUrl = (
  values: State,
  setValues: (values: State) => void,
  shellInTheBoxUrlOnError: boolean,
  setShellInTheBoxUrlOnError: (value: boolean) => void
) => (
  <div>
    <FormControl required sx={{ m: 1, width: "100%" }} variant="standard">
      <InputLabel htmlFor="standard-configurl">Shell In The Box Url</InputLabel>
      <Input
        className={classess.config_input}
        error={shellInTheBoxUrlOnError}
        id="standard-shellInTheBoxurl"
        onBlur={(e) => {
          if (!isValidUrl(e.target.value)) {
            setShellInTheBoxUrlOnError(true);
          }
        }}
        onChange={(e) => {
          setValues({ ...values, shellInTheBoxUrl: e.target.value as string });
          setShellInTheBoxUrlOnError(false);
        }}
        value={values.shellInTheBoxUrl}
      />
    </FormControl>
    <div className={classess.error_field}>
      {shellInTheBoxUrlOnError &&
        renderErrorFieldHtml(
          !values.shellInTheBoxUrl ? "" : "Please enter a valid URL."
        )}
    </div>
  </div>
);

const userName = (values: State, setValues: (values: State) => void) => (
  <FormControl sx={{ m: 1, width: "50ch" }} variant="standard">
    <InputLabel htmlFor="standard-username">Username</InputLabel>
    <Input
      className={classess.config_input}
      id="standard-username"
      onChange={(e) => {
        setValues({ ...values, userName: e.target.value as string });
      }}
      required
      value={values.userName}
    />
  </FormControl>
);

const password = (values: State, setValues: (values: State) => void) => (
  <FormControl sx={{ m: 1, width: "50ch" }} variant="standard">
    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
    <Input
      className={classess.config_input}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => {
              setValues({
                ...values,
                showPassword: !values.showPassword,
              });
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {values.showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      id="standard-adornment-password"
      onChange={(e) =>
        setValues({ ...values, password: e.target.value as string })
      }
      type={values.showPassword ? "text" : "password"}
      value={values.password}
    />
  </FormControl>
);

const widgetName = (
  values: State,
  setValues: (values: State) => void,
  widgetNameOnError: boolean,
  setWidgetNameOnError: (value: boolean) => void
) => (
  <div className={classess.widget_name_block}>
    <FormControl
      sx={{ m: 1, width: "50ch", marginBottom: 0 }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-widgetname" required>
        Widget Name
      </InputLabel>
      <Input
        className={classess.config_input}
        error={widgetNameOnError}
        id="standard-widgetname"
        onBlur={(e) => {
          if (
            compareStringsIgnoreCase(
              e.target.value.trim(),
              "Machine Summary"
            ) ||
            !e.target.value
          ) {
            setWidgetNameOnError(true);
          }
        }}
        onChange={(e) => {
          setValues({ ...values, widgetName: e.target.value as string });
          setWidgetNameOnError(false);
        }}
        value={values.widgetName}
      />
    </FormControl>
    <div className={classess.error_field}>
      {widgetNameOnError &&
        renderErrorFieldHtml(
          !values.widgetName ? "" : "Machine Summary is a reserved keyword."
        )}
    </div>
  </div>
);

const description = (values: State, setValues: (values: State) => void) => (
  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
    <InputLabel htmlFor="config-description">Description</InputLabel>
    <Input
      className={classess.config_input}
      id="config-description"
      onChange={(e) => {
        setValues({ ...values, description: e.target.value as string });
      }}
      rows={6}
      value={values.description}
    />
  </FormControl>
);

const MonitorConfigurationForm = ({
  parmsId,
}: {
  parmsId: number;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingInProgress, setSavingInProgress] = useState(false);
  const [loadingMessage, SetLoadingMsg] = useState("Loading...");
  const [values, setValues] = useState<State>({
    clusterTypes: [],
    selectedClusterType: "",
    shellInTheBoxUrl: "",
    configUrl: "",
    userName: "",
    password: "",
    widgetName: "",
    description: "",
    showPassword: false,
    gridlayout: {
      h: 11,
      i: "",
      w: 6,
      x: 0,
      y: 0,
      minH: 11,
      minW: 6,
      moved: false,
      static: false,
    },
    display: true,
    resourcepools: [],
    selectedResourcePool: "",
  });
  const [configUrlOnError, setConfigUrlOnError] = useState(false);
  const [shellInTheBoxUrlOnError, setShellInTheBoxUrlOnError] = useState(false);
  const [clusterTypeOnError, setClusterTypeOnError] = useState(false);
  const [resourcePoolOnError, setResourcePoolOnError] = useState(false);
  const [widgetNameOnError, setWidgetNameOnError] = useState(false);
  const [error, setError] = useState("");

  const abortController = new AbortController();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClusterTypes();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (values.clusterTypes.length > 0) {
      fetchResourcePools();
    }
    return () => {
      abortController.abort();
    };
  }, [values.clusterTypes]);

  useEffect(() => {
    if (
      parmsId &&
      values.clusterTypes.length > 0 &&
      values.resourcepools.length > 0
    ) {
      fetchConfiguration(parmsId);
    }
    return () => {
      abortController.abort();
    };
  }, [values.resourcepools]);

  const fetchClusterTypes = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const clusterTypesResponse: any = await fetchClusterTypesData();
      setValues((values: State) => {
        return {
          ...values,
          clusterTypes: clusterTypesResponse,
        };
      });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResourcePools = async () => {
    try {
      setIsLoading(true);
      const response: any = await fetchResourcePoolsData();
      const resourcePools: string[] = response.map(
        (resourcePool: any) => resourcePool.name
      );
      setValues((values: State) => {
        return {
          ...values,
          resourcepools: resourcePools,
        };
      });
    } catch (e: any) {
      setError(e ? e : "Failed to load resource pools");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfiguration = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      const configResponse = await fetchMonitorDataById(
        id,
        abortController.signal
      );
      setValues({
        ...values,
        selectedClusterType: configResponse.cluster_type,
        configUrl: configResponse.url,
        userName: configResponse.user,
        password: configResponse.password,
        widgetName: configResponse.header,
        description: configResponse.description,
        gridlayout: configResponse.gridlayout,
        display: configResponse.display,
        selectedResourcePool: configResponse.resourcepool,
        shellInTheBoxUrl: configResponse.shellinabox_url,
      });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveValidationCheck = (): boolean => {
    const isShellInABoxWidget = [
      ...SHELL_IN_A_BOX_CLUSTER_TYPES,
      OTHERS,
    ].includes(values.selectedClusterType);

    if (isShellInABoxWidget && !isValidUrl(values.shellInTheBoxUrl)) {
      setShellInTheBoxUrlOnError(true);
    }
    if (isShellInABoxWidget && !values.selectedResourcePool) {
      setResourcePoolOnError(true);
    }
    if (!isValidUrl(values.configUrl)) {
      setConfigUrlOnError(true);
    }
    if (
      !values.widgetName ||
      compareStringsIgnoreCase(values.widgetName, "Machine Summary")
    ) {
      setWidgetNameOnError(true);
    }
    if (!values.selectedClusterType) {
      setClusterTypeOnError(true);
    }
    return (
      !!values.widgetName &&
      !!values.selectedClusterType &&
      (isShellInABoxWidget ? !!values.selectedResourcePool : true) &&
      !compareStringsIgnoreCase(values.widgetName, "Machine Summary") &&
      isValidUrl(values.configUrl) &&
      (isShellInABoxWidget ? isValidUrl(values.shellInTheBoxUrl) : true)
    );
  };

  const getGridLayoutValues = (values: State, parmsId: number) => {
    if (
      SHELL_IN_A_BOX_CLUSTER_TYPES.includes(values.selectedClusterType) &&
      !parmsId
    ) {
      return {
        w: 12,
        h: 11,
        x: 0,
        y: 0,
        i: "",
        minW: 12,
        minH: 11,
        moved: false,
        static: false,
      };
    } else {
      return values.gridlayout;
    }
  };

  const onClickSave = async () => {
    const canSave = onSaveValidationCheck();
    if (canSave) {
      setSavingInProgress(true);
      SetLoadingMsg("Saving Configuration...");
      const payLoad: MonitorConfiguration = {
        cluster_type: values.selectedClusterType,
        display: values.display,
        description: values.description,
        header: values.widgetName,
        id: parmsId,
        url: values.configUrl,
        user: values.userName,
        password: values.password,
        gridlayout: getGridLayoutValues(values, parmsId),
        resourcepool: values.selectedResourcePool || "",
      } as MonitorConfiguration;
      if (SHELL_IN_A_BOX_CLUSTER_TYPES.includes(values.selectedClusterType)) {
        payLoad["shellinabox_url"] = values.shellInTheBoxUrl;
      }
      const params = parmsId ? `${parmsId}/` : "";
      createOrUpdateMonitorConfigurations(params, payLoad, !!parmsId)
        .then(async (promise: any) => {
          navigate(monitorUrls.monitorDashboardList.index);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setSavingInProgress(false);
          SetLoadingMsg("Loading...");
        });
    }
  };

  return (
    <>
      {isLoading && (
        <Notification inline severity="information">
          <Spinner text={loadingMessage} />
        </Notification>
      )}
      {isSavingInProgress && (
        <Notification inline severity="information">
          <Spinner text={loadingMessage} />
        </Notification>
      )}
      {error && (
        <Notification
          inline
          key={`error_notification_${Math.random()}`}
          onDismiss={() => setError("")}
          severity="negative"
        >
          <pre>{error}</pre>
        </Notification>
      )}
      {!isLoading && (
        <ThemeProvider theme={customDrutTheme}>
          <Box
            autoComplete="off"
            className={classess.config_box}
            component="form"
            marginLeft="auto"
            marginRight="auto"
            noValidate
            width="fit-content"
          >
            <div className={classess.row_1}>
              {clusterTypeSelection(
                values,
                setValues,
                clusterTypeOnError,
                setClusterTypeOnError
              )}
              {values.selectedClusterType &&
                values.selectedClusterType.toLowerCase() !== "kubeopsview" &&
                resourcePoolSelection(
                  values,
                  setValues,
                  resourcePoolOnError,
                  setResourcePoolOnError
                )}
              {widgetName(
                values,
                setValues,
                widgetNameOnError,
                setWidgetNameOnError
              )}
            </div>
            {values.selectedClusterType && (
              <>
                <div>
                  {values.selectedClusterType.toLowerCase() !== "kubeopsview" &&
                    shellInTheBoxUrl(
                      values,
                      setValues,
                      shellInTheBoxUrlOnError,
                      setShellInTheBoxUrlOnError
                    )}
                  {configUrl(
                    values,
                    setValues,
                    configUrlOnError,
                    setConfigUrlOnError,
                    OTHER_TYPES.includes(values.selectedClusterType)
                      ? "Configuration Url"
                      : "Dashboard Url"
                  )}
                </div>
                {values.selectedClusterType.toLowerCase() !== "kubeopsview" && (
                  <div className={classess.username_password}>
                    {userName(values, setValues)}
                    {password(values, setValues)}
                  </div>
                )}
                <div>{description(values, setValues)}</div>
                <div className={classess.form_btn}>
                  <Button
                    className={classess.default_btn}
                    component={Link}
                    to={monitorUrls.monitorDashboardList.index}
                    variant="text"
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classess.primay_btn}
                    focusRipple
                    onClick={(e) => {
                      e.preventDefault();
                      onClickSave();
                    }}
                    variant="contained"
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default MonitorConfigurationForm;
