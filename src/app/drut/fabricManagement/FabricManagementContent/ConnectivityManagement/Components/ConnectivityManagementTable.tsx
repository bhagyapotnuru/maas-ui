import type { SetStateAction } from "react";

import classes from "../../../fabricManagement.module.scss";
import type { Zone } from "../../Managers/AddManager/type";

import IFICBlock from "./IFICBlock";
import OXCBlock from "./OXCBlock";
import TFICBlock from "./TFICBlock";

import type {
  FicManager,
  OpticalSwitch,
  OxcPort,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";

const ConnectivityManagementTable = ({
  iFicData,
  oxcData,
  tFicData,
  oxcPortOptions,
  fetchingConnectivityResponse,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
  expandedOxcAccordion,
  setOxcAccordion,
  expandedTficAccordion,
  setTficAccordion,
  zones,
  selectedZone,
  selectedIFicPool,
  selectedTFicPool,
  removeOxcConnection,
  onClickClearAllPeerPortConnections,
  setIFicResponse,
  setTFicResponse,
  removeFicPeerPort,
  clearAllFicPeerConnections,
}: {
  iFicData: FicManager[];
  oxcData: OpticalSwitch[];
  tFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
  zones: Zone[];
  selectedZone: string;
  selectedIFicPool: string;
  selectedTFicPool: string;
  removeOxcConnection: (oxc: OpticalSwitch, oxcPort: OxcPort) => void;
  onClickClearAllPeerPortConnections: (oxc: OpticalSwitch) => void;
  setIFicResponse: (response: SetStateAction<FicManager[]>) => void;
  setTFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
  clearAllFicPeerConnections: (fic: FicManager) => void;
}): JSX.Element => {
  return (
    <div className={classes.connectivity_management_table_blocks}>
      <IFICBlock
        iFicData={iFicData}
        oxcPortOptions={oxcPortOptions}
        setOxcResponse={setOxcResponse}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        expandedIficAccordion={expandedIficAccordion}
        setIficAccordion={setIficAccordion}
        selectedZone={selectedZone}
        selectedIFicPool={selectedIFicPool}
        setIFicResponse={setIFicResponse}
        removeFicPeerPort={removeFicPeerPort}
        clearAllFicPeerConnections={clearAllFicPeerConnections}
      />
      <OXCBlock
        oxcData={oxcData}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        expandedOxcAccordion={expandedOxcAccordion}
        setOxcAccordion={setOxcAccordion}
        removeOxcConnection={removeOxcConnection}
        onClickClearAllPeerPortConnections={onClickClearAllPeerPortConnections}
      />
      <TFICBlock
        tFicData={tFicData}
        oxcPortOptions={oxcPortOptions}
        setOxcResponse={setOxcResponse}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        expandedTficAccordion={expandedTficAccordion}
        setTficAccordion={setTficAccordion}
        selectedZone={selectedZone}
        selectedTFicPool={selectedTFicPool}
        setTFicResponse={setTFicResponse}
        removeFicPeerPort={removeFicPeerPort}
        clearAllFicPeerConnections={clearAllFicPeerConnections}
      />
    </div>
  );
};

export default ConnectivityManagementTable;
