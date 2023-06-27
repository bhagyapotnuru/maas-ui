import Typography from "@mui/material/Typography";

import type { Member, RBTypeResp } from "../../Models/ResourceBlock";

import ResourceBlockTable from "./ResourceBlockTable";

import {
  Accordion as StyledAccordion,
  AccordionDetails,
  AccordionSummary,
} from "app/drut/components/accordion";

const ResourceBlocksAccordion = ({
  resourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  header,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  setTargetResourceBlocks,
}: {
  resourceBlocks: Member[];
  expandedResourceBlockRow: string;
  header: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  setTargetResourceBlocks?: (value: RBTypeResp) => void;
}): JSX.Element => {
  return (
    <StyledAccordion
      expanded={header === expandedResourceType}
      onChange={() =>
        setExpandedResourceType(header === expandedResourceType ? "" : header)
      }
    >
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Typography>
          <strong>
            {header} Block &nbsp; ({resourceBlocks?.length || 0})
          </strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {resourceBlocks && resourceBlocks.length ? (
          <ResourceBlockTable
            header={header}
            expandedResourceBlockRow={expandedResourceBlockRow}
            resourceBlocks={resourceBlocks}
            setExpandedResourceBlock={setExpandedResourceBlock}
            setSelectedResourceBlocks={setSelectedResourceBlocks}
            isMaxPortCountLimitReached={isMaxPortCountLimitReached}
            setTargetResourceBlocks={setTargetResourceBlocks}
          />
        ) : (
          <div>No Resource Blocks available</div>
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default ResourceBlocksAccordion;
