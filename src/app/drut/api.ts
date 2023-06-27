import {
  fetchData,
  postData,
  deleteData,
  uploadFile,
  deleteManager,
} from "./config";

const user_zones = "dfab/user-zones/";
const monitor = "dfab/clusters/";
const node_groups = "dfab/nodegroups/";
const managers = "dfab/managers/";
const nodes = "dfab/nodes/";
const summary = "dfab/summary/";
const fabric = "dfab/fabrics/";
const connectivity = "dfab/connectivity/";
const events = "dfab/events/";
const resource_blocks = "dfab/resourceblocks/";
const user_sessions = "dfab/user-sessions/";

// User-Zones

export const fetchUsersAndZones = (abort: any = null): Promise<any> =>
  fetchData(user_zones, abort);

export const removeZones = (data: any = null): Promise<any> =>
  postData(`${user_zones}?op=remove_zones`, data);

export const fetchCanBeAddedZones = (
  userId: number,
  abort: any = null
): Promise<any> =>
  fetchData(`${user_zones}?op=get_zones&user_id=${userId}`, abort);

export const updateUserZones = (data: any = null): Promise<any> =>
  postData(user_zones, data);

export const fetchZoneByUserId = (
  userId: number,
  abort: any = null
): Promise<any> => fetchData(`${user_zones}${userId}/`, abort);

export const setDefaultZone = (data: any = null): Promise<any> =>
  postData(`${user_zones}?op=set_active_zone`, data);

// Monitor

export const fetchMonitorConfigurationList = (
  abort: any = null
): Promise<any> => fetchData(monitor, abort);

export const fetchMonitorDataById = (
  id: any = null,
  abort: any = null
): Promise<any> => fetchData(`${monitor}${id}/`, abort);

export const fetchClusterTypesData = (abort: any = null): Promise<any> =>
  fetchData(`${monitor}?op=get_types`, abort);

export const createOrUpdateMonitorConfigurations = (
  params: string,
  payload: any = null,
  isPutOperation: boolean
): Promise<any> => postData(`${monitor}${params}`, payload, isPutOperation);

export const deleteMonitorConfig = (id: any = null): Promise<any> =>
  deleteData(`${monitor}${id}/`);

export const setMonitorConfigurations = (payload: any = null): Promise<any> =>
  postData(monitor, payload, true);

export const setDisplayForMonitorConfigurations = (
  payload: any = null
): Promise<any> => postData(`${monitor}?op=set_display`, payload);

export const updateGridLayoutForMonitorConfigs = (
  data: any = null
): Promise<any> => postData(`${monitor}?op=set_gridlayout`, data);

export const fetchApplicationPoolsData = (abort: any = null): Promise<any> =>
  fetchData("dfab/applicationpools/", abort);

export const updateApplicationPoolConfiguration = (
  data: any = null
): Promise<any> => postData(`dfab/applicationpools/`, data);

// Node-groups

export const fetchGroupsData = (abort: any = null): Promise<any> =>
  fetchData(node_groups, abort);

export const fetchZoneRacksDataByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`${node_groups}?${params}`, abort);

export const createOrUpdateNodeGroup = (
  params: any = null,
  data: any = null,
  isUpdateOperation = false
): Promise<any> => postData(`${node_groups}${params}`, data, isUpdateOperation);

export const deleteNodeGroup = (
  id: any = null,
  name: any = null
): Promise<any> => deleteData(`${node_groups}${id}/?name=${name}`);

// Managers

export const fetchManagersData = (abort: any = null): Promise<any> =>
  fetchData(managers, abort);

export const fetchManagersDataByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`${managers}?${params}`, abort);

export const fetchIficBmcData = (abort: any = null): Promise<any> =>
  fetchData(`${managers}?op=get_ific_bmc_map`, abort);

export const createOrUpdateManagers = (
  params: any = null,
  data: any = null,
  isUpdateOperation = false
): Promise<any> => postData(`${managers}${params}`, data, isUpdateOperation);

export const deleteManagerData = (
  id: any = null,
  isForceDelete = false
): Promise<any> =>
  deleteManager(`${managers}${id}/?ForceDelete=${isForceDelete}`);

export const crawlManagerBydata = (selectedManager: any = null): Promise<any> =>
  postData(`${managers}${selectedManager}/?op=crawl_manager`);

// Node

export const fetchNodeDataPathData = (abort: any = null): Promise<any> =>
  fetchData(`${nodes}?op=get_data_path`, abort);

