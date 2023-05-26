import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type Props = {
  onResourceBlockTypeSelection: any;
  hasDownStreamPorts: boolean;
  hasCheckedItems: boolean;
};

export default function NestedList(props: Props): JSX.Element {
  const [open, setOpen] = React.useState(
    !props.hasCheckedItems && props.hasDownStreamPorts
  );

  const handleClick = () => {
    if (!props.hasDownStreamPorts || props.hasCheckedItems) {
      return;
    }
    setOpen(!open);
  };

  const resourceBlockTypes: string[] = ["Offload", "Network", "Storage", "DPU"];

  const handleResourceBlockTypeSelection = (resourceBlockType: string) => {
    props.onResourceBlockTypeSelection(resourceBlockType);
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Attach" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {resourceBlockTypes.map((resourceBlockType) => {
            return (
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() =>
                  handleResourceBlockTypeSelection(resourceBlockType)
                }
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary={resourceBlockType} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}
