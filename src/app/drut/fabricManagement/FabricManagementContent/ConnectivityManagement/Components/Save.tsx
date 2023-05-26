import Button from "@mui/material/Button";

import classes from "../../../fabricManagement.module.scss";

import type { OpticalSwitch } from "app/drut/fabricManagement/Models/Manager";

const Save = ({
  oxcData,
  loading,
  onClickSave,
}: {
  oxcData: OpticalSwitch[];
  loading: boolean;
  onClickSave: () => void;
}): JSX.Element => {
  const hasNewlyAddedConnections = (oxc: OpticalSwitch) =>
    oxc.ports.some((oxcPort) => oxcPort.connectedPcie?.isNewlyAdded);
  const hasChanges: boolean = oxcData.some(hasNewlyAddedConnections);
  return (
    <div className={classes.save_button}>
      <div>
        <Button
          variant="contained"
          onClick={onClickSave}
          disabled={!hasChanges || loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Save;
