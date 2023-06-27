import { useContext, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { Typography } from "@mui/material";

import type { Member } from "../Models/ResourceBlock";
import type { ReConfigType } from "../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../Store/resource-block-re-config-context";
import classes from "../resource-block-re-config.module.scss";

import Refresh from "./Components/Refresh";
import ResourceBlockAccordion from "./Components/ResourceBlockAccordion";
import ResourceBlockSelect from "./Components/ResourceBlockSelect";
import ResourceBlockTable from "./Components/ResourceBlockTable";
import ZoneSelect from "./Components/ZoneSelect";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "app/drut/components/accordion";
import type {
  RackManager,
  Rack,
  Resources,
} from "app/store/drut/managers/types";

const ResourceBlockReConfigMainPageContent = (): JSX.Element => {
  const [expanded, setExpanded] = useState("");

  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  let selectedResourceBlockMember: Member | undefined;
  if (
    context.selectedResourceBlock?.name &&
    context.selectedResourceBlock?.name !== "All"
  ) {
    const rb = context.selectedResourceBlock;
    selectedResourceBlockMember = context.resourceBlocksByType[
      rb?.resourceBlockType || ""
    ].find((member) => member.Id === rb?.uuid);
  }

  return (
    <>
      <div className={classes.header_selections}>
        <ZoneSelect />
        <Refresh />
      </div>
      {context.racks.length > 0 ? (
        context.racks.map((rack: Rack) => {
          const freeResources: Resources | undefined = rack.managers?.reduce(
            (acc: Resources, curr: RackManager) => {
              acc.network = acc.network + (curr.free_resources?.network || 0);
              acc.computersystem =
                acc.computersystem + (curr.free_resources?.computersystem || 0);
              acc.processor =
                acc.processor + (curr.free_resources?.processor || 0);
              acc.storage = acc.storage + (curr.free_resources?.storage || 0);
              return acc;
            },
            {
              network: 0,
              computersystem: 0,
              processor: 0,
              storage: 0,
            } as Resources
          );
          const existingResources: Resources | undefined =
            rack.managers?.reduce(
              (acc: Resources, curr: RackManager) => {
                acc.network = acc.network + (curr.resources?.network || 0);
                acc.computersystem =
                  acc.computersystem + (curr.resources?.computersystem || 0);
                acc.processor =
                  acc.processor + (curr.resources?.processor || 0);
                acc.storage = acc.storage + (curr.resources?.storage || 0);
                return acc;
              },
              {
                network: 0,
                computersystem: 0,
                processor: 0,
                storage: 0,
              } as Resources
            );

          return (
            <Accordion
              expanded={`${rack.rack_id}` === context.selectedRack}
              key={"rack" + Math.random()}
              onChange={() => {
                context.setSelectedRack(
                  `${rack.rack_id}` === context.selectedRack
                    ? ""
                    : `${rack.rack_id}`
                );
              }}
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ maxWidth: "none" }}>
                  <strong
                    className={
                      `${rack.rack_id}` === context.selectedRack
                        ? classes.text
                        : classes.textAccordion
                    }
                  >
                    {rack.rack_name}&emsp;
                  </strong>
                  <span>
                    (Network: {existingResources?.network || 0}, &nbsp;
                    Processor: {existingResources?.processor || 0}, &nbsp;
                    Computer System: {existingResources?.computersystem || 0},
                    &nbsp; Storage: {existingResources?.storage || 0}) &emsp;
                    <b>Free Pool:</b> &nbsp;(Network:{" "}
                    {freeResources?.network || 0}, &nbsp; Processor:{" "}
                    {freeResources?.processor || 0}, &nbsp; Computer System:{" "}
                    {freeResources?.computersystem || 0}, &nbsp; Storage:{" "}
                    {freeResources?.storage || 0}) &nbsp;
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {context.managers.map((manager: RackManager) => {
                  const { free_resources, resources } = manager;
                  return (
                    <Accordion
                      expanded={manager.uuid === expanded}
                      key={"manager" + Math.random()}
                      onChange={() => {
                        setExpanded(
                          manager.uuid === expanded ? "" : manager.uuid
                        );
                        manager.uuid !== expanded &&
                          context.setSelectedManager(manager.uuid);
                      }}
                    >
                      <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography sx={{ maxWidth: "none" }}>
                          <strong
                            className={
                              manager.uuid === expanded
                                ? classes.text
                                : classes.textAccordion
                            }
                          >
                            {manager.name}&emsp;
                          </strong>
                          <span>
                            (Network: {resources?.network || 0}, &nbsp;
                            Processor: {resources?.processor || 0}, &nbsp;
                            Computer System: {resources?.computersystem || 0},
                            &nbsp; Storage: {resources?.storage || 0}) &emsp;
                            <b>Free Pool:</b> &nbsp;(Network:{" "}
                            {free_resources?.network || 0}, &nbsp; Processor:{" "}
                            {free_resources?.processor || 0}, &nbsp; Computer
                            System: {free_resources?.computersystem || 0},
                            &nbsp; Storage: {free_resources?.storage || 0})
                            &nbsp;
                          </span>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ResourceBlockSelect />

                        <div style={{ marginTop: 20 }}>
                          {context.loading ? (
                            <Notification inline severity="information">
                              <Spinner text={context.loadingMessage} />
                            </Notification>
                          ) : context.selectedResourceBlock?.name === "All" &&
                            context.resourceBlocksResponse?.Links?.Members
                              ?.length > 0 ? (
                            <ResourceBlockAccordion />
                          ) : (
                            <ResourceBlockTable
                              resourceBlockMembers={
                                selectedResourceBlockMember
                                  ? [selectedResourceBlockMember]
                                  : []
                              }
                            />
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <ResourceBlockTable resourceBlockMembers={[]} />
      )}
    </>
  );
};

export default ResourceBlockReConfigMainPageContent;
