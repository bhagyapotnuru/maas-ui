import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import MonitorConfigurationListControls from "./MonitorConfigurationListControls";
import MonitorConfigurationTable from "./MonitorConfigurationTable";

import { deleteConfig, actions } from "app/store/drut/monitor/slice";
import type { RootState } from "app/store/root/types";
import DeleteConfirmationModal from "app/utils/Modals/DeleteConfirmationModal";

type Props = {
  updateMonitorConfigurationFunctionality: (
    value: MonitorConfiguration
  ) => void;
  setFetchConfigurations: (value: boolean) => void;
  selectedIDs: number[];
  setSelectedIDs: (selectedId: number[]) => void;
};
const MonitorConfigurationList = ({
  updateMonitorConfigurationFunctionality,
  setFetchConfigurations,
  selectedIDs,
  setSelectedIDs,
}: Props): JSX.Element => {
  const { items, loading, errors } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const [configToDelete, setConfigToDelete] = useState(
    {} as MonitorConfiguration | null | undefined
  );
  const [configResponse, setConfigResponse] = useState(
    [] as MonitorConfiguration[]
  );
  const [configResponseCopy, setConfigResponseCopy] = useState(
    [] as MonitorConfiguration[]
  );
  const [hiddenGroups, setHiddenGroups] = useState([] as string[]);
  const [grouping, setGrouping] = useState("none");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("none");

  const dispatch = useDispatch();

  const deleteConfiguration = async () => {
    dispatch(deleteConfig(configToDelete?.id));
    setConfigToDelete(null);
    setFetchConfigurations(true);
  };

  const onConfirmHandler = () => {
    deleteConfiguration();
  };

  const onBackDropClickHandler = () => {
    setConfigToDelete(null);
  };

  const onCancelHandler = () => {
    setConfigToDelete(null);
  };

  useEffect(() => {
    if (searchText === "" && filter === "none") {
      setConfigResponse(configResponseCopy);
    } else {
      let filteredConfigs = ((configResponseCopy as []) || []).filter(
        (row: any) =>
          Object.values(row)
            .join("")
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
      switch (filter) {
        case "none":
          break;
        default:
          filteredConfigs = filteredConfigs.filter(
            (config: MonitorConfiguration) =>
              config?.cluster_type.toLowerCase() === filter.toLowerCase()
          );
          break;
      }
      setConfigResponse(filteredConfigs);
    }
  }, [filter, searchText]);

  useEffect(() => {
    setConfigResponseCopy(items);
    setConfigResponse(items);
  }, [items]);

  return (
    <>
      {configToDelete && configToDelete.id && (
        <DeleteConfirmationModal
          title="Delete Confirmation"
          message={`
          The "${configToDelete.cluster_type}" configuration "${configToDelete.header} " 
          will be deleted permanently. Are you sure ?`}
          onConfirm={onConfirmHandler}
          onClickBackDrop={onBackDropClickHandler}
          onClickCancel={onCancelHandler}
        />
      )}
      {errors && errors.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => dispatch(actions.clearError())}
          inline
          severity="negative"
        >
          {errors}
        </Notification>
      )}
      {loading && (
        <Notification inline severity="information">
          <Spinner text={"Loading..."} />
        </Notification>
      )}
      {!loading && (
        <>
          <MonitorConfigurationListControls
            setGrouping={setGrouping}
            grouping={grouping}
            setSearchText={setSearchText}
            searchText={searchText}
            setFilter={setFilter}
            filter={filter}
          />
          <MonitorConfigurationTable
            monitorConfigs={configResponse}
            grouping={grouping}
            selectedIDs={selectedIDs}
            setSelectedIDs={setSelectedIDs}
            hiddenGroups={hiddenGroups}
            setHiddenGroups={setHiddenGroups}
            updateMonitorConfigurationFunctionality={
              updateMonitorConfigurationFunctionality
            }
            setConfigToDelete={setConfigToDelete}
          />
        </>
      )}
    </>
  );
};

export default MonitorConfigurationList;
