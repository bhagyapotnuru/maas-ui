import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import IconButton from "@mui/material/IconButton";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

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
        <a target="_blank" href={configData.url}>
          <span className="app-name">{configData?.header}&nbsp;›</span>
        </a>
      </div>
      <div className="actions-container">
        <CustomizedTooltip title={isPinned ? `Unpin` : `Pin`}>
          <IconButton
            className={`${classess.monitor_pin_icon}`}
            aria-label="open_new"
            color="error"
            type="button"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPinWidgetHandler(+configData.id);
            }}
          >
            {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </IconButton>
        </CustomizedTooltip>
        <CustomizedTooltip title={`Minimize`}>
          <IconButton
            className={`${classess.monitor_minimize_icon}`}
            aria-label="open_new"
            color="primary"
            type="button"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMinimizeWidget(+configData.id);
            }}
          >
            <CloseFullscreenIcon />
          </IconButton>
        </CustomizedTooltip>
        <CustomizedTooltip title={`Close`}>
          <IconButton
            className={`${classess.monitor_close_icon}`}
            aria-label="open_new"
            color="error"
            type="button"
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveWidget(+configData.id);
            }}
          >
            <CloseIcon />
          </IconButton>
        </CustomizedTooltip>
      </div>
    </div>
  );
};

export default WidgetHeader;
