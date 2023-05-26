import { useState, useEffect } from "react";

import { Button, Select } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";

import MonitorConfigurationHeader from "./MonitorConfigurationHeader/MonitorConfigurationHeader";
import MonitorConfigurationList from "./MonitorConfigurationList/MonitorConfigurationList";
import MonitorDashboard from "./MonitorDashboard";
import type { MonitorConfiguration } from "./Types/MonitorConfiguration";
import classess from "./monitor.module.scss";
import monitorUrls from "./url";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useWindowTitle } from "app/base/hooks";
import {
  fetcMonitorConfigurations,
  fetchMachinesData,
  // fetchManagers,
  fetchSummary,
  fetchZones,
} from "app/store/drut/monitor/slice";

const Monitor = (): JSX.Element => {
  const [config, setConfig] = useState({} as MonitorConfiguration);
  const [renderAddConfigurationsForm, setRenderAddConfigurationsForm] =
    useState(false);
  const [renderUpdateConfigurationsForm, setRenderUpdateConfigurationsForm] =
    useState(false);
  const [renderSetPoolForm, setRenderSetPoolForm] = useState(false);
  const [fetchConfigurations, setFetchConfigurations] = useState(false);
  const [timeoutId, setTimeoutId] = useState<any>("");
  const [selectedIDs, setSelectedIDs] = useState([] as number[]);
  const [grouping, setGrouping] = useState("none");

  const abortController = new AbortController();
  const machineSummaryController = new AbortController();
  const resourceBlockSummaryController = new AbortController();
  // const managerDataController = new AbortController();
  const zonesController = new AbortController();
  useWindowTitle("Monitor");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetcMonitorConfigurations(abortController.signal));
    setFetchConfigurations(false);
    return () => {
      abortController.abort();
    };
  }, [fetchConfigurations]);

  useEffect(() => {
    // dispatch(fetchManagers(managerDataController.signal));
    dispatch(fetchMachinesData(machineSummaryController.signal));
    dispatch(fetchSummary(resourceBlockSummaryController.signal));
    dispatch(fetchZones(zonesController.signal));
    return () => {
      // managerDataController.abort();
      machineSummaryController.abort();
      zonesController.abort();
      resourceBlockSummaryController.abort();
    };
  }, []);

  const clearHeaderContent = () => {
    if (renderUpdateConfigurationsForm) {
      setRenderUpdateConfigurationsForm(false);
    }
    if (renderAddConfigurationsForm) {
      setRenderAddConfigurationsForm(false);
    }
  };

  useEffect(() => {
    clearTimeout(timeoutId);
  }, [timeoutId]);

  const updateMonitorConfigurationFunctionality = (
    config: MonitorConfiguration
  ) => {
    clearHeaderContent();
    setConfig(config);

    const timeOutId = setTimeout(() => {
      setRenderUpdateConfigurationsForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const addMonitorConfigurationFunctionality = () => {
    clearHeaderContent();

    const timeOutId = setTimeout(() => {
      setRenderAddConfigurationsForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const setManagerToPoolFunctionality = () => {
    clearHeaderContent();

    const timeOutId = setTimeout(() => {
      setRenderSetPoolForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  return (
    <Switch>
      <Route exact path={monitorUrls.monitorDashboard.index}>
        <Section
          key="kubeopsHeader"
          className={`u-no-padding--bottom ${classess.fixed_monitor_header}`}
          header={
            <SectionHeader
              title="Monitor"
              buttonStyle={{ display: "flex", flexDirection: "row" }}
              buttons={[
                <Select
                  key="grouping"
                  options={[
                    {
                      value: "none",
                      label: "No grouping",
                    },
                    {
                      value: "pool",
                      label: "Group by pool",
                    },
                    {
                      value: "type",
                      label: "Group by type",
                    },
                  ]}
                  onClick={(e: any) => {
                    setGrouping(e.target.value);
                  }}
                />,
                <Button
                  element={Link}
                  className="p-button has-icon"
                  to={monitorUrls.monitorDashboardList.index}
                >
                  <i className="p-icon--switcher-environments"></i>
                  <span>Configuration</span>
                </Button>,
              ]}
            />
          }
        >
          <div style={{ marginTop: "4rem" }}></div>
          <MonitorDashboard grouping={grouping} />
        </Section>
      </Route>
      <Route exact path={monitorUrls.monitorDashboardList.index}>
        <Section
          key="kubeopsHeader"
          className="u-no-padding--bottom"
          header={
            <MonitorConfigurationHeader
              renderAddConfigurationsForm={renderAddConfigurationsForm}
              setRenderAddConfigurationsForm={setRenderAddConfigurationsForm}
              addMonitorConfigurationFunctionality={
                addMonitorConfigurationFunctionality
              }
              setRenderUpdateConfigurationsForm={
                setRenderUpdateConfigurationsForm
              }
              renderSetPoolForm={renderSetPoolForm}
              setRenderSetPoolForm={setRenderSetPoolForm}
              setManagerToPoolFunctionality={setManagerToPoolFunctionality}
              setFetchConfigurations={setFetchConfigurations}
              monitorConfigurationToUpdate={config}
              renderUpdateConfigurationsForm={renderUpdateConfigurationsForm}
              selectedIDs={selectedIDs}
            />
          }
        >
          <MonitorConfigurationList
            updateMonitorConfigurationFunctionality={
              updateMonitorConfigurationFunctionality
            }
            setFetchConfigurations={setFetchConfigurations}
            selectedIDs={selectedIDs}
            setSelectedIDs={setSelectedIDs}
          />
        </Section>
      </Route>
    </Switch>
  );
};

export default Monitor;
