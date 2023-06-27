import { Spinner, Tooltip } from "@canonical/react-components";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";

import type { RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

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
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  setResourcesRefreshKey,
  resourcesRefreshKey,
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
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  setResourcesRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourcesRefreshKey: boolean;
}): JSX.Element => {
  const targetRBs: string[] = Object.keys(selectedResourceBlocks).filter(
    (key: string) => key !== "Compute"
  );
  const isComputeBlockSelected: boolean =
    selectedResourceBlocks && selectedResourceBlocks["Compute"]?.length > 0;
  const selectedTargetRBsCount = targetRBs.reduce(
    (acc, val) => acc + selectedResourceBlocks[val].length,
    0
  );
  const totalIFICDownStreamPorts =
    selectedResourceBlocks["Compute"]?.[0]?.FabricInfo[0]?.DownstreamPorts || 0;
  setIsMaxPortCountLimitReached(
    selectedTargetRBsCount >= totalIFICDownStreamPorts
  );

  return (
    <div>
      <div className={classes.tfic_pool_block}>
        <FqnnSelect
          selectedFqnn={fqnn.selectedFqnn}
          setFqnn={setFqnn}
          uniqueFqnn={fqnn.uniqueFqnn}
        />
        {isComputeBlockSelected && (
          <span style={{ marginTop: "0.5rem" }}>
            <strong>Selected Compute Block &#58; &nbsp;</strong>
            <span>
              <strong>
                {`[`}&nbsp;Total Downstream Ports &#58; &nbsp;{" "}
                {totalIFICDownStreamPorts}
                &#44; &nbsp; Available &#58; &nbsp;
                {totalIFICDownStreamPorts - selectedTargetRBsCount}
                &#44; &nbsp; Selected &#58; &nbsp;
                {selectedTargetRBsCount} &nbsp;
                {`]`}
              </strong>
            </span>
          </span>
        )}
        {resourcesRefreshKey ? (
          <Spinner key={`TFIC_pool_${Math.random()}`} />
        ) : (
          <Tooltip message="Refresh">
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setResourcesRefreshKey(true);
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <ResourceBlockPage
        expandedResourceBlockRow={expandedResourceBlockRow}
        resourceBlocksByType={targetResourceBlocks}
        setExpandedResourceBlock={setExpandedResourceBlock}
        expandedResourceType={expandedResourceType}
        setExpandedResourceType={setExpandedResourceType}
        setSelectedResourceBlocks={setSelectedResourceBlocks}
        isMaxPortCountLimitReached={isMaxPortCountLimitReached}
        fetchingResourceBlocks={fetchingResourceBlocks}
        isTargetBlocks={true}
      />
    </div>
  );
};

export default TFICPool;
