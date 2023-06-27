import { useContext, useState } from "react";

import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import Typography from "@mui/material/Typography";

import { INPROGRESS, IN_PROGRESS } from "../../Constants/re-config.constants";
import type { Member } from "../../Models/ResourceBlock";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import { getResourceDeviceInfo } from "./ResourceDeviceInfoContext";

import {
  Accordion2 as StyledAccordion,
  AccordionDetails,
  AccordionSummary2 as AccordionSummary,
} from "app/drut/components/accordion";

const FreePoolBlocks = (): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);
  const [expandedResource, setExpandedResource] = useState("");
  const freePools: Member[] = (context.freePoolBlocks || []).filter(
    (freePool: Member) => freePool.ResourceBlockType.length > 0
  );
  const addingToResource: Member | undefined =
    context.resourceBlocksResponse.Links.Members.find((r) =>
      [INPROGRESS, IN_PROGRESS].includes(
        (r.EndpointActionStatus || "").toLowerCase()
      )
    );
  return (
    <div>
      {freePools?.length > 0 ? (
        <div onClick={(e) => e.stopPropagation()}>
          {freePools.map((freePoolBlock: Member) => {
            return (
              <>
                {getResourceDeviceInfo(
                  freePoolBlock,
                  context.setResourceToAttach,
                  true,
                  context.isAnyActionInProgress,
                  context.resourceToAttach,
                  context.setResourceToAttachFreePoolBlock,
                  addingToResource,
                  false
                ).map((deviceInfo: Section, index: number) => {
                  return (
                    <StyledAccordion
                      expanded={
                        (deviceInfo.key?.toString() || "") +
                          freePoolBlock.Id +
                          index ===
                        expandedResource
                      }
                      onChange={(e) => {
                        setExpandedResource(
                          (deviceInfo.key?.toString() || "") +
                            freePoolBlock.Id +
                            index ===
                            expandedResource
                            ? ""
                            : (deviceInfo.key?.toString() || "") +
                                freePoolBlock.Id +
                                index
                        );
                      }}
                    >
                      <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>
                          <strong>{deviceInfo.title}</strong>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>{deviceInfo.content}</AccordionDetails>
                    </StyledAccordion>
                  );
                })}
              </>
            );
          })}
        </div>
      ) : (
        <div className={classes.no_data}>No Free pool resources available</div>
      )}
    </div>
  );
};

export default FreePoolBlocks;
