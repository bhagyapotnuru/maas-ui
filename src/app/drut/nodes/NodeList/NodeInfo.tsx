import { useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import { useParams } from "react-router-dom";

import DataPathTabs from "./DataPathTabs";
import NodeEventLog from "./NodeEventsLog";
import NodeSummary from "./NodeSummary";

import { fetchData, postData } from "app/drut/config";
import AttachDetachFabricElement from "app/drut/fabric/AttachDetachFabric";

type Props = {
  tabId: string;
  onNodeDetail: (value: any) => void;
  refresh: boolean;
  toggleRefresh: () => void;
  isUserOperation: boolean;
  isDataPathOrdersTab: (val: boolean) => void;
};

const NodeInfo = (props: Props): JSX.Element => {
  const abortController = new AbortController();
  const [isRefreshInProgress, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelNode] = useState(null);
  const [error, setError] = useState("");
  const [notFoundError, setNotFoundError] = useState("");

  const parms: any = useParams();

  useEffect(() => {
    if (props.isUserOperation) {
      props.refresh ? forceRefresh() : getNodeDetails();
    }
  }, [props.refresh, props.isUserOperation]);

  useEffect(() => {
    if (!selectedNode) {
      getNodeDetails();
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const forceRefresh = async (id: any = parms.id) => {
    try {
      setIsRefreshing(true);
      await postData(`dfab/nodes/${id}/?op=update_node_cache`);
      props.toggleRefresh();
    } catch (e: any) {
      setError(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getNodeDetails = async (id: any = parms.id) => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `dfab/nodes/${id}/`,
        false,
        abortController.signal
      );
      const composedNodeResponse = await response.json();
      if (response.status === 404) {
        setNotFoundError(composedNodeResponse);
      }
      if (composedNodeResponse !== null && composedNodeResponse !== undefined) {
        setSelNode(composedNodeResponse);
        props.onNodeDetail(composedNodeResponse);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          inline
          severity="negative"
        >
          {error}
        </Notification>
      )}

      {props.tabId === "sum" && (
        <NodeSummary
          isRefreshInProgress={isRefreshInProgress}
          isLoadingInProgress={isLoading}
          onNodeDetail={props.onNodeDetail}
          selectedNode={selectedNode}
          notFoundError={notFoundError}
          onDismissError={() => setError("")}
        />
      )}
      {props.tabId === "dp" && (
        <AttachDetachFabricElement
          isRefreshInProgress={isRefreshInProgress}
          isRefreshAction={props.refresh}
          nodeId={parms.id}
          isMachinesPage={false}
        />
      )}
      {props.tabId === "dpo" && (
        <DataPathTabs
          isRefreshInProgress={isRefreshInProgress}
          isRefreshAction={props.refresh}
          nodeId={parms.id}
          isDataPathOrdersTab={(value: boolean) =>
            props.isDataPathOrdersTab(value)
          }
        />
      )}
      {props.tabId === "log" && <NodeEventLog nodeId={parms.id} />}
    </>
  );
};

export default NodeInfo;
