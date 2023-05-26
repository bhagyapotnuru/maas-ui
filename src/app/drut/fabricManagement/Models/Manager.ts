export interface Manager {
  [key: string]: OpticalSwitch[] & FicManager[];
}

export interface ManagerFields {
  id: number;
  fqnn: string;
  zone_name: string;
  rack_name: string;
  manager_type: string;
  name: string;
}

//Model for OXC
export interface OpticalSwitch extends ManagerFields {
  freePorts: number;
  usedPorts: number;
  ports: OxcPort[];
}

export interface OxcPort extends TransmitReceiveFields {
  isRemoving?: boolean;
  connectedPcie: ConnectedPcie | null;
}

export interface ConnectedPcie {
  rack_id: number;
  rack_name: string;
  zone_id: number;
  zone_name: string;
  pcie_switch: string;
  pcie_switch_port: string;
  manager_name: string;
  manager_type: string;
  manager_fqnn: string;
  isNewlyAdded?: boolean;
}

//Model for FICs
export interface FicManager extends ManagerFields {
  totalPorts: number;
  freePorts: number;
  switches: PcieSwitch;
}

export interface PcieSwitch {
  [key: string]: PcieSwitchPort;
}

export interface PcieSwitchPort {
  [key: string]: PcieSwitchPortFields;
}

export interface PcieSwitchPortFields extends TransmitReceiveFields {
  isRemoving: boolean;
  optical_switch: ConnectedOpticalSwitch;
}

export interface ConnectedOpticalSwitch {
  name: string;
  rack_name: string;
  zone_name: string;
  fqnn: string;
}

export interface TransmitReceiveFields {
  tx: string;
  rx: string;
}

/** Oxc Connectivity Management port options model */
export interface OxcPortOption {
  title: string;
  tx: string;
  rx: string;
  port: string;
  optionLable: string;
  fqnn: string;
}

export interface UpdateConnectivity {
  oxcId: string;
  ports: connectivityPorts[];
}

export interface connectivityPorts extends TransmitReceiveFields {
  switchId: string;
  switchPort: string | undefined;
}
