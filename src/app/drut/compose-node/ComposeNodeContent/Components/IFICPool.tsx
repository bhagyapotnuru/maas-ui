import { Spinner, Tooltip } from "@canonical/react-components";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";

import type { RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import RackSelect from "./RackSelect";
import ResourceBlockPage from "./ResourceBlockPage";

import type { Rack } from "app/store/drut/managers/types";

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
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  setTargetResourceBlocks,
  setResourceBlocksRefreshKey,
  resourceBlocksRefreshKey,
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
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  setTargetResourceBlocks?: (value: RBTypeResp) => void;
  setResourceBlocksRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourceBlocksRefreshKey: boolean;
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
        <span style={{ marginTop: "0.5rem" }}>
          {isComputeBlockSelected && (
            <>
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
            </>
          )}
        </span>
        {resourceBlocksRefreshKey ? (
          <Spinner key={`managerListSpinner_${Math.random()}`} />
        ) : (
          <Tooltip message="Refresh">
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setResourceBlocksRefreshKey(true);
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
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
          setTargetResourceBlocks={setTargetResourceBlocks}
          isTargetBlocks={false}
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
