import { useContext, useState } from "react";

import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../../base/constants";
import { INPROGRESS, IN_PROGRESS } from "../../Constants/re-config.constants";
import type { Member } from "../../Models/ResourceBlock";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import { getResourceDeviceInfo } from "./ResourceDeviceInfoContext";

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   // borderBottom: 0,
  // },
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
    marginTop: 0,
    marginBottom: 0,
  },
  "&.MuiAccordionSummary-root": {
    minHeight: "2rem",
    maxHeight: "2rem",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

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
