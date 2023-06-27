export interface DataPath {
  Id: string;
  Name: string;
  InitiatorResourceBlock: InitiatorResourceBlock;
  InitiatorEndpoint: InitiatorEndpoint;
  TargetResourceBlocks: TargetResourceBlock[];
}

export interface InitiatorResourceBlock {
  Name: string;
  Id: string;
}

export interface InitiatorEndpoint {
  Id: string;
  Name: string;
  SwitchId: string;
  UpstreamPort: string;
  Status: Status;
}

export interface Status {
  Health: string;
  HealthRollup: string;
  State: string;
}

export interface TargetResourceBlock {
  Id: string;
  Name: string;
  TargetEndpoints: TargetEndpoint[];
}

export interface TargetEndpoint {
  Id: string;
  Name: string;
  DataPathId: string;
  XConnects: Xconnects;
  Ports: Ports;
  Status: Status;
}

export interface Xconnects {
  Id: string;
  Name: string;
  ConnectedOxcPorts: ConnectedOxcPort[];
  Status: Status;
}

export interface ConnectedOxcPort {
  Source: string;
  Destination: string;
  Status: Status;
}

export interface Ports {
  DownstreamPort: DownStreamPort;
  UpstreamPort: UpStreamPort;
  ConnectedIficDsPort: string;
}

export interface DownStreamPort {
  PcieSegment: string;
  SwitchId: string;
}

export interface UpStreamPort {
  PcieSegment: string;
  SwitchId: string;
}
