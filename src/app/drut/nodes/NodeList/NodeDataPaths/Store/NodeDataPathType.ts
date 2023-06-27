import type { DataPath } from "../Models/DataPath";
import type { SelectedDataPath } from "../Models/SelectedDataPath";
import type { SwitchPortToViewOpticalPower } from "../Models/SwitchPortToViewOpticalPower";

export type NodeDataPathType = {
  dataPaths: DataPath[];
  setDataPaths: (dataPaths: DataPath[]) => void;
  switchPortToViewOpticalPower: SwitchPortToViewOpticalPower[] | null;
  setSwitchPortToViewOpticalPower: (
    switchPortToViewOpticalPower: SwitchPortToViewOpticalPower[] | null
  ) => void;
  onOpticalPowerValuePopupCancel: () => void;
  onBackDropClickOfOpticalPowerPopUP: () => void;
  currentDataPath: SelectedDataPath | null;
  setCurrentDataPath: (currentDataPath: SelectedDataPath | null) => void;
  setNodeId: (nodeId: string | null) => void;
  error: string;
  loading: boolean;
  setError: (e: string) => void;
  setIsRefreshAction: (action: boolean) => void;
  setIsNodesPage: (value: boolean | null) => void;
  isNodesPage: boolean | null;
  nodeId: string | null;
};
