import { useEffect, useState } from "react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import DoughnutChart from "app/base/components/DoughnutChart";
import { COLOURS } from "app/base/constants";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  resourceBlockSummary: any;
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

const colorCode: any = {
  Composed: { color: COLOURS.POSITIVE, link: "positive" },
  Failed: { color: COLOURS.NEGATIVE, link: "negative" },
  Unavailable: { color: COLOURS.LINK_FADED, link: "link-faded" },
  Unused: { color: COLOURS.LINK, link: "link" },
};

const MachineSummaryCard = ({
  configData,
  resourceBlockSummary,
}: Props): JSX.Element => {
  const [segments, setSegments] = useState([] as any);
  const [labels, setLabels] = useState([] as any);
  const [total, setTotal] = useState("");

  useEffect(() => {
    getParsedSummary(resourceBlockSummary);
  }, [resourceBlockSummary]);

  const getRequiredLabelData = (data: any) => {
    if (data) {
      const newData: [string, number][] = [];
      Object.keys(data).forEach((key: string, index: any) => {
        newData.push([key, +data[key]]);
      });
      const sortedDate = newData
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .map((el: any) => el[0])
        .slice(0, 2);
      return sortedDate;
    }
  };

  const getParsedSummary = (summary: any = null): any => {
    const Total: any = {
      total: 0,
      counters: { Unused: 0, Composed: 0, Failed: 0, Unavailable: 0 },
    };
    const data: any = summary?.Summary?.ResourceBlock || {};
    const keys = Object.keys(data).sort();
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const cs = data[key].CompositionState;
      Object.keys(cs).forEach((cKey: string) => {
        Total.counters[cKey] = Total.counters[cKey] + cs[cKey];
        Total.total = Total.total + cs[cKey];
      });
    }
    const requiredLabels = getRequiredLabelData(Total.counters);
    const segments: Array<any> = [];
    const labels: Array<any> = [];
    const tooltip: Array<any> = [];
    const ct = Total.counters;
    Object.keys(ct).forEach((key: any, index: any) => {
      segments.push({
        color: colorCode[key].color,
        tooltip: `${key} (${ct[key]})`,
        value: ct[key],
      });
      if (requiredLabels?.includes(key)) {
        labels.push(
          <tr key={"" + index + Math.random()}>
            <td>
              <span className={classess.machine_summary_label}>{key}</span>
            </td>
            <td
              className={`u-align--right ${classess.machine_summary_legend_value}`}
            >
              {ct[key]}
              <span className="u-nudge-right--small">
                <i className={`p-circle--${colorCode[key].link}`}></i>
              </span>
            </td>
          </tr>
        );
      } else {
        tooltip.push(<li key={`${key}`}>{`${key} (${ct[key]})`}</li>);
      }
    });
    labels.push(
      <tr key={"" + Math.random()} className={classess.machine_summary_others}>
        <td className={classess.machine_summary_others_td}>
          <span className={classess.machine_summary_label}>
            Others
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
    setSegments(segments);
    setLabels(labels);
    setTotal(Total.total);
  };

  return (
    <>
      <div>
        <div className="dspie-chart-body-small" style={{ marginLeft: 65 }}>
          <DoughnutChart
            label={total}
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
