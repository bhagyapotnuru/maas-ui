import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

import MonitorConfigurationAction from "./drut/Monitor/ConfigurationAction/ConfigurationAction";
import Monitor from "./drut/Monitor/Monitor";
import ConnectivityManagement from "./drut/fabricManagement/FabricManagementContent/ConnectivityManagement";
import Managers from "./drut/fabricManagement/FabricManagementContent/Managers/Managers";
import UnassignedManagers from "./drut/fabricManagement/FabricManagementContent/UnassignedManagers/UnassignedManagers";
import DrutManageGroups from "./drut/manage/groups";
import DrutManageSession from "./drut/manage/sessions";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import ControllerDetails from "app/controllers/views/ControllerDetails";
import ControllerList from "app/controllers/views/ControllerList";
import Dashboard from "app/dashboard/views/Dashboard";
import DeviceDetails from "app/devices/views/DeviceDetails";
import DeviceList from "app/devices/views/DeviceList";
import DomainDetails from "app/domains/views/DomainDetails";
// eslint-disable-next-line import/order
import DomainsList from "app/domains/views/DomainsList";

// Drut Routes
import monitorDasboardUrls from "app/drut/Monitor/url";
import Compose from "app/drut/compose";
import ComposeNode from "app/drut/compose-node/ComposeNode";
import composeNodeUrls from "app/drut/compose-node/url";
import composeUrls from "app/drut/compose/url";
import DrutDashboard from "app/drut/dashboard";
import drutDashboardUrl from "app/drut/dashboard/url";
import Events from "app/drut/events";
import eventUrl from "app/drut/events/url";
import Groups from "app/drut/fabricManagement/FabricManagementContent/Groups";
import managersUrls from "app/drut/fabricManagement/url";
import DrutHealth from "app/drut/health";
import drutHealthUrl from "app/drut/health/url";
import drutManageUrl from "app/drut/manage/url";
import Node from "app/drut/nodes";
import nodesUrl from "app/drut/nodes/url";
import Resources from "app/drut/resources/View";
import resourceUrls from "app/drut/resources/url";
import ImageList from "app/images/views/ImageList";
import Intro from "app/intro/views/Intro";
import KVM from "app/kvm/views/KVM";
import MachineDetails from "app/machines/views/MachineDetails";
import Machines from "app/machines/views/Machines";
import Pools from "app/pools/views/Pools";
import Preferences from "app/preferences/views/Preferences";
import Settings from "app/settings/views/Settings";
import FabricDetails from "app/subnets/views/FabricDetails";
import SpaceDetails from "app/subnets/views/SpaceDetails";
import SubnetDetails from "app/subnets/views/SubnetDetails";
import SubnetsList from "app/subnets/views/SubnetsList";
import VLANDetails from "app/subnets/views/VLANDetails";
import Tags from "app/tags/views/Tags";
import ZoneDetails from "app/zones/views/ZoneDetails";
import ZonesList from "app/zones/views/ZonesList";

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route element={<Redirect to={urls.machines.index} />} path={urls.index} />
    <Route
      element={
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      }
      path={`${urls.intro.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      }
      path={`${urls.preferences.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ControllerList />
        </ErrorBoundary>
      }
      path={`${urls.controllers.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ControllerDetails />
        </ErrorBoundary>
      }
      path={`${urls.controllers.controller.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceList />
        </ErrorBoundary>
      }
      path={`${urls.devices.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceDetails />
        </ErrorBoundary>
      }
      path={`${urls.devices.device.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DomainsList />
        </ErrorBoundary>
      }
      path={`${urls.domains.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DomainDetails />
        </ErrorBoundary>
      }
      path={`${urls.domains.details(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ImageList />
        </ErrorBoundary>
      }
      path={`${urls.images.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      }
      path={`${urls.kvm.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      }
      path={urls.machines.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      }
      path={`${urls.machines.machine.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Pools />
        </ErrorBoundary>
      }
      path={`${urls.pools.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${urls.tags.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${urls.tags.tag.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      }
      path={`${urls.settings.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetsList />
        </ErrorBoundary>
      }
      path={`${urls.subnets.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <FabricDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.fabric.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SpaceDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.space.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.subnet.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <VLANDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.vlan.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ZonesList />
        </ErrorBoundary>
      }
      path={`${urls.zones.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ZoneDetails />
        </ErrorBoundary>
      }
      path={`${urls.zones.details(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      }
      path={`${urls.dashboard.index}/*`}
    />
    {/* DRUT route config */}
    <Route
      element={
        <ErrorBoundary>
          <Resources />
        </ErrorBoundary>
      }
      path={`${resourceUrls.resources.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Node />
        </ErrorBoundary>
      }
      path={`${nodesUrl.nodes.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DrutManageGroups />
        </ErrorBoundary>
      }
      path={drutManageUrl.manage.groups}
    />
    <Route
      element={
        <ErrorBoundary>
          <DrutManageSession />
        </ErrorBoundary>
      }
      path={drutManageUrl.manage.session}
    />
    <Route
      element={
        <ErrorBoundary>
          <Events />
        </ErrorBoundary>
      }
      path={`${eventUrl.events.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Compose />
        </ErrorBoundary>
      }
      path={composeUrls.compose.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <ComposeNode />
        </ErrorBoundary>
      }
      path={composeNodeUrls.compose.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <Groups />
        </ErrorBoundary>
      }
      path={managersUrls.fabricManagement.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <Managers />
        </ErrorBoundary>
      }
      path={managersUrls.fabricManagement.managers.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <UnassignedManagers />
        </ErrorBoundary>
      }
      path={managersUrls.fabricManagement.unassignedManagers.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <ConnectivityManagement />
        </ErrorBoundary>
      }
      path={managersUrls.fabricManagement.connectivityManagement.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <DrutHealth />
        </ErrorBoundary>
      }
      path={drutHealthUrl.health.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <DrutDashboard />
        </ErrorBoundary>
      }
      path={drutDashboardUrl.dashboard.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <Monitor></Monitor>
        </ErrorBoundary>
      }
      path={`${monitorDasboardUrls.monitorDashboard.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <MonitorConfigurationAction></MonitorConfigurationAction>
        </ErrorBoundary>
      }
      path={`${monitorDasboardUrls.monitorDashboardActions.index}/*`}
    />
    <Route element={<NotFound includeSection />} path="*" />
  </ReactRouterRoutes>
);

export default Routes;
