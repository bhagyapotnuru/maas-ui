import { useContext } from "react";

import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import type { ReConfigType } from "../../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import type { RackManager } from "app/store/drut/managers/types";

const ManagerSelect = (): JSX.Element => {
  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  return (
    <div className={classes.child_selection}>
      <div>
        <span>
          <strong>
            Chassis <span style={{ color: "red" }}>*</span> &#58;
          </strong>
        </span>
      </div>
      <FormControl
        sx={{ m: 0, minWidth: 150, maxWidth: 150 }}
        size="small"
        variant="standard"
      >
        <Select
          placeholder="Select Chassis"
          id="chassis-select"
          label=""
          value={`${context.selectedManager}`}
          onChange={(e: SelectChangeEvent<string>) => {
            context.setSelectedManager(e.target.value);
          }}
          className={classes.form_selection_value}
          variant="standard"
        >
          {context.managers.length === 0 ? (
            <MenuItem>
              <em>No Chassis available</em>
            </MenuItem>
          ) : (
            context.managers.map((manager: RackManager) => (
              <MenuItem
                key={manager.uuid}
                value={manager.uuid}
                className={classes.header_selection_menu_item}
              >
                {manager.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default ManagerSelect;
