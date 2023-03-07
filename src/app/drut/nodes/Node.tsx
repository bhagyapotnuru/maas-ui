import { useState } from "react";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";
import { Route, Switch } from "react-router-dom";

import NodeList from "./NodeList";
// import NodeDetails from "./NodeList/NodeDetails";
import NodeInfo from "./NodeList/NodeInfo";
import classess from "./NodeList/NodeList.module.css";
import NodeHeader from "./NodesHeader";
import nodeUrl from "./url";

const Compose = (): JSX.Element => {
  const [node, setNode] = useState(null);
  const [tabId, setTabId] = useState("sum");
  const [refresh, setRefresh] = useState(false);
  const [isDataPathOrdersTab, setIsDataPathOrdersTab] = useState(false);
  const [isUserOperation, setIsUserOperation] = useState(false);
  const nodeDetails = (node: any) => {
    setNode(node);
  };

  useWindowTitle("MATRIX-Nodes");

  const onclickTab = (id: any) => {
    setTabId(id);
  };

  const toggleRefreshAction = () => {
    setRefresh((prev: boolean) => !prev);
  };

  const toggleUserAction = () => {
    setIsUserOperation((prev: boolean) => !prev);
  };

  return (
    <Switch>
      <Route exact path={nodeUrl.nodes.index}>
        <Section
          className="u-no-padding--bottom"
          header={
            <NodeHeader
              isListView={true}
              node_data={node}
              onClickTab={onclickTab}
            />
          }
          key="nodehSecetion"
        >
          <NodeList dataId={tabId} onNodeDetail={nodeDetails} page="list" />
        </Section>
      </Route>
      <Route exact path={nodeUrl.nodes.nodeDetails(null)}>
        <Section
          className={`u-no-padding--bottom ${classess.node_details_tab}`}
          header={
            <NodeHeader
              isDataPathOrdersTab={isDataPathOrdersTab}
              isListView={false}
              isUserAction={toggleUserAction}
              node_data={node}
              onClickRefresh={toggleRefreshAction}
              onClickTab={onclickTab}
            />
          }
          key="nodeSection"
        >
          <NodeInfo
            isDataPathOrdersTab={setIsDataPathOrdersTab}
            isUserOperation={isUserOperation}
            onNodeDetail={nodeDetails}
            refresh={refresh}
            tabId={tabId}
            toggleRefresh={() => {
              toggleRefreshAction();
              toggleUserAction();
            }}
          ></NodeInfo>
        </Section>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Compose;
