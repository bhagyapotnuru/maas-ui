import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { fetchData } from "app/drut/config";
import DataPathInfo from "app/drut/fabric/FabricDataPath/DataPathInfo";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  nodeId: any;
  isRefreshAction: boolean;
  isRefreshInProgress: boolean;
};

const DataPaths = (props: Props): JSX.Element => {
  const { id } = useParams<any>();
  const machine: any = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const [dataPath, setDataPath]: [any, any] = useState(null);
  const isEmpty = (str: any = "") => !str || str.length === 0;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!props.isRefreshAction) {
      fetchDataPaths();
    }
  }, [props.isRefreshAction]);

  const fetchDataPaths = () => {
    if ((machine && !isEmpty(machine?.dfab_node_id)) || props.nodeId) {
      getNodeDatapath(props.nodeId || machine?.dfab_node_id);
    } else {
      setLoading(false);
    }
  };

  const getNodeDatapath = async (id: any) => {
    try {
      setLoading(true);
      const response = await fetchData(`dfab/nodes/${id}/?op=get_data_path`);
      const datpathData = await response.json();
      setDataPath(datpathData);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {(loading || props.isRefreshInProgress) && (
        <Notification inline severity="information">
          <Spinner text={loading ? "Loading..." : "Refreshing..."} />
        </Notification>
      )}
      {!loading && !props.isRefreshInProgress && dataPath && (
        <div>
          <DataPathInfo data={dataPath} isList={false}></DataPathInfo>
        </div>
      )}
    </>
  );
};

export default DataPaths;
