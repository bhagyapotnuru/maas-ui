import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import classes from "../../../fabricManagement.module.scss";
import type { Rack } from "../../Managers/AddManager/type";
import type { IFicPoolSelectionProps } from "../types";

const IFicPoolSelect = ({
  iFicPools = [],
  selectedIFicPool,
  selectedZone,
  setSelectedIFicPool,
}: IFicPoolSelectionProps): JSX.Element => {
  return (
    <FormControl
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      size="small"
      variant="standard"
    >
      <InputLabel id="ific-pool-select">Pool</InputLabel>
      <Select
        labelId="ific-pool-select"
        id="ific-pool-select"
        value={`${selectedIFicPool}`}
        label={`IFIC Pool`}
        autoFocus={false}
        onChange={(e: SelectChangeEvent<string>) =>
          setSelectedIFicPool(e.target.value)
        }
        className={classes.select_value}
        variant="standard"
      >
        {iFicPools.length === 0 && selectedZone && (
          <MenuItem value="">
            <em>No Pools available for the selected zone</em>
          </MenuItem>
        )}
        {iFicPools.map((ificPool: Rack) => (
          <MenuItem
            key={`${ificPool.rack_id}`}
            value={ificPool.rack_id}
            className={classes.header_selection_menu_item}
          >
            {ificPool.rack_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default IFicPoolSelect;
