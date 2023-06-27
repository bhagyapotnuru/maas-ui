export type Resources = { id: string };

const urls = {
  fabricManagement: {
    index: "/drut-cdi/groups",
    managers: {
      index: "/drut-cdi/managers",
    },
    connectivityManagement: {
      index: "/drut-cdi/connectivity-management",
    },
    unassignedManagers: {
      index: "/drut-cdi/unassigned-managers",
    },
    userZoneMap: {
      index: "/drut-cdi/user-zone-mapping",
    },
  },
};

export default urls;
