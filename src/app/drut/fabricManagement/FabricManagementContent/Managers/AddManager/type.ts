export type Manager = {
  id?: number;
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
  racks: Rack[] | RackByType;
};

export type RackManager = {
  uuid: string;
  fqnn: string;
  name: string;
};
