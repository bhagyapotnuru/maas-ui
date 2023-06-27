import type { Rack, ZoneObj as Zone } from "app/store/drut/managers/types";

export type ZoneSelectionProps = {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (selectedZone: string) => void;
};

export type IFicPoolSelectionProps = {
  iFicPools: Rack[];
  selectedIFicPool: string;
  selectedZone: string;
  setSelectedIFicPool: (selectedIFicPool: string) => void;
};

export type TFicPoolSelectionProps = {
  tFicPools: Rack[];
  selectedTFicPool: string;
  selectedZone: string;
  setSelectedTFicPool: (selectedTFicPool: string) => void;
};
