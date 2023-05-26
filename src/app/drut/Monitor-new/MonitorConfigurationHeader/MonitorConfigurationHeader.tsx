import { useEffect } from "react";

import { Button, ContextualMenu } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import ApplicationPoolForm from "../MonitorConfigurationForm/ApplicationPoolForm";
import MonitorConfigurationForm from "../MonitorConfigurationForm/MonitorConfigurationForm";
import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import monitorUrls from "../url";

import SectionHeader from "app/base/components/SectionHeader";
import {
  fetchApplicationPools,
  fetchClusterTypes,
  fetchResourcePools,
  setDisplay,
} from "app/store/drut/monitor/slice";
import type { RootState } from "app/store/root/types";

type Props = {
  renderAddConfigurationsForm: boolean;
  renderUpdateConfigurationsForm: boolean;
  renderSetPoolForm: boolean;
  setRenderAddConfigurationsForm: (value: boolean) => void;
  addMonitorConfigurationFunctionality: () => void;
  setRenderUpdateConfigurationsForm: (value: boolean) => void;
  setRenderSetPoolForm: (value: boolean) => void;
  setManagerToPoolFunctionality: () => void;
  setFetchConfigurations: (value: boolean) => void;
  monitorConfigurationToUpdate?: MonitorConfiguration;
  selectedIDs: number[];
};

const MonitorConfigurationHeader = ({
  renderUpdateConfigurationsForm,
  renderAddConfigurationsForm,
  addMonitorConfigurationFunctionality,
  renderSetPoolForm,
  setRenderAddConfigurationsForm,
  setRenderUpdateConfigurationsForm,
  setRenderSetPoolForm,
  setManagerToPoolFunctionality,
  setFetchConfigurations,
  monitorConfigurationToUpdate,
  selectedIDs,
}: Props): JSX.Element => {
  const { items, clusterTypes, resourcePools } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const dispatch = useDispatch();
  const abortController = new AbortController();

  useEffect(() => {
    dispatch(fetchClusterTypes(abortController.signal));
    setFetchConfigurations(false);
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (clusterTypes && clusterTypes.length > 0) {
      dispatch(fetchResourcePools(abortController.signal));
    }
  }, [clusterTypes]);

  useEffect(() => {
    if (resourcePools && resourcePools.length > 0) {
      dispatch(fetchApplicationPools(abortController.signal));
    }
  }, [resourcePools]);

  const saveDisplayConfigurations = async (display: boolean) => {
    const displayConfigurations = items.filter((config: MonitorConfiguration) =>
      selectedIDs.includes(config.id)
    );
    const clusters: { id: number; display: boolean; minimize?: boolean }[] =
      displayConfigurations.map((config) => {
        return {
          id: config.id,
          display: display,
          minimize: !display ? false : config.minimize,
          pinned: config.pinned,
        };
      });
    const payLoad: {
      Clusters: { id: number; display: boolean; minimize?: boolean }[];
    } = {
      Clusters: clusters,
    };
    dispatch(setDisplay(payLoad));
    setFetchConfigurations(true);
  };

  let headerContent: JSX.Element | null = null;
  let title = "Monitor DashBoard List";
  let subtitle = "Configure Dashboards";

  if (renderAddConfigurationsForm) {
    headerContent = (
      <MonitorConfigurationForm
        clearHeaderContent={() => setRenderAddConfigurationsForm(false)}
        setFetchConfigurations={setFetchConfigurations}
      />
    );
    title = "Add New Configuration";
    subtitle = "";
  }
  if (renderUpdateConfigurationsForm) {
    headerContent = (
      <MonitorConfigurationForm
        clearHeaderContent={() => setRenderUpdateConfigurationsForm(false)}
        monitorConfigurationToUpdate={monitorConfigurationToUpdate}
        setFetchConfigurations={setFetchConfigurations}
      />
    );
    title = "Edit Configuration";
    subtitle = "";
  }
  if (renderSetPoolForm) {
    const monitorConfigurationToSetPool = items.filter(
      (config: MonitorConfiguration) => selectedIDs.includes(config.id)
    );
    headerContent = (
      <ApplicationPoolForm
        clearHeaderContent={() => setRenderSetPoolForm(false)}
        monitorConfigurationToSet={monitorConfigurationToSetPool}
        setFetchConfigurations={setFetchConfigurations}
      />
    );
    title = "Set pool";
    subtitle = "";
  }
  const buttonContent = [
    <Button
      element={Link}
      to={monitorUrls.monitorDashboard.index}
      className="p-button has-icon"
    >
      <i className="p-icon--switcher-dashboard"></i>
      <span>Monitor View</span>
    </Button>,
    <Button
      key="add-a-config"
      onClick={() => addMonitorConfigurationFunctionality()}
    >
      Add Config
    </Button>,
    <ContextualMenu
      data-testid="take-action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Set To Pool",
          onClick: () => {
            setManagerToPoolFunctionality();
          },
        },
        {
          children: "Set display true",
          onClick: () => {
            saveDisplayConfigurations(true);
          },
        },
        {
          children: "Set display false",
          onClick: () => {
            saveDisplayConfigurations(false);
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="row-menu-toggle u-no-margin--bottom"
      toggleDisabled={selectedIDs.length < 1}
      toggleLabel="Take action"
    />,
  ];

  return (
    <>
      <SectionHeader
        key="MonitorHeader"
        subtitle={subtitle}
        headerContent={headerContent}
        buttons={buttonContent}
        title={title}
      />
    </>
  );
};

export default MonitorConfigurationHeader;
