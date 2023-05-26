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
  mapped_manager: Manager_Details;
};

type Manager_Details = {
  remote_redfish_uri: string;
  ip_address: string;
  port: string;
  name: string;
  fqnn: string;
};

export const getIconByStatus = (status: string): string | undefined => {
  if (status === "COMPLETED") {
    return "p-icon--success";
  } else if (status === "IN_PROGRESS") {
    return "p-icon--status-in-progress";
  } else if (status === "FAILED") {
    return "p-icon--error";
  } else if (status === "PENDING") {
    return "p-icon--status-waiting";
  }
};
