import { useContext } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import type { ResourceBlockOption } from "../../Models/ResourceBlockOptions";
import type { ReConfigType } from "../../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const ResourceBlockSelect = (): JSX.Element => {
  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  const nonOtherOptions: ResourceBlockOption[] = [];
  const otherOptions: ResourceBlockOption[] = [];
  const allOption: ResourceBlockOption = {
    name: "All",
    resourceBlockType: "All",
    uuid: "All",
  };
  context.resourceBlockOptions
    .sort((a, b) => -b.resourceBlockType.localeCompare(a.resourceBlockType))
    .forEach((option: ResourceBlockOption) =>
      option.resourceBlockType.includes("Other")
        ? otherOptions.push(option)
        : nonOtherOptions.push(option)
    );
  return (
    <div className={classes.child_selection}>
      <div>
        <span>
          <strong>
            Resource Block <span style={{ color: "red" }}>*</span> &#58;
          </strong>
        </span>
      </div>
      <Autocomplete
        sx={{ m: 0, minWidth: 230, maxWidth: 230 }}
        id="grouped-resource-block-options"
        onChange={(e, option: ResourceBlockOption | null) => {
          context.setSelectedResourceBlock(option);
        }}
        value={context.selectedResourceBlock}
        size="small"
        options={[allOption, ...otherOptions, ...nonOtherOptions]}
        groupBy={(option: ResourceBlockOption) =>
          option.name !== "All" ? option?.resourceBlockType?.toUpperCase() : ""
        }
        disabled={context.loading || context.refreshing}
        getOptionLabel={(option: ResourceBlockOption) => option.name}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <TextField
              className={classes.resource_block_autocomplete}
              {...params}
              label=""
              placeholder="Select Resource Block"
              variant="standard"
            />
          );
        }}
        renderGroup={(params) => (
          <li>
            <div className={classes.resource_block_option}>
              <strong>{params.group}</strong>
            </div>
            <div className={classes.resource_block_option}>
              {params.children}
            </div>
          </li>
        )}
        renderOption={(props, option: ResourceBlockOption, { selected }) => (
          <CustomizedTooltip title={""} placement="left">
            <li {...props}>
              <span key={`${option.uuid}`}>{option.name}</span>
            </li>
          </CustomizedTooltip>
        )}
      />
    </div>
  );
};

export default ResourceBlockSelect;
