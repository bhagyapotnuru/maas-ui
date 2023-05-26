import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import IconButton from "@mui/material/IconButton";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import { COLOURS } from "app/base/constants";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

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
                title={config.header}
                className={classess.minimized_config_header}
              >
                <span key={config.id}>{config.header}</span>
              </CustomizedTooltip>
              <CustomizedTooltip title={`Maximize`}>
                <IconButton
                  className={classess.minimized_header_icon}
                  aria-label="open_new"
                  onClick={(e) => {
                    e.preventDefault();
                    onMaximizeWidget(+config.id);
                  }}
                >
                  <OpenInFullIcon
                    style={{ fontSize: "0.5em", color: COLOURS.TEXT_WHITE }}
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
