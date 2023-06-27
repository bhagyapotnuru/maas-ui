import * as React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import { styled, ThemeProvider } from "@mui/material/styles";

import DataPathOrderDetails from "./DataPathOrderDetails";
import NodeDataPaths from "./NodeDataPaths/NodeDataPaths";
import NodeDataPathContextProvider from "./NodeDataPaths/Store/NodeDataPath-Context-Provider";
import classess from "./NodeList.module.css";

import { COLOURS } from "app/base/constants";
import customDrutTheme from "app/utils/Themes/Themes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Props {
  nodeId: string;
  isRefreshAction: boolean;
  isRefreshInProgress: boolean;
  isDataPathOrdersTab: (val: boolean) => void;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`datapath-tabpanel-${index}`}
      aria-labelledby={`datapath-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} className={classess.datapath_tab_panel}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `datapath-tab-${index}`,
    "aria-controls": `datapath-tabpanel-${index}`,
  };
};

const Tabs = styled(MuiTabs)(({ theme }) => ({
  "&.MuiTabs-root .MuiTabs-indicator": {
    backgroundColor: "currentcolor",
  },
  "&.MuiTabs-root .Mui-selected": {
    backgroundColor: COLOURS.BG_WHITE,
  },
  "&.MuiTabs-root .MuiButtonBase-root": {
    textTransform: "capitalize",
  },
}));

export default function DataPathTabs(props: Props): JSX.Element {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.isDataPathOrdersTab(newValue === 1);
  };

  return (
    <ThemeProvider theme={customDrutTheme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
          <Tabs
            sx={{ width: "100%" }}
            value={value}
            onChange={handleChange}
            aria-label="data path tabs"
            textColor="inherit"
          >
            <Tab label="Data Path List" {...a11yProps(0)} />
            <Tab label="Data Path Orders" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <NodeDataPathContextProvider>
            <NodeDataPaths
              nodeId={props.nodeId}
              isRefreshAction={props.isRefreshAction}
              isRefreshInProgress={props.isRefreshInProgress}
              isNodesPage={true}
            />
          </NodeDataPathContextProvider>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DataPathOrderDetails nodeId={props.nodeId} />
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
}
