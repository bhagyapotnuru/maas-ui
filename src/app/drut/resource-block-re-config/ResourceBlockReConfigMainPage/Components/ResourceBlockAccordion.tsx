import { useContext } from "react";

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../../base/constants";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import FreePoolBlocks from "./FreePoolBlocks";
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

const ResourceBlockAccordion = (): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);
  const freePoolBlocks = "FreePoolBlocks";

  return (
    <div className={classes.resouce_block_accordion}>
      <div>
        <StyledAccordion
          expanded={freePoolBlocks === context.expandedResourceBlockType}
          onChange={() =>
            context.setExpandedResourceBlockType(
              freePoolBlocks === context.expandedResourceBlockType
                ? ""
                : freePoolBlocks
            )
          }
        >
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography>
              <strong>Free Pool Resources &nbsp;</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FreePoolBlocks />
          </AccordionDetails>
        </StyledAccordion>
      </div>
      <div>
        {Object.keys(context.resourceBlocksByType).map((key: string) => {
          return (
            <StyledAccordion
              expanded={key === context.expandedResourceBlockType}
              onChange={() => {
                context.setExpandedResourceBlockType(
                  key === context.expandedResourceBlockType ? "" : key
                );
                context.setExpandedResourceBlock("");
              }}
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  <strong>
                    {key} Block(s) &nbsp; (
                    {context.resourceBlocksByType[key].length})
                  </strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ResourceBlockTable
                  resourceBlockMembers={context.resourceBlocksByType[key]}
                />
              </AccordionDetails>
            </StyledAccordion>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceBlockAccordion;
