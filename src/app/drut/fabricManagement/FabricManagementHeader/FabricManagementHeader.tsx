import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import managersUrl from "../url";

import SectionHeader from "app/base/components/SectionHeader";
import authSelectors from "app/store/auth/selectors";

type Props = {
  tag?: string;
  title?: string;
  buttonContent?: JSX.Element[] | null;
  headerContent?: JSX.Element | null;
  subtitle?: React.ReactNode;
};

const FabricManagementHeader = ({
  title,
  buttonContent,
  headerContent,
  subtitle,
}: Props): JSX.Element => {
  const location = useLocation();
  const isAdmin = useSelector(authSelectors.isAdmin);

  const tabs = [
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
    {
      active: location.pathname.startsWith(managersUrl.fabricManagement.index),
      component: Link,
      label: "Groups",
      to: managersUrl.fabricManagement.index,
    },
  ];

  const zoneRoute = {
    active: location.pathname.startsWith(
      managersUrl.fabricManagement.userZoneMap.index
    ),
    component: Link,
    label: "User Zone Mapping",
    to: managersUrl.fabricManagement.userZoneMap.index,
  };

  if (isAdmin) {
    console.log(zoneRoute.label);
    // tabs.push(zoneRoute);
  }

  return (
    <SectionHeader
      key="ManagersHeader"
      headerContent={headerContent}
      buttons={buttonContent}
      title={title}
      tabLinks={tabs}
      subtitle={subtitle}
    />
  );
};

export default FabricManagementHeader;
