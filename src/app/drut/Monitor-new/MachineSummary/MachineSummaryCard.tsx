import { useEffect, useState } from "react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

import { MACHINE_SUMMARY_PIE_COLOR_CODES as MSPCOLOR_CODES } from "../Constants/Constants";
import { MACHINE_SUMMARY } from "../Enums/MachineSummary.enum";
import { MACHINE_SUMMARY_OTHERS } from "../Enums/MachineSummaryOthers.enum";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import DoughnutChart from "app/base/components/DoughnutChart";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  machineSummaryResponse: any;
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

const MachineSummaryCard = ({
  configData,
  machineSummaryResponse,
}: Props): JSX.Element => {
  const [segments, setSegments] = useState([] as any);
  const [labels, setLabels] = useState([] as any);
  const [totalMachinesCount, setTotalMachinesCount] = useState("");

  useEffect(() => {
    getSegmentLabelData(machineSummaryResponse["All"]);
  }, [machineSummaryResponse]);

  const getRequiredLabelData = (machineData: any) => {
    if (machineData) {
      const newMachineData: [string, number][] = [];
      Object.keys(MACHINE_SUMMARY)
        .filter((key: string) => key !== "OTHERS")
        .forEach((key: string, index: any) => {
          newMachineData.push([key, +machineData[key]]);
        });
      const sortedMachineData = newMachineData
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .map((el) => el[0])
        .slice(0, 2);
      return sortedMachineData;
    }
  };

  const getSegmentLabelData = (machineData: any) => {
    if (machineData && Object.values(machineData).length > 0) {
      const segments: Array<any> = [];
      const labels: Array<any> = [];
      const tooltip: Array<any> = [];
      const labelsToShow = getRequiredLabelData(machineData);
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
          if (labelsToShow?.includes(machineSummaryKey)) {
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
          } else {
            tooltip.push(
              <li
                key={`${MACHINE_SUMMARY[machineSummaryKey]}`}
              >{`${MACHINE_SUMMARY[machineSummaryKey]} (${machineData[machineSummaryKey]})`}</li>
            );
          }
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
              <HtmlTooltip
                disableFocusListener
                disableTouchListener
                title={<div className="others-tool-tip">{tooltip}</div>}
                placement="top"
              >
                <InfoOutlinedIcon />
              </HtmlTooltip>
            </span>
          </td>
        </tr>
      );
      setLabels(labels);
      setSegments(segments);
    }
  };

  return (
    <>
      <div>
        <div className="dspie-chart-body-small" style={{ marginLeft: 65 }}>
          <DoughnutChart
            label={totalMachinesCount}
            segmentHoverWidth={20}
            segmentWidth={15}
            size={120}
            segments={segments}
          />
        </div>
        <div>{labels}</div>
      </div>
    </>
  );
};

export default MachineSummaryCard;
