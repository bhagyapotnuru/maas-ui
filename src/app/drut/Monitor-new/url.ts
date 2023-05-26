import type { MonitorConfiguration } from "./Types/MonitorConfiguration";

import { argPath } from "app/utils/argPath";

const urls = {
  monitorDashboard: {
    index: "/monitor-dashboard",
  },
  monitorDashboardList: {
    index: "/monitor-dashboard/list",
  },
  monitorDashboardActions: {
    index: "/monitor-dashboard/actions/add",
    eventDetails: argPath<{ id: MonitorConfiguration["id"] }>(
      "/monitor-dashboard/actions/edit/:id"
    ),
  },
};

export default urls;
