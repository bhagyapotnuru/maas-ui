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
};