export const fetchDashboardNodeData = (abort: any = null): Promise<any> =>
  fetchData(nodes, abort);

export const fetchFabricsNodeData = (
  id: any = null,
  abort: any = null
): Promise<any> => fetchData(`${nodes}${id}/`, abort);

export const fetchNodeDataPath = (
  id: any = null,
  abort: any = null
): Promise<any> => fetchData(`${nodes}${id}/?op=get_data_path`, abort);

export const fetchDataPathOrdersByNodeId = (
  nodeId: any = null,
  abort: any = null
): Promise<any> =>
  fetchData(`${nodes}${nodeId}/?op=get_target_end_point_order_list`, abort);

export const resetNodeById = (Id: string, data: any = null): Promise<any> =>
  postData(`${nodes}${Id}/?op=reset`, data);

export const saveNodeComposition = (data: any = null): Promise<any> =>
  postData(nodes, data);

export const saveNodeCompositionByQuery = (
  data: any = null,
  params: any = null
): Promise<any> => postData(`${nodes}${params}`, data);

export const updateNodeCacheById = (id: any = null): Promise<any> =>
  postData(`${nodes}${id}/?op=update_node_cache`);

export const deleteNodeById = (id: any = null): Promise<any> =>
  deleteData(`${nodes}${id}/`);

// Summary

export const fetchMachineSummaryData = (abort: any = null): Promise<any> =>
  fetchData(`${summary}?op=get_machine`, abort);

export const fetchSummaryData = (abort: any = null): Promise<any> =>
  fetchData(summary, abort);

export const fetchMachineDataByResourcePool = (
  resourcepool: any = null,
  abort: any = null
): Promise<any> =>
  fetchData(`${summary}?op=get_resourcepool&PoolName=${resourcepool}`, abort);

// Fabric

export const fetchFabricData = (abort: any = null): Promise<any> =>
  fetchData(fabric, abort);

export const fetchFabricDataById = (
  id: any = null,
  abort: any = null
): Promise<any> => fetchData(`${fabric}${id}/?op=get_statistics`, abort);

export const createOrUpdateFabricData = (
  params: any = null,
  data: any = null,
  isUpdateOperation = false
): Promise<any> => postData(`${fabric}${params}`, data, isUpdateOperation);

export const deleteFabricConfigById = (id: any = null): Promise<any> =>
  deleteData(`${fabric}${id}/`);

// Connectivity

export const fetchConnectivityDataByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`${connectivity}?${params}`, abort);

export const updateConnectivityData = (data: any = null): Promise<any> =>
  postData(connectivity, data);

export const deletePeerConnections = (data: any = null): Promise<any> =>
  postData(`${connectivity}?op=delete_peer_connections`, data);

export const uploadCsv = (data: any = null): Promise<any> =>
  uploadFile(`${connectivity}?op=import_csv`, data);

export const fetchTxRxData = (
  sw: any = null,
  port: any = null,
  abort: any = null
): Promise<any> =>
  fetchData(`dfab/opticalmodule/?switch=${sw}&port=${port}`, abort);

// Events

export const fetchEventDataByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`${events}${params}`, abort);

// Resource-Blocks

export const fetchResourceBlocksByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`${resource_blocks}${params}`, abort);

export const fetchResourceBlocksById = (
  rbId: any = null,
  abort: any = null
): Promise<any> => fetchData(`${resource_blocks}${rbId}/`, abort);

export const attachDetachResourceBlockById = (
  id: any = null,
  data: any = null
): Promise<any> => postData(`${resource_blocks}${id}/`, data, false);

// User-sessions

export const deleteUserSession = (key: any = null): Promise<any> =>
  deleteData(`${user_sessions}${key}/`);

export const fetchSessionData = (abort: any = null): Promise<any> =>
  fetchData(user_sessions, abort);

// Machines

export const fetchResourcePoolsData = (abort: any = null): Promise<any> =>
  fetchData("resourcepools/", abort);

export const fetchMachinePowerConfigurations = (
  abort: any = null
): Promise<any> => fetchData(`machines/?op=get_power_parameters`, abort);

export const fetchDateTime = (): Promise<any> => fetchData("dfab/timezone/");

export const fetchOpticalPowerValuesByQuery = (
  params: any = null,
  abort: any = null
): Promise<any> => fetchData(`dfab/opticalmodule/?${params}`, abort);
