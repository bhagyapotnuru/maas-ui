import { Rack, Zone } from "../Managers/AddManager/type";

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
