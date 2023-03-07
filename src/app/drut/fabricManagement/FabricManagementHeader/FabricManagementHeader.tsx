import SectionHeader from "app/base/components/SectionHeader";
import { Link, useLocation } from "react-router-dom";

import managersUrl from "../url";

type Props = {
  tag?: string;
  title?: string;
  buttonContent?: JSX.Element[] | null;
  headerContent?: JSX.Element | null;
};

const FabricManagementHeader = ({
  title,
  buttonContent,
}: // headerContent,
Props): JSX.Element => {
  const location = useLocation();

  const tabs = [
    {
      active: location.pathname.startsWith(managersUrl.fabricManagement.index),
      component: Link,
      label: "Groups",
      to: managersUrl.fabricManagement.index,
    },
    {
      active: location.pathname.startsWith(
        managersUrl.fabricManagement.managers.index
      ),
      component: Link,
      label: "Managers",
      to: managersUrl.fabricManagement.managers.index,
    },
    {
      active: location.pathname.startsWith(
        managersUrl.fabricManagement.connectivityManagement.index
      ),
      component: Link,
      label: "Peer Connections",
      to: managersUrl.fabricManagement.connectivityManagement.index,
    },
  ];

  return (
    <SectionHeader
      buttons={buttonContent}
      // headerContent={headerContent}
      key="ManagersHeader"
      tabLinks={tabs}
      title={title}
    />
  );
};

export default FabricManagementHeader;
