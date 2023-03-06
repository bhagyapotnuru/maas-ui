export interface ResourceBlockInfo {
  Id: string;
  Name: string;
  ResourceBlockType: string[];
  Status: ChassisStatus;
  CompositionStatus: CompositionStatus;
  Count: Count;
  Summary: Summary;
  ComputerSystems: ComputerSystem[];
  Chassis: Chassis;
  Manager: Manager;
  FabricInfo: FabricInfo[];
  NodeId: string;
  NodeName: string;
  MachineId: null;
  MachineName: null;
}

export interface Chassis {
  Id: string;
  Name: string;
  ChassisType: string;
  Model: string;
  Status: ChassisStatus;
  ManagerId: string;
}

export interface ChassisStatus {
  Health: string;
  HealthRollup: null | string;
  State: string;
}

export interface CompositionStatus {
  Reserved: boolean;
  CompositionState: string;
  SharingCapable: boolean;
  MaxCompositions: number;
  NumberOfCompositions: number;
}

export interface ComputerSystem {
  Id: string;
  UUID: string;
  Name: string;
  SystemType: string;
  Manufacturer: string;
  Model: string;
  SKU: string;
  SerialNumber: string;
  PartNumber: string;
  AssetTag: string;
  ProcessorSummary: ProcessorSummary;
  MemorySummary: MemorySummary;
  Status: ChassisStatus;
  Endpoint: Endpoint;
}

export interface Endpoint {
  Id: string;
  Name: string;
  Description: string;
  ConnectedEntities: ConnectedEntity[];
  EndpointProtocol: string;
  Status: EndpointStatus;
  SwitchId: string;
  PortId: string;
}

export interface ConnectedEntity {
  EntityPciId: null;
  EntityRole: string;
  EntityType: string;
  Identifiers: Identifier[];
}

export interface Identifier {
  DurableName: string;
  DurableNameFormat: string;
}

export interface EndpointStatus {
  Health: string;
  State: string;
}

export interface MemorySummary {
  Status: ChassisStatus;
  TotalSystemMemoryGiB: number;
}

export interface ProcessorSummary {
  Count: number;
  Model: string;
  Status: ChassisStatus;
  TotalCores: number;
  TotalThreads: number;
}

export interface Count {
  Processors: number;
  Memory: number;
  Drives: number;
  NetworkInterfaces: number;
  Storage: number;
  ComputerSystems: number;
  Compute: number;
}

export interface FabricInfo {
  Id: string;
  Description: string;
  FirmwareVersion: null;
  IsManaged: boolean;
  Model: null;
  Name: string;
  Status: EndpointStatus;
  SwitchType: string;
  TotalSwitchWidth: number;
  UUID: string;
  DownstreamPorts: number;
  Ports: Port[];
  Fqnn: string;
}

export interface Port {
  Id: string;
  ActiveWidth: number;
  CurrentSpeedGbps: number;
  InterfaceEnabled: boolean;
  LinkState: string;
  LinkStatus: string;
  PortMedium: string;
  PortProtocol: string;
  PortType: string;
  PortWidth: null;
  OxcInfo?: OxcInfo[];
}

export interface OxcInfo {
  Name: string;
  TxPortId: string;
  RxPortId: string;
}

export interface Manager {
  Id: string;
  Name: string;
  Status: ChassisStatus;
  RemoteRedfishServiceUri: string;
  FirmwareVersion: string;
  ManagerType: string;
  Manufacturer: string;
  Model: string;
  PowerState: string;
  UUID: string;
  Fqnn: string;
}

export interface Summary {
  ComputerSystems: ComputerSystems;
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
