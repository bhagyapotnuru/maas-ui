import { useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import { useParams } from "react-router-dom";

import DataPathTabs from "./DataPathTabs";
import NodeEventLog from "./NodeEventsLog";
import NodeSummary from "./NodeSummary";

import { fetchFabricsNodeData, updateNodeCacheById } from "app/drut/api";
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
      await updateNodeCacheById(id);
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
      const composedNodeResponse = await fetchFabricsNodeData(
        id,
        abortController.signal
      );
      if (composedNodeResponse !== null && composedNodeResponse !== undefined) {
        setSelNode(composedNodeResponse);
        props.onNodeDetail(composedNodeResponse);
      }
    } catch (e: any) {
      setNotFoundError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const errorValue = error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
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
