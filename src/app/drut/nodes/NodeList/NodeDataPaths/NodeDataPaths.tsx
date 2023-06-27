import React, { useContext } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import NodeDataPathContent from "./Components/NodeDataPathContent";
import OpticalPowerValuesPopUp from "./Components/OpticalPowerValues-Popup";
import NodeDataPathContext from "./Store/NodeDataPath-Context";
import type { NodeDataPathType } from "./Store/NodeDataPathType";

const NodeDataPaths = ({
  nodeId = null,
  isRefreshAction = false,
  isRefreshInProgress = false,
  isNodesPage = null,
}: {
  nodeId?: string | null;
  isRefreshAction?: boolean;
  isRefreshInProgress?: boolean;
  isNodesPage?: boolean | null;
}): JSX.Element => {
  const context: NodeDataPathType = useContext(NodeDataPathContext);
  context.setNodeId(nodeId);
  context.setIsRefreshAction(isRefreshAction);
  context.setIsNodesPage(isNodesPage);
  const errorValue = context.error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification
          onDismiss={() => context.setError("")}
          inline
          severity="negative"
        >
          {errorValue}
        </Notification>
      )}
      {(context.loading || isRefreshInProgress) && (
        <Notification inline severity="information">
          <Spinner text={"Loading Datapaths..."} />
        </Notification>
      )}
      {context.switchPortToViewOpticalPower && <OpticalPowerValuesPopUp />}
      {context.dataPaths && context.dataPaths.length > 0 ? (
        <NodeDataPathContent />
      ) : (
        <>
          {!context.loading && (
            <div>
              <span>Datapath Information not available.</span>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default NodeDataPaths;
