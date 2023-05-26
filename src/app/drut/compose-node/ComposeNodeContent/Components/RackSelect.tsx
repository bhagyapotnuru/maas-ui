import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import classes from "../../composedNode.module.scss";

import type { Rack } from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

const RackSelect = ({
  selectedRack,
  setSelectedRack,
  racks,
}: {
  selectedRack: string;
  setSelectedRack: (value: string) => void;
  racks: Rack[];
}): JSX.Element => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <Select
        placeholder="Select Pool"
        id="rack-select"
        label=""
        value={`${selectedRack}`}
        onChange={(e: SelectChangeEvent<string>) => {
          setSelectedRack(e.target.value);
        }}
        className={classes.select_value}
        variant="standard"
      >
        {racks.length === 0 ? (
          <MenuItem>
            <em>No Pools available</em>
          </MenuItem>
        ) : (
          [{ rack_id: 0, rack_name: "All", rack_fqgn: "All" }, ...racks].map(
            (rack: Rack) => (
              <MenuItem
                key={rack.rack_id}
                value={rack.rack_id}
                className={classes.header_selection_menu_item}
              >
                {rack.rack_name}
              </MenuItem>
            )
          )
        )}
      </Select>
    </FormControl>
  );
};

export default RackSelect;
