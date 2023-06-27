import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import IconButton from "@mui/material/IconButton";
import { NavLink } from "react-router-dom";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import ZoneAccordion from "./ZoneAccordion";

import type { Manager, Zone } from "app/store/drut/managers/types";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration;
  managerData?: Manager[];
  zoneRackPairs?: Zone[];
  onMinimizeWidget: (value: number) => void;
};

const ManagerSummary = ({
  configData,
  managerData,
  zoneRackPairs,
  onMinimizeWidget,
}: Props): JSX.Element => {
  const configDataObj = configData as MonitorConfiguration;

  return (
    <>
      <div
        style={{
          margin: "auto",
          borderRadius: 10,
          border: "1px solid #e7f1ee",
          background: "#e9ecef",
          width: 1200,
        }}
      >
        <div className="window-header" key={configDataObj?.id}>
          <div className="logo-container">
            <div>
              <span className="app-name">
                <NavLink to={"/drut-cdi/managers"}>
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
        <div
          style={{
            width: 1200,
          }}
        >
          <div
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 20,
              marginBottom: 20,
              width: 1160,
            }}
          >
            {zoneRackPairs?.map((zone: Zone, index: number) => {
              if (zone.racks.length) {
                return (
                  <ZoneAccordion
                    managerData={
                      managerData?.filter(
                        ({ zone_id }) => +zone.zone_id === +(zone_id || "0")
                      ) || ([] as Manager[])
                    }
                    zone={zone}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerSummary;
