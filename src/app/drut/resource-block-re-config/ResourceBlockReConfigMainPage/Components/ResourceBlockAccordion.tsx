import { useContext } from "react";

import Typography from "@mui/material/Typography";

import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import FreePoolBlocks from "./FreePoolBlocks";
import ResourceBlockTable from "./ResourceBlockTable";

import {
  Accordion as StyledAccordion,
  AccordionDetails,
  AccordionSummary,
} from "app/drut/components/accordion";

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
