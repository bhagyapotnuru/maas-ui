import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import { createOrUpdateMonitorConfigurations } from "../api";
import { partition } from "../utils";

import ManageConfiguration from "./ManageConfiguration/ManageConfiguration";
import MinimizedMonitor from "./MonitorGridLayout/MinimizedMonitor";
import MonitorGridLayout from "./MonitorGridLayout/MonitorGridLayout";
import type { MonitorConfiguration } from "./Types/MonitorConfiguration";

import { fetchMonitorConfigurationList } from "app/drut/api";

const MonitorDashboard = ({
  showConfigModal,
  toggleConfigModal,
}: {
  showConfigModal: boolean;
  toggleConfigModal: () => void;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [configResponse, setConfigResponse] = useState(
    [] as MonitorConfiguration[]
  );
  const [minimizedConfigResponse, setMinimizedConfigResponse] = useState(
    [] as MonitorConfiguration[]
  );
  const [nonMinimizedConfigResponse, setNonMinimizedConfigResponse] = useState(
    [] as MonitorConfiguration[]
  );
  const abortController = new AbortController();

  useEffect(() => {
    fetchConfigurationList();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    updateMinimizedConfig();
  }, [configResponse]);

  const updateMinimizedConfig = () => {
    const [minimized, nonMinimized] = partition(
      configResponse,
      (response: any) => response.minimize
    );
    setMinimizedConfigResponse(minimized);
    setNonMinimizedConfigResponse(nonMinimized);
  };

  const fetchConfigurationList = async () => {
    try {
      setIsLoading(true);
      const configResponse: MonitorConfiguration[] =
        await fetchMonitorConfigurationList(abortController.signal);
      setConfigResponse(configResponse);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfiguration = async (updatedConfig: MonitorConfiguration) => {
    try {
      const params = `${updatedConfig.id}/`;
      await createOrUpdateMonitorConfigurations(
        params,
        updatedConfig,
        !!updatedConfig.id
      );
      setConfigResponse((prev: MonitorConfiguration[]) => {
        const configToUpdateIndex: number = prev.findIndex(
          (config: MonitorConfiguration) => config.id === updatedConfig.id
        );
        if (configToUpdateIndex !== -1) {
          prev.splice(configToUpdateIndex, 1, updatedConfig);
        }
        return [...prev];
      });
    } catch (e) {
    } finally {
    }
  };

  const onRemoveWidgetHandler = async (configId: number) => {
    const configViewToClose: MonitorConfiguration | undefined =
      configResponse.find(
        (config: MonitorConfiguration) => config.id === configId
      );
    if (configViewToClose) {
      configViewToClose.display = false;
      if (configViewToClose.minimize) {
        configViewToClose.minimize = !configViewToClose.minimize;
      }
      updateConfiguration(configViewToClose);
    }
  };

  const onMinimizeWidgetHandler = async (configId: number) => {
    const configViewToMinimize: MonitorConfiguration | undefined =
      configResponse.find(
        (config: MonitorConfiguration) => config.id === configId
      );
    if (configViewToMinimize) {
      configViewToMinimize.minimize = !configViewToMinimize.minimize;
      updateConfiguration(configViewToMinimize);
    }
  };

  const onPinWidgetHandler = async (configId: number) => {
    const configViewToPin: MonitorConfiguration | undefined =
      configResponse.find(
        (config: MonitorConfiguration) => config.id === configId
      );
    if (configViewToPin) {
      configViewToPin.pinned = !configViewToPin.gridlayout.static;
      configViewToPin.gridlayout.static = !configViewToPin.gridlayout.static;
      updateConfiguration(configViewToPin);
    }
  };

  const onConfirmHandler = (updatedClusters: MonitorConfiguration[]) => {
    toggleConfigModal();
    setConfigResponse(updatedClusters);
  };

  const onBackDropClickHandler = () => {
    toggleConfigModal();
  };

  const onCancelHandler = () => {
    toggleConfigModal();
  };

  return (
    <>
      {showConfigModal && (
        <ManageConfiguration
          onConfirm={onConfirmHandler}
          onClickBackDrop={onBackDropClickHandler}
          onClickCancel={onCancelHandler}
          configurations={configResponse}
        />
      )}
      {!isLoading &&
        (!configResponse ||
          configResponse.length === 0 ||
          configResponse.every(
            (config: MonitorConfiguration) => !config.display
          )) && (
          <div>
            <p>No Monitor Configurations to Display</p>
          </div>
        )}
      {isLoading && (
        <Notification inline severity="information">
          <Spinner text={"Loading..."} />
        </Notification>
      )}
      {!isLoading &&
        nonMinimizedConfigResponse &&
        nonMinimizedConfigResponse.length > 0 && (
          <MonitorGridLayout
            configData={nonMinimizedConfigResponse}
            onRemoveWidget={onRemoveWidgetHandler}
            onPinWidgetHandler={onPinWidgetHandler}
            onMinimizeWidget={onMinimizeWidgetHandler}
          />
        )}
      {!isLoading &&
        minimizedConfigResponse &&
        minimizedConfigResponse.length > 0 && (
          <>
            <MinimizedMonitor
              key={`Minimize_${Math.random()}`}
              configData={minimizedConfigResponse}
              onMaximizeWidget={onMinimizeWidgetHandler}
            />
          </>
        )}
    </>
  );
};

export default MonitorDashboard;
