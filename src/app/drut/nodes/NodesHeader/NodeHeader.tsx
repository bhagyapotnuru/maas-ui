import { useEffect, useState } from "react";

import { Button, Tooltip, Icon } from "@canonical/react-components";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

import classess from "../NodeList/NodeList.module.css";

import SectionHeader from "app/base/components/SectionHeader";

type Props = {
  node_data: any;
  onRefreshNode?: any;
  onClickTab: any;
  isListView: boolean;
  onClickRefresh?: any;
  isUserAction?: any;
  isDataPathOrdersTab?: boolean;
};

const NodeHeader = ({
  node_data,
  onClickTab,
  isListView,
  onClickRefresh,
  isUserAction,
  isDataPathOrdersTab,
}: Props): JSX.Element => {
  const history = createBrowserHistory();
  const [node, setNode]: [any, any] = useState(null);
  const [selectedTabId, setSelectedTabId] = useState("sum");
  const tabIdsToRefresh: string[] = ["sum", "dp", "dpo"];

  const [tabs, setTabs] = useState([
    {
      active: false,
      id: "sum",
      label: "Summary",
      onClick: () => getDetails("sum"),
    },
    {
      active: false,
      id: "dp",
      label: "Resource Blocks",
      onClick: () => getDetails("dp"),
    },
    {
      active: false,
      id: "dpo",
      label: "Data Paths",
      onClick: () => getDetails("dpo"),
    },
    {
      active: false,
      id: "log",
      label: "Logs",
      onClick: () => getDetails("log"),
    },
  ]);

  const getDetails = (id: any) => {
    onClickTab(id);
    setSelectedTabId(id);
    const data: any = [];
    tabs.forEach((tab: any) => {
      tab.active = false;
      if (tab.id === id) {
        tab.active = true;
      }
      data.push(tab);
    });
    setTabs(data);
  };

  const nodesInfo = () => {
    // getDetails("sum");
    history.push("../nodes");
  };

  useEffect(() => {
    getDetails("sum");
  }, []);

  useEffect(() => {
    setNode(node_data);
  }, [node_data]);

  const getHeaderButtons = (node: any) => {
    return [
      (node || !isListView) && (
        <Button key="back-to-nodes" onClick={() => nodesInfo()}>
          Node List
        </Button>
      ),
      <Button element={Link} key="node-list" to="/drut-cdi/compose-node">
        Compose Node
      </Button>,
      tabIdsToRefresh.includes(selectedTabId) &&
        !isDataPathOrdersTab &&
        !isListView && (
          <Button
            className="p-button has-icon"
            key="refresh-node"
            onClick={() => {
              onClickRefresh();
              isUserAction();
            }}
          >
            <i className={`p-icon--restart ${classess.refresh_dp_icon}`} />
            <span>Refresh</span>
          </Button>
        ),
    ];
  };

  return (
    <>
      <SectionHeader
        buttons={getHeaderButtons(node)}
        key="nodeHeades"
        subtitle={
          isListView ? (
            "Composed nodes"
          ) : (
            <Tooltip
              className="u-nudge-left--small"
              message="Node power status"
              position="btm-left"
            >
              <Icon
                name={node?.PowerState === "On" ? "power-on" : "power-off"}
              />
              {node?.PowerState === "On" ? " Power On" : " Power Off"}
            </Tooltip>
          )
        }
        tabLinks={isListView ? [] : tabs}
        title={
          isListView ? "Node List" : `Details of Node : ${node?.Name || ""}`
        }
      />
    </>
  );
};

export default NodeHeader;
