import { useState } from "react";

import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { NavLink } from "react-router-dom";

import MonitorConfigurationCardContent from "../MonitorConfigurationCardContent/MonitorConfigurationCardContent";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const ConfigCardContent = ({
  id,
  setMaximizedWidget,
  configData,
}: {
  id: number;
  setMaximizedWidget: React.Dispatch<React.SetStateAction<number>>;
  configData: MonitorConfiguration;
}) => {
  const [maximizeButton, setMaximizeButton] = useState(false);

  return (
    <>
      <Card
        key={id}
        sx={{
          minWidth: "18rem",
          width: "18rem",
          height: 300,
          boxShadow: 5,
          minHeight: 300,
          ":hover": {
            boxShadow: 20,
          },
        }}
        onMouseEnter={() => {
          setMaximizeButton(true);
        }}
        onMouseLeave={() => {
          setMaximizeButton(false);
        }}
      >
        <CardContent
          style={{
            height: "-webkit-fill-available",
          }}
        >
          {configData?.cluster_type !== "Maas" ? (
            <div key={configData?.id}>
              <span
                style={{
                  color: "black",
                  fontSize: "1rem",
                  float: "left",
                  fontWeight: 500,
                }}
              >
                <a target="_blank" href={configData?.url} rel="noreferrer">
                  <span>{configData?.header}&nbsp;›</span>
                </a>
              </span>
            </div>
          ) : (
            <div key={configData?.id}>
              <span
                style={{
                  color: "black",
                  fontSize: "1rem",
                  float: "left",
                  fontWeight: 500,
                }}
              >
                <NavLink to={"./Machines"}>{configData?.header}&nbsp;›</NavLink>
              </span>
            </div>
          )}
          {maximizeButton && (
            <>
              <CustomizedTooltip title={`Maximize`}>
                <IconButton
                  style={{
                    color: "black",
                    fontSize: "1rem",
                    float: "right",
                  }}
                  aria-label="open_new"
                  onClick={(e) => {
                    e.preventDefault();
                    setMaximizedWidget(configData?.id);
                  }}
                >
                  <OpenInFullIcon
                    style={{
                      color: "black",
                      fontSize: "1rem",
                      float: "right",
                    }}
                  />
                </IconButton>
              </CustomizedTooltip>
            </>
          )}
          <MonitorConfigurationCardContent configData={configData} />
        </CardContent>
      </Card>
    </>
  );
};

const MonitorDashboardCardContent = ({
  setMaximizedWidget,
  configResponse,
}: {
  setMaximizedWidget: React.Dispatch<React.SetStateAction<number>>;
  configResponse: MonitorConfiguration[];
}): JSX.Element => {
  return (
    <>
      <div className={classes.monitor_blocks}>
        {configResponse
          .filter((config: MonitorConfiguration) => config.display)
          .map((config: MonitorConfiguration, index: number) => {
            return (
              <ConfigCardContent
                id={configResponse[index]?.id}
                setMaximizedWidget={setMaximizedWidget}
                configData={configResponse[index]}
              />
            );
          })}
      </div>
    </>
  );
};

export default MonitorDashboardCardContent;
