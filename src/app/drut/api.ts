import { fetchData, postData, deleteData } from "./config";

const uz = "dfab/user-zones/";

export const fetchUsersAndZones = (abort: any = null): Promise<any> =>
  fetchData(uz, false, abort);

export const removeZones = (data: any = null): Promise<any> =>
  postData(`${uz}?op=remove_zones`, data);

export const fetchCanBeAddedZones = (
  userId: number,
  abort: any = null
): Promise<any> =>
  fetchData(`${uz}?op=get_zones&user_id=${userId}`, false, abort);

export const updateUserZones = (data: any = null): Promise<any> =>
  postData(uz, data);

export const fetchZoneByUserId = (
  userId: number,
  abort: any = null
): Promise<any> => fetchData(`${uz}${userId}/`, false, abort);

export const setDefaultZone = (data: any = null): Promise<any> =>
  postData(`${uz}?op=set_active_zone`, data);

export const resetNode = (Id: string, data: any = null): Promise<any> =>
  postData(`dfab/nodes/${Id}/?op=reset`, data);
export const fetchMonitorConfigurationList = (
  abort: any = null
): Promise<any> => fetchData(`dfab/clusters/`, false, abort);

export const setMonitorConfigurations = (payload: any = null): Promise<any> =>
  postData(`dfab/clusters/`, payload, true);

export const setDisplayForMonitorConfigurations = (
  payload: any = null
): Promise<any> => postData(`dfab/clusters/?op=set_display`, payload);

export const createOrUpdateMonitorConfigurations = (
  url: string,
  payload: any = null,
  isPutOperation: boolean
): Promise<any> => postData(url, payload, isPutOperation);

export const deleteMonitorConfig = (id: any = null): Promise<any> =>
  deleteData(`dfab/clusters/${id}/`);

export const fetchManagersData = (abort: any = null): Promise<any> =>
  fetchData(`dfab/managers/`, false, abort);

export const fetchZonesData = (abort: any = null): Promise<any> =>
  fetchData("dfab/nodegroups/?op=get_zones", false, abort);

export const fetchMachineSummaryData = (abort: any = null): Promise<any> =>
  fetchData(`dfab/summary/?op=get_machine`, false, abort);

export const fetchSummaryData = (abort: any = null): Promise<any> =>
  fetchData("dfab/summary/", false, abort);

export const fetchClusterTypesData = (abort: any = null): Promise<any> =>
  fetchData("dfab/clusters/?op=get_types", false, abort);

export const fetchResourcePoolsData = (abort: any = null): Promise<any> =>
  fetchData("resourcepools/", false, abort);

export const fetchApplicationPoolsData = (abort: any = null): Promise<any> =>
  fetchData("dfab/applicationpools/", false, abort);
