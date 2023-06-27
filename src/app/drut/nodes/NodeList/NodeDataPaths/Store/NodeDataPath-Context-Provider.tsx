import React, { useEffect, useState } from "react";

import type { DataPath, TargetResourceBlock } from "../Models/DataPath";
import type { SelectedDataPath } from "../Models/SelectedDataPath";
import type { SwitchPortToViewOpticalPower } from "../Models/SwitchPortToViewOpticalPower";

import NodeDataPathContext from "./NodeDataPath-Context";

import { fetchNodeDataPath } from "app/drut/api";

const NodeDataPathContextProvider = ({
  children,
}: {
  children: any;
}): JSX.Element => {
  const [dataPaths, setDataPaths] = useState([] as DataPath[]);
  const [switchPortToViewOpticalPower, setSwitchPortToViewOpticalPower] =
    useState(null as SwitchPortToViewOpticalPower[] | null);
  const [currentDataPath, setCurrentDataPath] = useState(
    null as SelectedDataPath | null
  );
  const [nodeId, setNodeId] = useState(null as string | null);
  const [isNodesPage, setIsNodesPage] = useState(null as boolean | null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshAction, setIsRefreshAction] = useState(false);

  const abortController = new AbortController();

  useEffect(() => {
    if (
      typeof isNodesPage === "boolean" &&
      ((nodeId && isNodesPage) || (!nodeId && !isNodesPage)) &&
      !isRefreshAction
    ) {
      fetchNodeDataPaths();
    }
    return () => {
      abortController.abort();
    };
  }, [nodeId, isRefreshAction, isNodesPage]);

  useEffect(() => {
    if (currentDataPath) {
      const targetRB: TargetResourceBlock = currentDataPath.targetRB;
      const switchPortOptics: SwitchPortToViewOpticalPower[] =
        targetRB?.TargetEndpoints.flatMap((tE) => {
          return [
            {
              switch: tE?.Ports?.UpstreamPort?.SwitchId,
              port: tE?.Ports?.UpstreamPort?.PcieSegment,
            },
            {
              switch: currentDataPath?.dataPath?.InitiatorEndpoint?.SwitchId,
              port: tE?.Ports?.ConnectedIficDsPort,
            },
          ];
        });
      setSwitchPortToViewOpticalPower(
        switchPortOptics.filter((v) => v.port && v.switch)
      );
    }
  }, [currentDataPath]);

  const fetchNodeDataPaths = async () => {
    try {
      setLoading(true);
      const response = await fetchNodeDataPath(
        nodeId ? nodeId : "",
        abortController.signal
      );
      if (typeof response !== "string") {
        setDataPaths(nodeId ? [response] : response);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const onOpticalPowerValuePopupCancel = () => {
    setSwitchPortToViewOpticalPower(null);
    setCurrentDataPath(null);
  };

  const onBackDropClickOfOpticalPowerPopUP = () => {
    setSwitchPortToViewOpticalPower(null);
    setCurrentDataPath(null);
  };

  return (
    <NodeDataPathContext.Provider
      value={{
        dataPaths,
        setDataPaths,
        switchPortToViewOpticalPower,
        setSwitchPortToViewOpticalPower,
        onOpticalPowerValuePopupCancel,
        onBackDropClickOfOpticalPowerPopUP,
        currentDataPath,
        setCurrentDataPath,
        setNodeId,
        error,
        loading,
        setError,
        setIsRefreshAction,
        setIsNodesPage,
        nodeId,
        isNodesPage,
      }}
    >
      {children}
    </NodeDataPathContext.Provider>
  );
};
export default NodeDataPathContextProvider;
