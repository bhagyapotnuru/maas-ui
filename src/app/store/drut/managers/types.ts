import type { GenericState } from "app/store/types/state";

export type Manager = {
  id: number;
  manager_type: string;
  zone_id?: string;
  rack_name?: string;
  rack_id?: string;
  rack_fqgn?: string;
  ip_address?: string;
  description?: string;
  port?: string;
  user_name?: string;
  password?: string;
  name: string;
  protocol?: string;
  manufacturer?: string;
  remote_redfish_uri?: string;
  checked?: boolean;
  port_count?: number;
  discovery_status: string;
};

export type Rack = {
  rack_id: number;
  rack_name: string;
  rack_fqgn?: string;
  managers?: RackManager[];
};

export type RackByType = {
  ific: Rack[];
  tfic: Rack[];
};

export type Zone = {
  zone_id: number;
  zone_name: string;
  zone_fqgn?: string;
  racks: Rack[];
};

export type ZoneObj = {
  zone_id: number;
  zone_name: string;
  zone_fqgn?: string;
  racks: RackByType;
};

export type RackManager = {
  uuid: string;
  fqnn: string;
  name: string;
  free_resources?: Resources;
  resources?: Resources;
};

export type Resources = {
  network: number;
  storage: number;
  computersystem: number;
  processor: number;
};

export type ManagersState = {
  searchText: string;
  prev: number;
  next: number;
  pageSize: string;
  formLoading: boolean;
  clearHeader: boolean;
  unassignedManagers: Manager[];
  isUnassigned: boolean;
  selectedIds: number[];
  zones: Zone[];
  fetchManagers: boolean;
  isInProgressCallUnassignedManagers: boolean;
  isInProgressCallManagers: boolean;
  filterType: string;
  selectedItem: string;
  count: number;
  redfishurlEdit: boolean;
} & GenericState<Manager, string | null>;

export type FetchManagersByQueryPayload = {
  params: string;
  signal?: AbortSignal;
};

export type CreateOrUpdateManagerPayload = {
  params: any;
  data: any;
  isUpdateOperation: boolean;
};

export enum ManagersMeta {
  MODEL = "Managers",
  PK = "id",
}
