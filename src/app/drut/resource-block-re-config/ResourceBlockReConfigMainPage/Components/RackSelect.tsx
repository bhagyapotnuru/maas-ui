import { useContext } from "react";

import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import type { ReConfigType } from "../../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import type { Rack } from "app/store/drut/managers/types";

const RackSelect = (): JSX.Element => {
  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  return (
    <div className={classes.child_selection}>
      <div>
        <span>
          <strong>
            TFIC Pool <span style={{ color: "red" }}>*</span> &#58;
          </strong>
        </span>
      </div>
      <FormControl
        sx={{ m: 0, minWidth: 150, maxWidth: 150 }}
        size="small"
        variant="standard"
      >
        <Select
          placeholder="Select Pool"
          id="rack-select"
          label=""
          value={`${context.selectedRack}`}
          onChange={(e: SelectChangeEvent<string>) => {
            context.setSelectedRack(e.target.value);
          }}
          className={classes.form_selection_value}
          variant="standard"
        >
          {context.racks.length === 0 ? (
            <MenuItem>
              <em>No Pools available</em>
            </MenuItem>
          ) : (
            [
              { rack_id: 0, rack_name: "All", rack_fqgn: "All" },
              ...context.racks,
            ].map((rack: Rack) => (
              <MenuItem
                key={rack.rack_id}
                value={rack.rack_id}
                className={classes.header_selection_menu_item}
              >
                {rack.rack_name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default RackSelect;
