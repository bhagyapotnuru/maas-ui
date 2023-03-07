import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import IconButton from "@mui/material/IconButton";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.css";

type Props = {
  configData: MonitorConfiguration;
  onRemoveWidget: (value: number) => void;
  onMinimizeWidget: (value: number) => void;
  onPinWidgetHandler: (value: number) => void;
};

const WidgetHeader = ({
  configData,
  onRemoveWidget,
  onMinimizeWidget,
  onPinWidgetHandler,
}: Props): JSX.Element => {
  const isPinned = configData.pinned;
  return (
    <div className="window-header" key={configData?.id}>
      <div className="logo-container">
        <a href={configData.url} rel="noreferrer" target="_blank">
          <span className="app-name">{configData?.header}&nbsp;›</span>
        </a>
      </div>
      <div className="actions-container">
        <CustomizedTooltip title={isPinned ? `Unpin` : `Pin`}>
          <IconButton
            aria-label="open_new"
            className={`${classess.monitor_pin_icon}`}
            color="error"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPinWidgetHandler(+configData.id);
            }}
            type="button"
          >
            {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </IconButton>
        </CustomizedTooltip>
        <CustomizedTooltip title={`Minimize`}>
          <IconButton
            aria-label="open_new"
            className={`${classess.monitor_minimize_icon}`}
            color="primary"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMinimizeWidget(+configData.id);
            }}
            type="button"
          >
            <CloseFullscreenIcon />
          </IconButton>
        </CustomizedTooltip>
        <CustomizedTooltip title={`Close`}>
          <IconButton
            aria-label="open_new"
            className={`${classess.monitor_close_icon}`}
            color="error"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveWidget(+configData.id);
            }}
            type="button"
          >
            <CloseIcon />
          </IconButton>
        </CustomizedTooltip>
      </div>
    </div>
  );
};

export default WidgetHeader;
