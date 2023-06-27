import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import classes from "../../../fabricManagement.module.scss";
import type { ZoneSelectionProps } from "../types";

import type { ZoneObj as Zone } from "app/store/drut/managers/types";

const ZoneSelect = ({
  zones = [],
  selectedZone,
  setSelectedZone,
}: ZoneSelectionProps): JSX.Element => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <InputLabel id="zone-select">Zone</InputLabel>
      <Select
        labelId="zone-select"
        id="zone-select"
        label=""
        value={`${selectedZone}`}
        onChange={(e: SelectChangeEvent<string>) => {
          setSelectedZone(e.target.value);
        }}
        className={classes.select_value}
        variant="standard"
      >
        {zones.length === 0 && (
          <MenuItem>
            <em>No Zones available</em>
          </MenuItem>
        )}
        {zones.map((zone: Zone) => (
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
  );
};

export default ZoneSelect;
