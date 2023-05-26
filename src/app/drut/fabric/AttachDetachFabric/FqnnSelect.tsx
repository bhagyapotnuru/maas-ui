import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import classes from "../../compose-node/composedNode.module.scss";

const FqnnSelect = ({
  selectedFqnn,
  setFqnn,
  uniqueFqnn,
}: {
  selectedFqnn: string;
  setFqnn: (value: any) => void;
  uniqueFqnn: Array<string>;
}): JSX.Element => {
  return (
    <>
      <div className={classes.fic_block}>
        <span style={{ alignSelf: "center" }}>
          <strong>FQNN &#58;</strong>
        </span>
        <Autocomplete
          disableClearable
          id="fqnn-select"
          options={uniqueFqnn}
          sx={{ width: 400 }}
          value={selectedFqnn}
          renderInput={(params: AutocompleteRenderInputParams) => {
            return (
              <TextField
                {...params}
                placeholder="Select Fqnn"
                variant="standard"
              />
            );
          }}
          onChange={(e, option: any) => {
            setFqnn((prev: any) => ({ ...prev, selectedFqnn: option.value }));
          }}
          className={classes.autocomplete}
          componentsProps={{ popper: { style: { width: "fit-content" } } }}
        />
      </div>
    </>
  );
};

export default FqnnSelect;
