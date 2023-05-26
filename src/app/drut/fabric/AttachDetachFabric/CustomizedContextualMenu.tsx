import * as React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";

import classess from "./AttachDetachFabric.module.css";
import NestedList from "./TakeActionList";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  onRefresh: any;
  onDetach: any;
  onResourceBlockTypeSelection: any;
  hasCheckedItems: boolean;
  hasDownStreamPorts: boolean;
  isMachinesPage: boolean;
  isResourceBlocksTab: boolean;
  hasResourceBlocks: boolean;
};

export default function CustomizedMenus(props: Props): JSX.Element {
  const StyledMenu = styled((props: any) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        pointerEvents: `auto`,
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    if (!props.hasCheckedItems) {
      props.onRefresh();
      handleClose();
    }
  };

  const handleDetach = () => {
    if (props.hasCheckedItems) {
      props.onDetach();
      handleClose();
    }
  };

  const handleResourceBlockTypeSelection = (resourceBlockType: string) => {
    if (!props.hasCheckedItems) {
      props.onResourceBlockTypeSelection(resourceBlockType);
      handleClose();
    }
  };

  return (
    <div>
      <Button
        className="p-button--positive"
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Take Action
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {props.isResourceBlocksTab && (
          <>
            <CustomizedTooltip
              title={
                !props.hasDownStreamPorts && !props.hasCheckedItems
                  ? "There are no free downstream ports available to perform Attach operation."
                  : ""
              }
            >
              <MenuItem
                disabled={!props.hasDownStreamPorts || props.hasCheckedItems}
                disableRipple
                className={classess["attach_action_list_menu"]}
              >
                <NestedList
                  onResourceBlockTypeSelection={(resourceBlockType: string) =>
                    handleResourceBlockTypeSelection(resourceBlockType)
                  }
                  hasDownStreamPorts={props.hasDownStreamPorts}
                  hasCheckedItems={props.hasCheckedItems}
                ></NestedList>
              </MenuItem>
            </CustomizedTooltip>

            <CustomizedTooltip
              title={
                !props.hasResourceBlocks
                  ? "There are no Resource Blocks to perform Detach operation."
                  : props.hasCheckedItems
                  ? ""
                  : "Please select a Resource Block to perform Detach operation."
              }
            >
              <MenuItem
                onClick={handleDetach}
                disableRipple
                disabled={!props.hasCheckedItems}
              >
                Detach
              </MenuItem>
            </CustomizedTooltip>

            <Divider sx={{ my: 0.5 }} />
          </>
        )}
        {props.isMachinesPage && (
          <MenuItem
            onClick={handleRefresh}
            disableRipple
            disabled={props.hasCheckedItems}
          >
            <RefreshIcon />
            Refresh
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}
