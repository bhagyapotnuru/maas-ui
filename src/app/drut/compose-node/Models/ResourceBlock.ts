export interface ResourceBlock {
  Name: string;
  Links: Links;
}

export interface Links {
  "Members@odata.count": number;
  Members: Member[];
}

export interface Member {
  Id: string;
  Name: string;
  blockType: BlockType;
  ResourceBlockType: string[];
  Status: MemberStatus;
  CompositionStatus: CompositionStatus;
  Summary: Summary;
  Count: number;
  Description: Description[];
  Chassis: Chassis;
  Manager: Manager;
  FabricInfo: Array<FabricInfo | null>;
  NodeId: null;
  NodeName: null;
  MachineId: null;
  MachineName: null;
  ComputerSystems?: ComputerSystem[];
  checked: boolean;
  capacity: string[];
  info: string[];
}

export interface BlockType {
  title: string;
  short: string;
}

export interface Chassis {
  Id: string;
  Name: string;
}

export interface CompositionStatus {
  Reserved: boolean;
  CompositionState: CompositionState;
  SharingCapable: boolean;
  MaxCompositions: number;
  NumberOfCompositions: number;
}

export enum CompositionState {
  UNUSED = "Unused",
  COMPOSED = "Composed",
  COMPOSED_AND_AVAILABLE = "ComposedAndAvailable",
  COMPOSING = "Composing",
  FAILED = "Failed",
  UNAVAILABLE = "Unavailable",
}

export interface ComputerSystem {
  UUID: string;
}

export interface Description {
  ResourceBlockType: string;
  Manufacturer: string;
  Model: string;
}

export interface Compute {
  Manufacturer: string;
  Model: string;
  SerialNumber: null | string;
  PartNumber: null | string;
}

export interface FabricInfo {
  Id: string;
  DownstreamPorts: number;
  Model: null;
  Status: FabricInfoStatus;
  Fqnn: string;
  Name: string;
  Ports: Port[];
}

export interface Port {
  Id: string;
  PortType: PortType;
}

export enum PortType {
  DownstreamPort = "DownstreamPort",
  UpstreamPort = "UpstreamPort",
}

export interface FabricInfoStatus {
  Health: Health;
  State: State;
}

export enum Health {
  Ok = "OK",
  WARNING = "Warning",
  CRITICAL = "Critical",
}

export enum State {
  Enabled = "Enabled",
  DISABLED = "Disabled",
  UNAVAILABLE_OFFLINE = "UnavailableOffline",
  STANDBY_OFFLINE = "StandbyOffline",
  STANDBY_SPARE = "StandbySpare",
  IN_TEST = "InTest",
  STARTING = "Starting",
  ABSENT = "Absent",
  QUIESCED = "QUIESCED",
}

export interface Manager {
  Id: string;
  Name: string;
  Fqnn: null | string;
  ManagerNodeName: string;
  RackName: string;
}

export interface MemberStatus {
  State: State;
  Health: Health;
  HealthRollup: null;
}

export interface Summary {
  Processors?: Processors; //offload
  ComputerSystems?: ComputerSystems; //Compute DPU
  Storage?: StorageSummary; //Network and Storage or Only Storage
  NetworkInterfaces: NetworkInterfaceSummary; //Network
}

export interface NetworkInterfaceSummary {
  MaxSpeedGbps: number;
  DrivesCount: number;
}

export interface StorageSummary {
  CapacityGigaBytes: number;
  DrivesCount: number;
}

export interface ComputerSystems {
  Processor: Processor;
  Memory: Memory;
}

export interface Memory {
  TotalSystemMemoryGiB: number;
}

export interface Processor {
  Count: number;
  TotalCores: number;
  TotalThreads: number;
}

export interface Processors {
  MaxSpeedMHz: number;
  TotalCores: number;
  TotalThreads: number;
  Count: number;
}

export interface RBTypeResp {
  [key: string]: Member[];
}
