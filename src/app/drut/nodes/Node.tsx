import { useState } from "react";

import { Route, Switch } from "react-router-dom";

import NodeList from "./NodeList";
// import NodeDetails from "./NodeList/NodeDetails";
import NodeInfo from "./NodeList/NodeInfo";
import classess from "./NodeList/NodeList.module.css";
import NodeHeader from "./NodesHeader";
import nodeUrl from "./url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

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
          key="nodehSecetion"
          header={
            <NodeHeader
              node_data={node}
              onClickTab={onclickTab}
              isListView={true}
            />
          }
        >
          <NodeList dataId={tabId} page="list" onNodeDetail={nodeDetails} />
        </Section>
      </Route>
      <Route exact path={nodeUrl.nodes.nodeDetails(null, true)}>
        <Section
          className={`u-no-padding--bottom ${classess.node_details_tab}`}
          key="nodeSection"
          header={
            <NodeHeader
              node_data={node}
              onClickTab={onclickTab}
              isListView={false}
              onClickRefresh={toggleRefreshAction}
              isUserAction={toggleUserAction}
              isDataPathOrdersTab={isDataPathOrdersTab}
            />
          }
        >
          <NodeInfo
            isDataPathOrdersTab={setIsDataPathOrdersTab}
            tabId={tabId}
            onNodeDetail={nodeDetails}
            refresh={refresh}
            toggleRefresh={() => {
              toggleRefreshAction();
              toggleUserAction();
            }}
            isUserOperation={isUserOperation}
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
