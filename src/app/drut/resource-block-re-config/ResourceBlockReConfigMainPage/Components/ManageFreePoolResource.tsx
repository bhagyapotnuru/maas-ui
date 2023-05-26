import { useContext, useState } from "react";

import { Notification } from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Button } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../../base/constants";
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

const ManageFreePoolResource = ({
  onClickBackDrop,
  onClickCancel,
}: {
  onClickBackDrop: () => void;
  onClickCancel: () => void;
}): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);
  const deviceInfoLists =
    context.availableFreePools?.length > 0
      ? context.availableFreePools.map((freePoolBlock: Member) =>
          getResourceDeviceInfo(
            freePoolBlock,
            context.setResourceToAttach,
            true,
            context.isAnyActionInProgress || context.isAttachDetachInProgress,
            context.resourceToAttach,
            context.setResourceToAttachFreePoolBlock
          )
        )
      : [];
  const [expandedResource, setExpandedResource] = useState(
    deviceInfoLists && deviceInfoLists[0] && deviceInfoLists[0][0]
      ? (deviceInfoLists[0][0]?.key?.toString() || "") + "0"
      : ""
  );

  return (
    <div>
      <div
        className={classes.backdrop}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClickBackDrop();
        }}
      >
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <header
            className={classes.header}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{`Available Free Pool Resources`}</h2>
          </header>
          {context.attachDetachError && context.attachDetachError.length && (
            <Notification
              key={`notification_${Math.random()}`}
              onDismiss={() => context.setAttachDetachError("")}
              inline
              severity="negative"
            >
              {context.attachDetachError}
            </Notification>
          )}
          <div
            className={classes.content_block}
            onClick={(e) => e.stopPropagation()}
          >
            {context.availableFreePools?.length > 0 ? (
              <div onClick={(e) => e.stopPropagation()}>
                {deviceInfoLists.map((deviceInfoList: Section[]) => {
                  return (
                    <>
                      {deviceInfoList.map(
                        (deviceInfo: Section, index: number) => {
                          return (
                            <StyledAccordion
                              expanded={
                                (deviceInfo.key?.toString() || "") + index ===
                                expandedResource
                              }
                              onChange={(e) => {
                                setExpandedResource(
                                  (deviceInfo.key?.toString() || "") + index ===
                                    expandedResource
                                    ? ""
                                    : (deviceInfo.key?.toString() || "") + index
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
                              <AccordionDetails>
                                {deviceInfo.content}
                              </AccordionDetails>
                            </StyledAccordion>
                          );
                        }
                      )}
                    </>
                  );
                })}
              </div>
            ) : (
              <div className={classes.manage_free_pool_no_data}>
                No Free pool resources available
              </div>
            )}
            <footer
              className={classes.actions}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={classes.primary_btn}>
                <Button
                  disabled={context.isAttachDetachInProgress}
                  variant="outlined"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClickCancel();
                  }}
                >
                  Close
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFreePoolResource;
