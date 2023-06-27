import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import classes from "../../../fabricManagement.module.scss";
import type { TFicPoolSelectionProps } from "../types";

import type { Rack } from "app/store/drut/managers/types";

const TFicPoolSelect = ({
  tFicPools = [],
  selectedTFicPool,
  setSelectedTFicPool,
  selectedZone,
}: TFicPoolSelectionProps): JSX.Element => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <InputLabel id="tfic-pool-select">Pool</InputLabel>
      <Select
        variant="standard"
        labelId="tfic-pool-select"
        id="tfic-pool-select"
        value={`${selectedTFicPool}`}
        label={`TFIC Pool`}
        className={classes.select_value}
        onChange={(e: SelectChangeEvent<string>) =>
          setSelectedTFicPool(e.target.value)
        }
      >
        {tFicPools.length === 0 && selectedZone && (
          <MenuItem value="">
            <em>No Pools available for the selected zone</em>
          </MenuItem>
        )}
        {tFicPools.map((tficPool: Rack) => (
          <MenuItem
            key={`${tficPool.rack_id}`}
            value={tficPool.rack_id}
            className={classes.header_selection_menu_item}
          >
            {tficPool.rack_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TFicPoolSelect;
