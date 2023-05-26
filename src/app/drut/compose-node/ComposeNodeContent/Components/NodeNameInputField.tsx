import TextField from "@mui/material/TextField";

import classes from "../../composedNode.module.scss";

const NodeNameInputField = ({
  enteredNodeName,
  setEnteredNodeName,
}: {
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
}): JSX.Element => {
  return (
    <TextField
      className={classes.input_field}
      required
      id="standard-required"
      label=""
      defaultValue=""
      placeholder="Node Name"
      variant="standard"
      value={enteredNodeName}
      onChange={(e) => {
        if (e.target.value.startsWith(" ")) {
          return;
        }
        setEnteredNodeName(e.target.value);
      }}
    />
  );
};

export default NodeNameInputField;
