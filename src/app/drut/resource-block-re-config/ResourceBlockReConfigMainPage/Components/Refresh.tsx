import { useContext } from "react";

import { Spinner } from "@canonical/react-components";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";

import type { ReConfigType } from "../../Store/ResourceBlockReConfigType";
import ResoruceBlockReConfigContext from "../../Store/resource-block-re-config-context";
import classes from "../../resource-block-re-config.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const Refresh = (): JSX.Element => {
  const context: ReConfigType = useContext(ResoruceBlockReConfigContext);
  return (
    <>
      {context.refreshing ? (
        <>
          <Spinner
            style={{ padding: 0, margin: 0 }}
            text={`Refreshing...`}
          ></Spinner>
        </>
      ) : (
        <CustomizedTooltip title={`Refresh`}>
          <div className={`${classes.light_btn} ${classes.refresh_button}`}>
            <IconButton
              disabled={context.refreshing}
              onClick={(e) => {
                e.preventDefault();
                context.refresh();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </CustomizedTooltip>
      )}
    </>
  );
};

export default Refresh;
