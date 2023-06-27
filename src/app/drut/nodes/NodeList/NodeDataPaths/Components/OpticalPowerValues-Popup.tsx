import { useContext, useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import type { OpticalPower } from "../Models/OpticalPower";
import classes from "../NodeDataPath.module.scss";
import NodeDataPathContext from "../Store/NodeDataPath-Context";
import type { NodeDataPathType } from "../Store/NodeDataPathType";

import OpticalPowerTable from "./OpticalPowerTable";

import { fetchOpticalPowerValuesByQuery } from "app/drut/api";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const OpticalPowerValuesPopUp = (): JSX.Element => {
  const context: NodeDataPathType = useContext(NodeDataPathContext);
  const [opticalPowers, setOpticalPowers] = useState([] as OpticalPower[]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const abortController = new AbortController();

  const [refreshInterval, setRefreshInterval] = useState("off");
  const [timer, setTimer] = useState({} as NodeJS.Timer);

  const intervals = ["5000", "10000", "15000", "20000", "30000"];

  useEffect(() => {
    if (refreshInterval === "off") {
      clearInterval(timer);
      return;
    }
    const refreshTimer = setInterval(() => {
      fetchOpticalPowerValues();
    }, +refreshInterval);
    setTimer(refreshTimer);

    return () => {
      abortController.abort();
    };
  }, [refreshInterval]);

  useEffect(() => {
    fetchOpticalPowerValues(true);
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  const fetchOpticalPowerValues = async (showLoader = false) => {
    try {
      setLoading(showLoader);
      const queryParam = context.switchPortToViewOpticalPower
        ?.map((v) =>
          Object.keys(v)
            .map((key) => key + "=" + v[key as keyof typeof v])
            .join("&")
        )
        .join("&");
      const response: OpticalPower[] = await fetchOpticalPowerValuesByQuery(
        queryParam,
        abortController.signal
      );
      setOpticalPowers(response);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const onClickRefresh = () => {
    fetchOpticalPowerValues(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setRefreshInterval(event.target.value);
  };

  const errorValue = error?.toString();

  return (
    <div>
      <div
        className={classes.backdrop}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          context.onBackDropClickOfOpticalPowerPopUP();
          setOpticalPowers([]);
        }}
      >
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <div className={classes.Optical_power_header_content}>
            <header
              className={classes.header}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Optical Power Information</h2>
            </header>
            <div className={classes.optical_values_refresh}>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="refresh-select-label">
                    Auto Refresh
                  </InputLabel>
                  <Select
                    labelId="refresh-select-label"
                    id="refresh-select"
                    value={refreshInterval}
                    onChange={handleChange}
                    label="Auto Refresh"
                    disabled={loading}
                  >
                    <MenuItem value="off">
                      <em>Off</em>
                    </MenuItem>
                    {intervals.map((i) => (
                      <MenuItem value={i}>{`${+i / 1000}s`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <CustomizedTooltip title={`Refresh Optical Power values`}>
                <div>
                  {loading ? (
                    <Spinner text="Refreshing..." />
                  ) : (
                    <IconButton
                      disabled={refreshInterval !== "off"}
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        onClickRefresh();
                      }}
                    >
                      <RefreshRoundedIcon />
                    </IconButton>
                  )}
                </div>
              </CustomizedTooltip>
            </div>
          </div>
          {errorValue && !errorValue?.includes("AbortError") && (
            <Notification
              onDismiss={() => setError("")}
              inline
              severity="negative"
            >
              {errorValue}
            </Notification>
          )}
          {loading && (
            <Notification inline severity="information">
              <Spinner text={"Fetching Power Values..."} />
            </Notification>
          )}
          <div className={classes.content} onClick={(e) => e.stopPropagation()}>
            <OpticalPowerTable opticalPowers={opticalPowers} />
          </div>
          <footer
            className={classes.actions}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={classes.default_btn}>
              <Button
                disabled={loading}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  context.onOpticalPowerValuePopupCancel();
                  setOpticalPowers([]);
                  setError("");
                }}
              >
                Close
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OpticalPowerValuesPopUp;
