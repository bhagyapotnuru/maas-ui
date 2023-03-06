// // @ts-nocheck
// import { useEffect, useState } from "react";

// import { Button, Notification } from "@canonical/react-components";
// import Box from "@mui/material/Box";
// import Tab from "@mui/material/Tab";
// import MuiTabs from "@mui/material/Tabs";
// import { styled, ThemeProvider } from "@mui/material/styles";
// import { useParams } from "react-router-dom";

// import DataPathTabs from "./DataPathTabs";
// import NodeEventLog from "./NodeEventsLog";
// import classess from "./NodeList.module.css";
// import NodeSummary from "./NodeSummary";

// import { postData } from "app/drut/config";
// import AttachDetachFabricElement from "app/drut/fabric/AttachDetachFabric";
// import customDrutTheme from "app/utils/Themes/Themes";

// type Props = {
//   tabId: string;
//   onNodeDetail: (value: any) => void;
//   isUserOperation: boolean;
// };

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// const TabPanel = (props: TabPanelProps) => {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`node-details-tabpanel-${index}`}
//       aria-labelledby={`node-details-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }} className={classess.node_details_tab_panel}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

// const a11yProps = (index: number) => {
//   return {
//     id: `node-details-tab-${index}`,
//     "aria-controls": `node-details-tabpanel-${index}`,
//   };
// };

// const Tabs = styled(MuiTabs)(({ theme }) => ({
//   "&.MuiTabs-root .MuiTabs-indicator": {
//     backgroundColor: "currentcolor",
//   },
//   "&.MuiTabs-root .Mui-selected": {
//     backgroundColor: "white",
//   },
//   "&.MuiTabs-root .MuiButtonBase-root": {
//     textTransform: "capitalize",
//   },
// }));

// const NodeDetails = (props: Props): JSX.Element => {
//   const [value, setValue] = useState(0);
//   const [refresh, setRefresh] = useState(false);
//   const [isRefreshInProgress, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const parms: any = useParams();

//   useEffect(() => {
//     if (refresh) {
//       forceRefresh();
//     }
//   }, [refresh]);

//   const toggleRefreshAction = () => {
//     setRefresh((prev: boolean) => !prev);
//   };

//   const forceRefresh = async (id: any = parms.id) => {
//     try {
//       setIsLoading(true);
//       await postData(`dfab/nodes/${id}/?op=update_node_cache`);
//       toggleRefreshAction();
//     } catch (e) {
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <>
//       {error && error.length && (
//         <Notification
//           key={`notification_${Math.random()}`}
//           onDismiss={() => setError("")}
//           inline
//           severity="negative"
//         >
//           {error}
//         </Notification>
//       )}
//       <ThemeProvider theme={customDrutTheme}>
//         <Box sx={{ width: "100%" }}>
//           <Box
//             sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}
//           >
//             <Tabs
//               sx={{ width: "100%" }}
//               value={value}
//               onChange={handleChange}
//               aria-label="node detail tabs"
//               textColor="inherit"
//             >
//               <Tab label="Summary" {...a11yProps(0)} />
//               <Tab label="Resource Blocks" {...a11yProps(1)} />
//               <Tab label="Data Paths" {...a11yProps(2)} />
//               <Tab label="Logs" {...a11yProps(3)} />
//             </Tabs>
//             {
//               <div className={classess.refresh_btn}>
//                 <Button
//                   className="p-button has-icon"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleRefreshAction();
//                   }}
//                 >
//                   <i
//                     className={`p-icon--restart ${classess.refresh_dp_icon}`}
//                   />
//                   <span>Refresh</span>
//                 </Button>
//               </div>
//             }
//           </Box>
//           <TabPanel value={value} index={0}>
//             <NodeSummary
//               isRefreshInProgress={isRefreshInProgress}
//               isLoadingInProgress={isRefreshInProgress}
//               onNodeDetail={props.onNodeDetail}
//               selectedNode={""}
//             />
//           </TabPanel>
//           <TabPanel value={value} index={1}>
//             <AttachDetachFabricElement
//               isRefreshInProgress={isRefreshInProgress}
//               isRefreshAction={refresh}
//               nodeId={parms.id}
//               isMachinesPage={false}
//             />
//           </TabPanel>
//           <TabPanel value={value} index={2}>
//             <DataPathTabs
//               isRefreshInProgress={isRefreshInProgress}
//               isRefreshAction={refresh}
//               nodeId={parms.id}
//             />
//           </TabPanel>
//           <TabPanel value={value} index={3}>
//             <NodeEventLog nodeId={parms.id}></NodeEventLog>
//           </TabPanel>
//         </Box>
//       </ThemeProvider>
//     </>
//   );
// };

// export default NodeDetails;

const NodeDetails = (): JSX.Element => <></>;
export default NodeDetails;
