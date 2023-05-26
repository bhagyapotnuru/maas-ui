import { useEffect, useState } from "react";

import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import IconButton from "@mui/material/IconButton";
import { NavLink } from "react-router-dom";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import { COLOURS } from "app/base/constants";
import DSMeterChart from "app/drut/dashboard/View/DSMeterChart";
import DSPieChart from "app/drut/dashboard/View/DSPieChart";
import { getParsedSummary } from "app/drut/summaryParser";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  onMinimizeWidget: (value: number) => void;
  resourceBlockSummary: any;
};

const colorCode = {
  Composed: { color: COLOURS.POSITIVE, link: "positive" },
  Failed: { color: COLOURS.NEGATIVE, link: "negative" },
  Unavailable: { color: COLOURS.LINK_FADED, link: "link-faded" },
  Unused: { color: COLOURS.LINK, link: "link" },
};

const ResourceBlockSummary = ({
  configData,
  onMinimizeWidget,
  resourceBlockSummary,
}: Props): JSX.Element => {
  const configDataObj = configData as MonitorConfiguration;
  const [blockStats, setBlockStats] = useState([]);

  const getsChart = (states: any) => {
    const fn: Array<any> = [];
    if (states) {
      let idx = 0;
      states.forEach((elm: any, index: number) => {
        idx++;
        const box = "box" + idx;
        if (idx === 3) {
          idx = 0;
        }

        if (elm.chart === "PIE") {
          fn.push(
            <DSPieChart
              key={`${elm.chart}_${index}_${+Math.random()}`}
              data={elm}
              box={box}
              colorCode={colorCode}
            />
          );
        } else {
          fn.push(
            <DSMeterChart
              key={`${elm.chart}_${index}_${Math.random()}`}
              data={elm}
              box={box}
              colorCode={colorCode}
            />
          );
        }
      });
    }
    return (
      <>
        <div className="overall-dashboard-card">{fn.slice(0, 3)}</div> <hr />
        <div className="overall-dashboard-card">{fn.slice(3, fn.length)}</div>
      </>
    );
  };

  const getClusterSummary = (summary: any) => {
    setBlockStats(getParsedSummary(summary));
  };

  useEffect(() => {
    getClusterSummary(resourceBlockSummary);
  }, [resourceBlockSummary]);

  return (
    <>
      <div
        style={{
          margin: "auto",
          borderRadius: 10,
          border: "1px solid #e7f1ee",
        }}
      >
        <div className="window-header" key={configDataObj?.id}>
          <div className="logo-container">
            <div>
              <span className="app-name">
                <NavLink to={"./machines"}>
                  {configDataObj?.header}&nbsp;›
                </NavLink>
              </span>
            </div>
          </div>
          <div className="actions-container">
            <CustomizedTooltip title={`Minimize`}>
              <IconButton
                className={`${classes.monitor_minimize_icon}`}
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
          </div>
        </div>
        <div>{getsChart(blockStats)}</div>
      </div>
    </>
  );
};

export default ResourceBlockSummary;
