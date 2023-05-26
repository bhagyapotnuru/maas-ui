import type { RBTypeResp } from "../../Models/ResourceBlock";

import ResourceBlockPage from "./ResourceBlockPage";

import FqnnSelect from "app/drut/fabric/AttachDetachFabric/FqnnSelect";

const TFICPool = ({
  targetResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  fetchingResourceBlocks,
  fqnn,
  setFqnn,
}: {
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
  fqnn: any;
  setFqnn: (value: any) => void;
}): JSX.Element => {
  return (
    <div>
      <FqnnSelect
        selectedFqnn={fqnn.selectedFqnn}
        setFqnn={setFqnn}
        uniqueFqnn={fqnn.uniqueFqnn}
      />
      <ResourceBlockPage
        expandedResourceBlockRow={expandedResourceBlockRow}
        resourceBlocksByType={targetResourceBlocks}
        setExpandedResourceBlock={setExpandedResourceBlock}
        expandedResourceType={expandedResourceType}
        setExpandedResourceType={setExpandedResourceType}
        setSelectedResourceBlocks={setSelectedResourceBlocks}
        isMaxPortCountLimitReached={isMaxPortCountLimitReached}
        fetchingResourceBlocks={fetchingResourceBlocks}
      />
    </div>
  );
};

export default TFICPool;
