import { Notification, Spinner } from "@canonical/react-components";

import type { RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import ResourceBlocksAccordion from "./ResourceBlocksAccordion";

const defaultResourceTypes = ["Offload", "Storage", "Network", "DPU"];

const ResourceBlockPage = ({
  resourceBlocksByType,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  fetchingResourceBlocks,
  setTargetResourceBlocks,
  isTargetBlocks,
}: {
  resourceBlocksByType: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  fetchingResourceBlocks: boolean;
  setTargetResourceBlocks?: (value: RBTypeResp) => void;
  isTargetBlocks: boolean;
}): JSX.Element => {
  const keys = Object.keys(resourceBlocksByType);
  const isDataAvailable: boolean = keys.some(
    (key) => resourceBlocksByType[key]?.length > 0
  );
  return (
    <>
      {fetchingResourceBlocks ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={`Fetching Resource Blocks...`}
            key={`resource_blocks_spinner_${Math.random()}`}
          />
        </Notification>
      ) : isDataAvailable ? (
        isTargetBlocks ? (
          defaultResourceTypes.map((key: string) => {
            return (
              <ResourceBlocksAccordion
                header={key}
                expandedResourceBlockRow={expandedResourceBlockRow}
                resourceBlocks={resourceBlocksByType[key]}
                setExpandedResourceBlock={setExpandedResourceBlock}
                expandedResourceType={expandedResourceType}
                setExpandedResourceType={setExpandedResourceType}
                setSelectedResourceBlocks={setSelectedResourceBlocks}
                isMaxPortCountLimitReached={isMaxPortCountLimitReached}
                setTargetResourceBlocks={setTargetResourceBlocks}
              />
            );
          })
        ) : (
          keys.map((key: string) => {
            return (
              <ResourceBlocksAccordion
                header={key}
                expandedResourceBlockRow={expandedResourceBlockRow}
                resourceBlocks={resourceBlocksByType[key]}
                setExpandedResourceBlock={setExpandedResourceBlock}
                expandedResourceType={expandedResourceType}
                setExpandedResourceType={setExpandedResourceType}
                setSelectedResourceBlocks={setSelectedResourceBlocks}
                isMaxPortCountLimitReached={isMaxPortCountLimitReached}
                setTargetResourceBlocks={setTargetResourceBlocks}
              />
            );
          })
        )
      ) : (
        <div className={classes.no_data}>Data Not Available</div>
      )}
    </>
  );
};

export default ResourceBlockPage;
