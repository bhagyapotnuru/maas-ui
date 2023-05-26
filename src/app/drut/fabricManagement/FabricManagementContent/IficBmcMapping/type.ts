export type IficBmc = {
  IFIC: {
    remote_redfish_uri?: string;
    ip_address?: string;
    port?: string;
    name?: string;
    fqnn?: string;
  };
  BMC: {
    remote_redfish_uri?: string;
    ip_address?: string;
    port?: string;
    name?: string;
    fqnn?: string;
  };
};
