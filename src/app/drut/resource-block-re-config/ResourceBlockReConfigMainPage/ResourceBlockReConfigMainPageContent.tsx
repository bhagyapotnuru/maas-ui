import { useContext } from "react";

import type { Member } from "../Models/ResourceBlock";
import type { ReConfigType } from "../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../Store/resource-block-re-config-context";
import classes from "../resource-block-re-config.module.scss";

import ManagerSelect from "./Components/ManagerSelect";
import RackSelect from "./Components/RackSelect";
import Refresh from "./Components/Refresh";
import ResourceBlockAccordion from "./Components/ResourceBlockAccordion";
import ResourceBlockSelect from "./Components/ResourceBlockSelect";
import ResourceBlockTable from "./Components/ResourceBlockTable";
import ZoneSelect from "./Components/ZoneSelect";

const ResourceBlockReConfigMainPageContent = (): JSX.Element => {
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
      <div className={classes.main_page_content}>
        <div className={classes.header_selections}>
          <ZoneSelect />
          <RackSelect />
          <ManagerSelect />
          <ResourceBlockSelect />
          <Refresh />
        </div>
        <div>
          {context.selectedResourceBlock?.name === "All" &&
          context.resourceBlocksResponse?.Links?.Members?.length > 0 ? (
            <ResourceBlockAccordion />
          ) : (
            <ResourceBlockTable
              resourceBlockMembers={
                selectedResourceBlockMember ? [selectedResourceBlockMember] : []
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ResourceBlockReConfigMainPageContent;
