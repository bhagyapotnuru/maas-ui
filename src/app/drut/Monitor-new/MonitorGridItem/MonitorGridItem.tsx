import { useSelector } from "react-redux";

import Ceph from "../Ceph/Ceph";
import MachineSummary from "../MachineSummary/MachineSummary";
import ManagerSummary from "../ManagerSummary/ManagerSummary";
import ResourceBlockSummary from "../ResourceBlockSummary/ResourceBlockSummary";
import ShellInABoxWidget from "../ShellInABoxWidget/ShellInABoxWidget";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import type { RootState } from "app/store/root/types";

type Props = {
  configData: MonitorConfiguration;
  onMinimizeWidget: (value: number) => void;
};

const MonitorGridItem = (props: Props): JSX.Element => {
  const { managers, machines, resourceBlock, zones } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const renderGridItem = ({
    configData,
    onMinimizeWidget,
  }: Props): JSX.Element => {
    switch (configData.cluster_type) {
      case "Maas":
        return (
          <MachineSummary
            configData={configData}
            onMinimizeWidget={onMinimizeWidget}
            machineSummaryResponse={machines}
          />
        );
      case "Resource":
        return (
          <ResourceBlockSummary
            configData={configData}
            onMinimizeWidget={onMinimizeWidget}
            resourceBlockSummary={resourceBlock}
          />
        );
      case "Managers":
        return (
          <ManagerSummary
            onMinimizeWidget={onMinimizeWidget}
            zoneRackPairs={zones}
            managerData={managers}
            configData={configData}
          />
        );
      case "Ceph":
        return (
          <Ceph configData={configData} onMinimizeWidget={onMinimizeWidget} />
        );
      case "Kubernetes":
      case "OpenStack":
      case "Others":
        return (
          <ShellInABoxWidget
            configData={configData}
            onMinimizeWidget={onMinimizeWidget}
          />
        );
      default:
        return <></>;
    }
  };
  return <>{renderGridItem(props)}</>;
};
export default MonitorGridItem;
