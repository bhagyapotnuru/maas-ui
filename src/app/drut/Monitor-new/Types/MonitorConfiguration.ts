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

export type AddMonitorConfiguration = {
  cluster_type: string;
  user: string;
  password: string;
  description: string;
  header: string;
  resourcepool: string;
  gridlayout?: any;
  display: boolean;
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
