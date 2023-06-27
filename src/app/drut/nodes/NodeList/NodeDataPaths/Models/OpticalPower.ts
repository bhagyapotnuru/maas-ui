export interface OpticalPower {
  Switch: string;
  Port: string;
  OpticalModule?: OpticalModule;
}

export interface OpticalModule {
  Name: string;
  RX1_POWER: string;
  RX2_POWER: string;
  RX3_POWER: string;
  RX4_POWER: string;
  TX1_POWER: string;
  TX2_POWER: string;
  TX3_POWER: string;
  TX4_POWER: string;
}
