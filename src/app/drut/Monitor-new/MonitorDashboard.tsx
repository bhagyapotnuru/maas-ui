import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import MonitorConfigurationMaximizedWidget from "./MonitorConfigurationMaximizedWidget/MonitorConfigurationMaximizedWidget";
import MonitorDashboardCardContent from "./MonitorDashboardCardContent/MonitorDashboardCardContent";
import MonitorDashboardGroupContent from "./MonitorDashboardCardContent/MonitorDashboardGroupContent";
import type { MonitorConfiguration } from "./Types/MonitorConfiguration";

import { actions } from "app/store/drut/monitor/slice";
import type { RootState } from "app/store/root/types";
import { groupAsMap } from "app/utils";

type group = {
  label: string;
  configs: MonitorConfiguration[];
};

const MonitorDashboard = ({ grouping }: { grouping: string }): JSX.Element => {
  const { items, loading, errors } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const configResponse = items.filter(
    (config: MonitorConfiguration) => config.display
  );
  const [maximizedWidget, setMaximizedWidget] = useState(0);
  const [groups, setGroups] = useState([] as group[]);

  const dispatch = useDispatch();

  useEffect(() => {
    let groupData = [] as group[];
    if (grouping === "pool") {
      const groupMap = groupAsMap(
        configResponse,
        (config) => config?.applicationpool
      );
      groupData = Array.from(groupMap).map(([label, configs]) => ({
        label: label?.toString() || "No pool",
        configs,
      }));
    }
    if (grouping === "type") {
      const groupMap = groupAsMap(
        configResponse,
        (config) => config.cluster_type
      );
      groupData = Array.from(groupMap).map(([label, configs]) => ({
        label: label?.toString(),
        configs,
      }));
    }
    setGroups(groupData);
  }, [grouping]);

  return (
    <>
      {!loading &&
        (!configResponse ||
          configResponse.length === 0 ||
          configResponse.every(
            (config: MonitorConfiguration) => !config.display
          )) && (
          <div>
            <p>No Monitor Configurations to Display</p>
          </div>
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
          {maximizedWidget !== 0 && (
            <>
              <MonitorConfigurationMaximizedWidget
                monitorConfig={
                  items.filter(
                    (config: MonitorConfiguration) =>
                      config.id === maximizedWidget
                  )[0]
                }
                groups={groups}
                setMaximizedWidget={setMaximizedWidget}
                maximizedWidget={maximizedWidget}
                grouping={grouping}
              />
            </>
          )}
          {maximizedWidget === 0 &&
            (grouping === "none" ? (
              <MonitorDashboardCardContent
                setMaximizedWidget={setMaximizedWidget}
                configResponse={items}
              />
            ) : (
              <MonitorDashboardGroupContent
                setMaximizedWidget={setMaximizedWidget}
                groups={groups}
              />
            ))}
        </>
      )}
    </>
  );
};

export default MonitorDashboard;
