import { useContext } from "react";

import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import type { ReConfigType } from "../../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import type { Zone } from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

const ZoneSelect = (): JSX.Element => {
  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  return (
    <div className={classes.child_selection}>
      <div>
        <span>
          <strong>
            Zone <span style={{ color: "red" }}>*</span> &#58;
          </strong>
        </span>
      </div>
      <FormControl
        sx={{ m: 0, minWidth: 150, maxWidth: 150 }}
        size="small"
        variant="standard"
      >
        <Select
          placeholder="Select Zone"
          id="zone-select"
          label=""
          value={`${context.selectedZone}`}
          onChange={(e: SelectChangeEvent<string>) => {
            context.setSelectedZone(e.target.value);
          }}
          className={classes.form_selection_value}
          variant="standard"
        >
          {context.zones.length === 0 && (
            <MenuItem>
              <em>No Zones available</em>
            </MenuItem>
          )}
          {context.zones.map((zone: Zone) => (
            <MenuItem
              key={zone.zone_id}
              value={zone.zone_id}
              className={classes.header_selection_menu_item}
            >
              {zone.zone_fqgn}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ZoneSelect;
