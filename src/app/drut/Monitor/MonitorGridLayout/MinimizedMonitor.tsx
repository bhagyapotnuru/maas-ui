import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import IconButton from "@mui/material/IconButton";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.css";

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  onMaximizeWidget: (value: number) => void;
};

const MinimizedMonitor = ({
  configData,
  onMaximizeWidget,
}: Props): JSX.Element => {
  const configDataObj = configData as MonitorConfiguration[];

  return (
    <div className={classess["tab-container"]}>
      <ul className={`${classess.tabs} ${classess.clearfix}`}>
        {(configDataObj as MonitorConfiguration[]).map(
          (config: MonitorConfiguration) => (
            <li>
              <CustomizedTooltip
                className={classess.minimized_config_header}
                title={config.header}
              >
                <span key={config.id}>{config.header}</span>
              </CustomizedTooltip>
              <CustomizedTooltip title={`Maximize`}>
                <IconButton
                  aria-label="open_new"
                  className={classess.minimized_header_icon}
                  onClick={(e) => {
                    e.preventDefault();
                    onMaximizeWidget(+config.id);
                  }}
                >
                  <OpenInFullIcon
                    style={{ fontSize: "0.5em", color: "white" }}
                  />
                </IconButton>
              </CustomizedTooltip>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default MinimizedMonitor;
