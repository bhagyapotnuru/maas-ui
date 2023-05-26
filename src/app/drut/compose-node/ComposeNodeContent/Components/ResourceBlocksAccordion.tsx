import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../../base/constants";
import type { Member, RBTypeResp } from "../../Models/ResourceBlock";

import ResourceBlockTable from "./ResourceBlockTable";

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLOURS.ACCORDIAN_BG_TRUE
      : COLOURS.ACCORDIAN_BG_FALSE,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiTypography-root": {
    fontWeight: "400",
    padding: 0,
    color: COLOURS.ACCORDIAN_TEXT,
    fontSize: 14,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const ResourceBlocksAccordion = ({
  resourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  header,
  expandedResourceType,
  setExpandedResourceType,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
}: {
  resourceBlocks: Member[];
  expandedResourceBlockRow: string;
  header: string;
  setExpandedResourceBlock: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
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
            {header} Block &nbsp; ({resourceBlocks.length})
          </strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ResourceBlockTable
          header={header}
          expandedResourceBlockRow={expandedResourceBlockRow}
          resourceBlocks={resourceBlocks}
          setExpandedResourceBlock={setExpandedResourceBlock}
          setSelectedResourceBlocks={setSelectedResourceBlocks}
          isMaxPortCountLimitReached={isMaxPortCountLimitReached}
        />
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default ResourceBlocksAccordion;
