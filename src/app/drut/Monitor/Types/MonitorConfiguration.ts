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
};

export type MonitorAppTypes = {
  appname: string;
  checked: boolean;
  isUserAction: boolean;
};
