import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { ThemeProvider, styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

import { MACHINE_SUMMARY_PIE_COLOR_CODES as MSPCOLOR_CODES } from "../Constants/Constants";
import { MACHINE_SUMMARY } from "../Enums/MachineSummary.enum";
import { MACHINE_SUMMARY_OTHERS } from "../Enums/MachineSummaryOthers.enum";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import DoughnutChart from "app/base/components/DoughnutChart";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  onRemoveWidget: (value: number) => void;
  onMinimizeWidget: (value: number) => void;
  onPinWidgetHandler: (value: number) => void;
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const MachineSummary = ({
  configData,
  onRemoveWidget,
  onPinWidgetHandler,
  onMinimizeWidget,
}: Props): JSX.Element => {
  const configDataObj = configData as MonitorConfiguration;
  const [segments, setSegments] = useState([] as any);
  const [machineSummaryResponse, setMachineSummaryResponse] = useState(
    {} as any
  );
  const [labels, setLabels] = useState([] as any);
  const [selectedPowerType, setPowerType] = useState("All");
  const [totalMachinesCount, setTotalMachinesCount] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchMachineSummary();
  }, []);

  useEffect(() => {
    getSegmentLabelData(machineSummaryResponse[selectedPowerType]);
  }, [machineSummaryResponse, selectedPowerType]);

  const fetchMachineSummary = async () => {
    try {
      setLoading(true);
      const response = await fetchData(`dfab/summary/?op=get_machine`);
      const configResponse = await response.json();
      setMachineSummaryResponse(configResponse);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getTootltipData = (machineData: any) => {
    return Object.keys(MACHINE_SUMMARY_OTHERS).map(
      (key: string, index: any) => {
        const machineSummaryKey = key as keyof typeof MACHINE_SUMMARY_OTHERS;
        return (
          <li
            key={`${MACHINE_SUMMARY_OTHERS[machineSummaryKey]}`}
          >{`${MACHINE_SUMMARY_OTHERS[machineSummaryKey]} (${machineData[machineSummaryKey]})`}</li>
        );
      }
    );
  };

  const getSegmentLabelData = (machineData: any) => {
    if (machineData && Object.values(machineData).length > 0) {
      const segments: Array<any> = [];
      const labels: Array<any> = [];
      setTotalMachinesCount(machineData["TOTAL_MACHINES"]);
      const machineSummaryOthersCount = Object.keys(MACHINE_SUMMARY_OTHERS)
        .map((key) => +machineData[key])
        .reduce((acc: number, curr: number) => acc + curr, 0);
      Object.keys(MACHINE_SUMMARY)
        .filter((key: string) => key !== "OTHERS")
        .forEach((key: string, index: any) => {
          const machineSummaryKey = key as keyof typeof MACHINE_SUMMARY;
          segments.push({
            tooltip: `${MACHINE_SUMMARY[machineSummaryKey]} (${machineData[machineSummaryKey]})`,
            value: +machineData[machineSummaryKey],
            color: MSPCOLOR_CODES[MACHINE_SUMMARY[machineSummaryKey]].color,
          });
          labels.push(
            <tr key={"" + index + Math.random()}>
              <td>
                <span className={classess.machine_summary_label}>
                  {MACHINE_SUMMARY[machineSummaryKey]}
                </span>
              </td>
              <td
                className={`u-align--right ${classess.machine_summary_legend_value}`}
              >
                {+machineData[key]}
                <span className="u-nudge-right--small">
                  <i
                    className={`p-circle--${
                      MSPCOLOR_CODES[MACHINE_SUMMARY[machineSummaryKey]].link
                    }`}
                  ></i>
                </span>
              </td>
            </tr>
          );
        });
      segments.push({
        tooltip: `${MACHINE_SUMMARY.OTHERS} (${machineSummaryOthersCount})`,
        value: machineSummaryOthersCount,
        color: MSPCOLOR_CODES[MACHINE_SUMMARY.OTHERS].color,
      });
      labels.push(
        <tr
          key={"" + Math.random()}
          className={classess.machine_summary_others}
        >
          <td className={classess.machine_summary_others_td}>
            <span className={classess.machine_summary_label}>
              {MACHINE_SUMMARY.OTHERS}
            </span>
            <HtmlTooltip
              disableFocusListener
              disableTouchListener
              title={
                <div className="others-tool-tip">
                  {getTootltipData(machineData)}
                </div>
              }
              placement="top"
            >
              <InfoOutlinedIcon />
            </HtmlTooltip>
          </td>
          <td
            className={`u-align--right ${classess.machine_summary_legend_value}`}
          >
            {machineSummaryOthersCount}
            <span className="u-nudge-right--small">
              <i
                className={`p-circle--${
                  MSPCOLOR_CODES[MACHINE_SUMMARY.OTHERS].link
                }`}
              ></i>
            </span>
          </td>
        </tr>
      );
      setLabels(labels);
      setSegments(segments);
    }
  };

  const handlePowerTypeChange = (event: SelectChangeEvent) => {
    setPowerType(event.target.value);
  };

  const half = Math.ceil(labels.length / 2);

  return (
    <>
      {isLoading && (
        <Notification inline severity="information">
          <Spinner text={"Loading..."} />
        </Notification>
      )}
      {!isLoading && (
        <>
          <div className="window-header" key={configDataObj?.id}>
            <div className="logo-container">
              <div>
                <span className="app-name">
                  <NavLink to={"./Machines"}>
                    {configDataObj?.header}&nbsp;›
                  </NavLink>
                </span>
              </div>
              <div>
                <ThemeProvider theme={customDrutTheme}>
                  <FormControl
                    id="power-type-simple-select-standard"
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                  >
                    <Select
                      value={selectedPowerType}
                      onChange={handlePowerTypeChange}
                      className={classess.power_type_select}
                    >
                      {Object.keys(machineSummaryResponse)
                        .sort()
                        .map((powerTypeKey: string) => {
                          return (
                            <MenuItem value={powerTypeKey} key={powerTypeKey}>
                              <span className={classess.power_type_menu_item}>
                                {`${powerTypeKey} (${machineSummaryResponse[powerTypeKey]["TOTAL_MACHINES"]})`}
                              </span>
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </ThemeProvider>
              </div>
            </div>
            <div className="actions-container">
              <CustomizedTooltip title={configDataObj.pinned ? `Unpin` : `Pin`}>
                <IconButton
                  className={`${classess.monitor_pin_icon}`}
                  aria-label="open_new"
                  color="error"
                  type="button"
                  disableRipple
                  disableTouchRipple
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPinWidgetHandler(+configDataObj.id);
                  }}
                >
                  {configDataObj.pinned ? (
                    <PushPinIcon />
                  ) : (
                    <PushPinOutlinedIcon />
                  )}
                </IconButton>
              </CustomizedTooltip>
              <CustomizedTooltip title={`Minimize`}>
                <IconButton
                  className={`${classess.monitor_minimize_icon}`}
                  aria-label="open_new"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onMinimizeWidget(+configDataObj.id);
                  }}
                >
                  <CloseFullscreenRoundedIcon />
                </IconButton>
              </CustomizedTooltip>
              <CustomizedTooltip title={`Close`}>
                <IconButton
                  className={`${classess.monitor_close_icon}`}
                  aria-label="open_new"
                  color="error"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveWidget(+configDataObj.id);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </CustomizedTooltip>
            </div>
          </div>
          <div className="machine-summary-content">
            <div className="labels_1">{labels.slice(0, half)}</div>
            <div className="dspie-chart-body">
              <DoughnutChart
                label={totalMachinesCount}
                segments={segments}
                segmentHoverWidth={20}
                segmentWidth={15}
                size={120}
              />
            </div>
            <div className="labels_2">{labels.slice(half)}</div>
          </div>
        </>
      )}
    </>
  );
};

export default MachineSummary;
