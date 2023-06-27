import { useContext, useState } from "react";

import { Notification } from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

import type { Member } from "../../Models/ResourceBlock";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import { getResourceDeviceInfo } from "./ResourceDeviceInfoContext";

import {
  Accordion2 as StyledAccordion,
  AccordionDetails,
  AccordionSummary2 as AccordionSummary,
} from "app/drut/components/accordion";

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

  const errorValue = context.attachDetachError?.toString();

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
          {errorValue && !errorValue?.includes("AbortError") && (
            <Notification
              onDismiss={() => context.setAttachDetachError("")}
              inline
              severity="negative"
            >
              {errorValue}
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
