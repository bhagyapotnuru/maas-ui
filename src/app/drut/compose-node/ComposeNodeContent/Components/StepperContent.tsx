import type { RBTypeResp } from "../../Models/ResourceBlock";
import Step1Content from "../Components/Step1Content";

import IFICPool from "./IFICPool";
import TFICPool from "./TFICPool";

import type {
  RackByType,
  Zone,
} from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

const StepperContent = ({
  stepIndex,
  zones,
  selectedZone,
  setSelectedZone,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
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
  setSelectedTFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
  fqnn: any;
  setFqnn: (value: any) => void;
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
        />
      );
    default:
      return <p>No Information</p>;
  }
};

export default StepperContent;
