import type { RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import RackSelect from "./RackSelect";
import ResourceBlockPage from "./ResourceBlockPage";

import type { Rack } from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

const IFICPool = ({
  computeResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  fetchingResourceBlocks,
}: {
  computeResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: Rack[];
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  fetchingResourceBlocks: boolean;
}): JSX.Element => {
  return (
    <div>
      <div className={classes.fic_block}>
        <span>
          <strong>IFIC Pool &#58;</strong>
        </span>
        <RackSelect
          racks={racks}
          selectedRack={selectedIFICRack}
          setSelectedRack={setSelectedIFICRack}
        />
      </div>
      {selectedIFICRack !== "" ? (
        <ResourceBlockPage
          expandedResourceBlockRow={expandedResourceBlockRow}
          resourceBlocksByType={computeResourceBlocks}
          setExpandedResourceBlock={setExpandedResourceBlock}
          expandedResourceType={expandedResourceType}
          setExpandedResourceType={setExpandedResourceType}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={false}
          fetchingResourceBlocks={fetchingResourceBlocks}
        />
      ) : (
        <div className={classes.no_data}>
          Please select Pool to fetch Resource Blocks
        </div>
      )}
    </div>
  );
};
export default IFICPool;
