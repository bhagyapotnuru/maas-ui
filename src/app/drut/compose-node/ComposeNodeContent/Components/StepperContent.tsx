import type { RBTypeResp } from "../../Models/ResourceBlock";
import Step1Content from "../Components/Step1Content";

import ComposeNodeBlock from "./ComposeNodeBlock";
import IFICPool from "./IFICPool";
import TFICPool from "./TFICPool";

import type {
  RackByType,
  ZoneObj as Zone,
} from "app/store/drut/managers/types";

const StepperContent = ({
  stepIndex,
  zones,
  selectedZone,
  setSelectedZone,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  expandedResourceType,
  setExpandedResourceType,
  enteredNodeName,
  setEnteredNodeName,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  computeResourceBlocks,
  targetResourceBlocks,
  fetchingResourceBlocks,
  fqnn,
  setFqnn,
  error,
  setError,
  setTargetResourceBlocks,
  setResourceBlocksRefreshKey,
  resourceBlocksRefreshKey,
  setResourcesRefreshKey,
  resourcesRefreshKey,
}: {
  stepIndex: number;
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  computeResourceBlocks: RBTypeResp;
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: RackByType;
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  selectedTFICRack: string;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  enteredNodeName: string;
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  setEnteredNodeName: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
  fqnn: any;
  setFqnn: (value: any) => void;
  error: string;
  setError: (value: string) => void;
  setTargetResourceBlocks: (value: RBTypeResp) => void;
  setResourceBlocksRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourceBlocksRefreshKey: boolean;
  setResourcesRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourcesRefreshKey: boolean;
}): JSX.Element => {
  switch (stepIndex) {
    case 1:
      return (
        <Step1Content
          setSelectedZone={setSelectedZone}
          selectedZone={selectedZone}
          zones={zones}
          enteredNodeName={enteredNodeName}
          setEnteredNodeName={setEnteredNodeName}
        />
      );
    case 2:
      return (
        <IFICPool
          computeResourceBlocks={computeResourceBlocks}
          expandedResourceBlockRow={expandedResourceBlockRow}
          setExpandedResourceBlock={setExpandedResourceBlock}
          racks={racks.ific}
          selectedIFICRack={selectedIFICRack}
          setSelectedIFICRack={setSelectedIFICRack}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          fetchingResourceBlocks={fetchingResourceBlocks}
          selectedResourceBlocks={selectedResourceBlocks}
          setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
          setTargetResourceBlocks={setTargetResourceBlocks}
          setResourceBlocksRefreshKey={setResourceBlocksRefreshKey}
          resourceBlocksRefreshKey={resourceBlocksRefreshKey}
        />
      );
    case 3:
      return (
        <TFICPool
          targetResourceBlocks={targetResourceBlocks}
          expandedResourceBlockRow={expandedResourceBlockRow}
          setExpandedResourceBlock={setExpandedResourceBlock}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={isMaxPortCountLimitReached}
          fetchingResourceBlocks={fetchingResourceBlocks}
          fqnn={fqnn}
          setFqnn={setFqnn}
          selectedResourceBlocks={selectedResourceBlocks}
          setResourcesRefreshKey={setResourcesRefreshKey}
          resourcesRefreshKey={resourcesRefreshKey}
          setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
        />
      );
    case 4:
      return (
        <ComposeNodeBlock
          enteredNodeName={enteredNodeName}
          selectedResourceBlocks={selectedResourceBlocks}
          setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
          selectedZone={
            zones.find((z) => +z.zone_id === +selectedZone)?.zone_name || ""
          }
          error={error}
          setError={setError}
        />
      );
    default:
      return <p>No Information</p>;
  }
};

export default StepperContent;
