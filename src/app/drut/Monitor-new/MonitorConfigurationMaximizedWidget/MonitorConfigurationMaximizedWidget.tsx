import { useState, useEffect } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListIcon from "@mui/icons-material/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import MonitorGridItem from "../MonitorGridItem/MonitorGridItem";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import type { RootState } from "app/store/root/types";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  monitorConfig: MonitorConfiguration;
  setMaximizedWidget: (value: number) => void;
  maximizedWidget: number;
  groups: group[];
  grouping: string;
};

type group = {
  label: string;
  configs: MonitorConfiguration[];
};

const MonitorConfigurationMaximizedWidget = ({
  monitorConfig,
  setMaximizedWidget,
  maximizedWidget,
  groups,
  grouping,
}: Props): JSX.Element => {
  const [drawer, setDrawer] = useState(true);

  const { items } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  }));

  useEffect(() => {
    setDrawer(true);
  }, [maximizedWidget]);

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div style={{ height: 130 }}></div>
      <DrawerHeader style={{ minHeight: "24px", height: "40px" }}>
        <div>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </DrawerHeader>
      <List>
        {grouping === "none" ? (
          <>
            {items
              .filter((config: MonitorConfiguration) => config.display)
              .map((config: MonitorConfiguration) => (
                <ListItem key={config?.header} disablePadding>
                  <ListItemButton
                    onClick={() => setMaximizedWidget(config?.id)}
                  >
                    <ListItemText
                      primary={config?.header}
                      className={
                        config.id === maximizedWidget
                          ? classes.list_item_bold
                          : classes.list_item
                      }
                      sx={{
                        "&": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </>
        ) : (
          <>
            {groups.map((group) => {
              const { label, configs } = group;
              return (
                <>
                  <ListItem
                    key={`label_${label}`}
                    disablePadding
                    style={{ marginLeft: 15 }}
                  >
                    <ListItemText
                      className={classes.list_item_bold}
                      primary={label[0].toUpperCase() + label.slice(1)}
                      sx={{
                        "&": {
                          color: "#224761",
                        },
                      }}
                    />
                  </ListItem>
                  {configs.map((config: MonitorConfiguration, index) => (
                    <ListItem
                      key={config?.header}
                      disablePadding
                      style={{ marginLeft: 15 }}
                    >
                      <ListItemButton
                        onClick={() => setMaximizedWidget(config?.id)}
                      >
                        <ListItemText
                          primary={config?.header}
                          className={
                            config.id === maximizedWidget
                              ? classes.list_item_bold
                              : classes.list_item
                          }
                          sx={{
                            "&": {
                              color: "#1976d2",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider component="li" />
                </>
              );
            })}
          </>
        )}
      </List>
    </Box>
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawer(open);
    };

  return (
    <div className={classes.maximized_widget_content}>
      <div className={classes.block1}>
        <div>
          <MonitorGridItem
            configData={monitorConfig}
            onMinimizeWidget={() => setMaximizedWidget(0)}
          />
        </div>
      </div>
      <div className={classes.block2}>
        {drawer ? (
          <>
            <Drawer
              anchor={"right"}
              open={drawer}
              variant={"persistent"}
              className={classes.monitor_widget_minimize_drawer}
              onClose={toggleDrawer(false)}
              style={{ height: 560, overflowY: "auto" }}
            >
              {list()}
            </Drawer>
          </>
        ) : (
          <CustomizedTooltip title={`Menu`}>
            <IconButton
              aria-label="open_new"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                setDrawer(true);
              }}
              style={{ position: "absolute", right: 0 }}
            >
              <ListIcon />
            </IconButton>
          </CustomizedTooltip>
        )}
      </div>
    </div>
  );
};
export default MonitorConfigurationMaximizedWidget;
