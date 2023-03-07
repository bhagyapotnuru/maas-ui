import MachineSummary from "../MachineSummary/MachineSummary";
import WidgetHeader from "../MonitorWidgetHeader/MonitorWidgetHeader";
import ShellInABoxWidget from "../ShellInABoxWidget/ShellInABoxWidget";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.css";

type Props = {
  resizedWidget: MonitorConfiguration | undefined;
  configData: MonitorConfiguration;
  onRemoveWidget: (value: number) => void;
  onMinimizeWidget: (value: number) => void;
  onPinWidgetHandler: (value: number) => void;
};

const renderGridItem = ({
  configData,
  onRemoveWidget,
  onMinimizeWidget,
  onPinWidgetHandler,
  resizedWidget,
}: Props): JSX.Element => {
  switch (configData.cluster_type) {
    case "Maas":
      return (
        <MachineSummary
          configData={configData}
          onMinimizeWidget={onMinimizeWidget}
          onPinWidgetHandler={onPinWidgetHandler}
          onRemoveWidget={onRemoveWidget}
        />
      );
    case "Ceph":
    case "Kubernetes":
    case "OpenStack":
    case "Others":
      return (
        <ShellInABoxWidget
          configData={configData}
          onMinimizeWidget={onMinimizeWidget}
          onPinWidgetHandler={onPinWidgetHandler}
          onRemoveWidget={onRemoveWidget}
          resizedWidget={resizedWidget}
        />
      );
    default:
      return (
        <>
          <WidgetHeader
            configData={configData}
            onMinimizeWidget={onMinimizeWidget}
            onPinWidgetHandler={onPinWidgetHandler}
            onRemoveWidget={onRemoveWidget}
          />
          <div className={classess.widget_iframe}>
            <iframe src={configData.url} />
          </div>
        </>
      );
  }
};

const MonitorGridItem = (props: Props): JSX.Element => {
  return <>{renderGridItem(props)}</>;
};
export default MonitorGridItem;
