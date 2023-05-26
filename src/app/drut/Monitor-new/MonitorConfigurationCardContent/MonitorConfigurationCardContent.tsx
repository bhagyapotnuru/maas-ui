import { useSelector } from "react-redux";

import CephCard from "../Ceph/CephCard";
import MachineSummaryCard from "../MachineSummary/MachineSummaryCard";
import ManagerSummaryCard from "../ManagerSummary/ManagerSummaryCard";
import ResourceBlockSummaryCard from "../ResourceBlockSummary/ResourceBlockSummaryCard";
import ShellInABoxWidgetCard from "../ShellInABoxWidget/ShellInABoxWidgetCard";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import type { RootState } from "app/store/root/types";

type Props = {
  configData: MonitorConfiguration;
};

const MonitorConfigurationCardContent = (props: Props): JSX.Element => {
  const { managers, machines, resourceBlock } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const renderGridItem = ({ configData }: Props): JSX.Element => {
    switch (configData?.cluster_type) {
      case "Maas":
        return (
          <MachineSummaryCard
            configData={configData}
            machineSummaryResponse={machines}
          />
        );
      case "Resource":
        return (
          <ResourceBlockSummaryCard
            configData={configData}
            resourceBlockSummary={resourceBlock}
          />
        );
      case "Managers":
        return <ManagerSummaryCard managerData={managers} />;
      case "Ceph":
        return <CephCard configData={configData} />;
      case "Kubernetes":
      case "OpenStack":
      case "Others":
        return <ShellInABoxWidgetCard configData={configData} />;
      default:
        return <></>;
    }
  };
  return <>{renderGridItem(props)}</>;
};
export default MonitorConfigurationCardContent;
