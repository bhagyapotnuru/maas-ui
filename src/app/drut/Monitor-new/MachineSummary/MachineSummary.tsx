import { useEffect, useState } from "react";

import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import IconButton from "@mui/material/IconButton";
import { NavLink } from "react-router-dom";

import MachineSummaryPowerType from "../MachineSummary/MachineSummaryPowerType";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  onMinimizeWidget: (value: number) => void;
  machineSummaryResponse: any;
};

const MachineSummary = ({
  configData,
  onMinimizeWidget,
  machineSummaryResponse,
}: Props): JSX.Element => {
  const configDataObj = configData as MonitorConfiguration;
  const [powerTypes, setPowerTypes] = useState([] as string[]);

  useEffect(() => {
    const powerTypes = Object.keys(machineSummaryResponse);
    setPowerTypes(powerTypes);
  }, [machineSummaryResponse]);

  return (
    <>
      <div
        style={{
          margin: "auto",
          borderRadius: 10,
          border: "1px solid #e7f1ee",
          background: "#e9ecef",
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
        <div className={classes.maximized_monitor_blocks}>
          {powerTypes.map((powerTypeKey: string, index: number) => {
            return (
              <MachineSummaryPowerType
                powerTypeName={powerTypes[index]}
                machineSummaryResponse={
                  machineSummaryResponse[powerTypes[index]]
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MachineSummary;
