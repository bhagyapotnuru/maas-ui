import type {
  Zone,
  Rack,
  RackManager,
  Manager,
} from "app/store/drut/managers/types";
import type { GenericState } from "app/store/types/state";

export type MonitorConfiguration = {
  id: number;
  url: string;
  cluster_type: string;
  user: string;
  password: string;
  description: string;
  header: string;
  display: boolean;
  resource_uri: string;
  isEditable?: boolean;
  minimize?: boolean;
  gridlayout: any;
  pinned: boolean;
  resourcepool: string;
  apps: MonitorAppTypes[];
  shellinabox_url: string;
  applicationpool: string;
  dashboard_protocol: string;
  dashboard_ipaddress: string;
  dashboard_port: string;
  service_protocol?: string;
  service_ipaddress?: string;
  service_port?: string;
  service_model?: string;
};

export type MonitorAppTypes = {
  appname: string;
  checked: boolean;
  isUserAction: boolean;
};

export type MonitorConfigurationState = GenericState<
  MonitorConfiguration,
  string | null
> & {
  managers: Manager[];
  zones: Zone[];
  machines: any;
  resourceBlock: any;
  clusterTypes: any;
  resourcePools: any;
  applicationPools: any;
};

export enum MonitorConfigurationMeta {
  MODEL = "MonitorConfiguration",
  PK = "id",
}

export type AddMonitorConfiguration = GenericState<
  MonitorConfiguration,
  string | null
>;

export enum AddMonitorConfigurationMeta {
  MODEL = "AddMonitorConfiguration",
  PK = "header",
}

export type { Manager, Rack, RackManager, Zone };
