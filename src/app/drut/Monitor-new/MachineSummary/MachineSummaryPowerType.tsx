import { useEffect, useState } from "react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

import { MACHINE_SUMMARY_PIE_COLOR_CODES as MSPCOLOR_CODES } from "../Constants/Constants";
import { MACHINE_SUMMARY } from "../Enums/MachineSummary.enum";
import { MACHINE_SUMMARY_OTHERS } from "../Enums/MachineSummaryOthers.enum";
import classess from "../monitor.module.scss";

// import DoughnutChart from "app/base/components/DoughnutChart";
import Meter from "app/base/components/Meter";

type Props = {
  machineSummaryResponse: any;
  powerTypeName: string;
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
  machineSummaryResponse,
  powerTypeName,
}: Props): JSX.Element => {
  const [segments, setSegments] = useState([] as any);
  const [labels, setLabels] = useState([] as any);
  const [totalMachinesCount, setTotalMachinesCount] = useState(0);

  useEffect(() => {
    getSegmentLabelData(machineSummaryResponse);
  }, []);

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
      setTotalMachinesCount(+machineData["TOTAL_MACHINES"]);
      const machineSummaryOthersCount = Object.keys(MACHINE_SUMMARY_OTHERS)
        .map((key) => +machineData[key])
        .reduce((acc: number, curr: number) => acc + curr, 0);
      Object.keys(MACHINE_SUMMARY)
        .filter((key: string) => key !== "OTHERS")
        .forEach((key: string, index: any) => {
          const machineSummaryKey = key as keyof typeof MACHINE_SUMMARY;
          segments.push({
            value: +machineData[machineSummaryKey],
            color: MSPCOLOR_CODES[MACHINE_SUMMARY[machineSummaryKey]].color,
          });
          labels.push(
            <tr key={"" + index + Math.random()}>
              <td>
                <span className={classess.machine_summary_label}>
                  <NavLink
                    to={`./machines?${new URLSearchParams({
                      status: `=${MACHINE_SUMMARY[machineSummaryKey]}`,
                    }).toString()}`}
                    style={{ color: "#111" }}
                  >
                    {MACHINE_SUMMARY[machineSummaryKey]}
                  </NavLink>
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

  const half = Math.ceil(labels.length / 2);

  return (
    <>
      <div
        style={{
          width: 410,
          margin: "auto",
          borderRadius: 10,
          border: "1px solid #e7f1ee",
          background: "white",
        }}
      >
        <>
          <div
            className="window-header"
            style={{ width: 410 }}
            key={Math.floor(Math.random() * 1000)}
          >
            <div className="logo-container">
              <div>
                <span className="app-name">
                  <NavLink
                    to={{
                      pathname: `./machines?q=${powerTypeName.toLowerCase()}`,
                    }}
                  >
                    {powerTypeName}&nbsp;›
                  </NavLink>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: 380, marginLeft: 15 }}>
            <Meter
              className="testformeter"
              data={segments}
              max={totalMachinesCount}
              segmented={false /**/}
              small
            />
          </div>
          <div className="machine-summary-content">
            <div className="labels_1">{labels.slice(0, half)}</div>
            <div className="labels_2">{labels.slice(half)}</div>
          </div>
        </>
      </div>
    </>
  );
};

export default MachineSummary;
