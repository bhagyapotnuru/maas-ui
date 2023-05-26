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
  ResourceBlockType: string[];
  Status: MemorySummaryStatus;
  CompositionStatus: CompositionStatus;
  Achievable: boolean;
  RBInstance: null | string;
  Count: Count;
  EndpointActionStatus: string | null;
  Summary: Summary;
  ComputerSystems?: ComputerSystem[];
  Chassis: Chassis | null;
  Manager: Manager;
  FabricInfo: FabricInfo[];
  NodeId: null;
  NodeName: null;
  MachineId: null;
  MachineName: null;
  Processors?: Processor[];
  Storage?: StorageElement[];
  NetworkInterfaces?: NetworkInterface[];
  capacity: string[];
  info: string[];
}

export enum CompositionState {
  UNUSED = "Unused",
  COMPOSED = "Composed",
  COMPOSED_AND_AVAILABLE = "ComposedAndAvailable",
  COMPOSING = "Composing",
  FAILED = "Failed",
  UNAVAILABLE = "Unavailable",
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
  AssetTag: null;
  ProcessorSummary: ProcessorSummary;
  MemorySummary: MemorySummary;
  Status: MemorySummaryStatus;
  Endpoint: Endpoint;
}

export interface Endpoint {
  Id: string;
  Name: string;
  Description: string;
  ConnectedEntities: ConnectedEntity[];
  EndpointProtocol: SwitchType;
  Status: EndpointStatus;
  SwitchId: null | string;
  PortId: null | string;
  RecentActionStatus: string;
}

export interface ConnectedEntity {
  EntityPciId: EntityPCIID | null;
  EntityRole: string;
  EntityType: string;
  Identifiers: Identifier[];
}

export interface EntityPCIID {
  ClassCode: string;
  DeviceId: string;
  VendorId: string;
}

export interface Identifier {
  DurableName: string;
  DurableNameFormat: string;
}

export enum SwitchType {
  PCIe = "PCIe",
}

export interface EndpointStatus {
  Health: Health;
  State: State;
}

export enum Health {
  Ok = "OK",
}

export enum State {
  Enabled = "Enabled",
}

export interface MemorySummary {
  Status: MemorySummaryStatus;
  TotalSystemMemoryGiB: number;
}

export interface MemorySummaryStatus {
  Health: Health;
  HealthRollup: Health | null;
  State: State;
}

export interface ProcessorSummary {
  Count: number;
  Model: string;
  Status: MemorySummaryStatus;
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
  SwitchType: SwitchType;
  TotalSwitchWidth: number;
  UUID: string;
  DownstreamPorts: number;
  Ports: PortElement[];
  Fqnn: null | string;
}

export interface PortElement {
  Id: string;
  ActiveWidth: number;
  CurrentSpeedGbps: number;
  InterfaceEnabled: boolean;
  LinkState: State;
  LinkStatus: LinkStatus;
  PortMedium: PortMedium;
  PortProtocol: SwitchType;
  PortType: PortType;
  PortWidth: null;
  OxcInfo?: OxcInfo[];
}

export enum LinkStatus {
  LinkDown = "LinkDown",
  LinkUp = "LinkUp",
}

export interface OxcInfo {
  Name: string;
  TxPortId: string;
  RxPortId: string;
}

export enum PortMedium {
  Electrical = "Electrical",
  Optical = "Optical",
}

export enum PortType {
  DownstreamPort = "DownstreamPort",
  UpstreamPort = "UpstreamPort",
}

export interface Manager {
  Id: string;
  Name: string;
  ManagerNodeName: null | string;
  RackName: null | string;
  Fqnn: null | string;
}

export interface NetworkInterface {
  Id: string;
  Name: string;
  Endpoint: Endpoint;
  Manufacturer: string;
  Model: string;
  NetworkDeviceFunctions: NetworkDeviceFunction[];
}

export interface NetworkDeviceFunction {
  Id: string;
  Name: string;
  BootMode: string;
  DeviceEnabled: boolean;
  Ethernet: Ethernet;
  Limits: Limit[];
  NetDevFuncType: string;
  SAVIEnabled: boolean;
  VirtualFunctionsEnabled: boolean;
  Port: NetworkDeviceFunctionPort;
}

export interface Ethernet {
  MACAddress: string;
  MTUSize: number;
  MTUSizeMaximum: number;
  PermanentMACAddress: string;
}

export interface Limit {
  BurstBytesPerSecond: number;
  BurstPacketsPerSecond: number;
  Direction: string;
  SustainedBytesPerSecond: number;
  SustainedPacketsPerSecond: number;
}

export interface NetworkDeviceFunctionPort {
  Id: string;
  Name: string;
  CurrentSpeedGbps: number;
  MaxSpeedGbps: number;
  LinkState: State;
  LinkStatus: LinkStatus;
}

export interface Processor {
  Id: string;
  Name: string;
  ProcessorType: string;
  ProcessorArchitecture: null;
  InstructionSet: null;
  Manufacturer: string;
  Model: string;
  MaxSpeedMHz: number;
  TotalCores: number;
  TotalThreads: number;
  Status: EndpointStatus;
  Endpoint: Endpoint;
}

export interface StorageElement {
  Id: string;
  Name: string;
  Drives: Drive[];
  StorageControllers: StorageController[];
  Status: MemorySummaryStatus;
  Endpoint: Endpoint;
}

export interface Drive {
  Id: string;
  Name: string;
  CapacityBytes: number;
  MediaType: string;
  Protocol: string;
  Status: MemorySummaryStatus;
}

export interface StorageController {
  FirmwareVersion: null;
  Manufacturer: string;
  MemberId: string;
  Model: string;
  Name: string;
  SpeedGbps: number;
  Status: null;
  SupportedControllerProtocols: SwitchType[];
  SupportedDeviceProtocols: string[];
}

export interface Summary {
  ComputerSystems?: ComputerSystems;
  Processors?: ProcessorsClass;
  Storage?: SummaryStorage;
  NetworkInterfaces?: NetworkInterfaces;
}

export interface ComputerSystems {
  Processor: ProcessorsClass;
  Memory: Memory;
}

export interface Memory {
  TotalSystemMemoryGiB: number;
}

export interface ProcessorsClass {
  Count: number;
  TotalCores: number;
  TotalThreads: number;
  MaxSpeedMHz?: number;
}

export interface NetworkInterfaces {
  MaxSpeedGbps: number;
  PortsCount: number;
}

export interface SummaryStorage {
  CapacityGigaBytes: number;
  DrivesCount: number;
}

export interface MemberKey {
  Processors?: Processor[];
  Storage?: StorageElement[];
  NetworkInterfaces?: NetworkInterface[];
  ComputerSystems?: ComputerSystem[];
}
