import React from "react";

import { Button } from "@canonical/react-components";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { Link, Route, Switch } from "react-router-dom";

import ConfigurationTable from "./ConfigurationList/configurationList";
import MonitorDashboard from "./MonitorDashboard";
import classess from "./monitor.module.css";
import monitorUrls from "./url";

const Monitor = (): JSX.Element => {
  const [showConfigModal, setShowConfigModal] = React.useState(false);

  const toggleConfigModal = () => {
    setShowConfigModal((prev: boolean) => !prev);
  };

  return (
    <Switch>
      <Route exact path={monitorUrls.monitorDashboard.index}>
        <Section
          className={`u-no-padding--bottom ${
            showConfigModal
              ? classess.fixed_background
              : classess.fixed_monitor_header
          }`}
          header={
            <SectionHeader
              buttons={[
                <Button
                  className="p-button has-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleConfigModal();
                  }}
                >
                  <i className="p-icon--add-canvas"></i>
                  <span>Manage View</span>
                </Button>,
                <Button
                  className="p-button has-icon"
                  element={Link}
                  to={monitorUrls.monitorDashboardList.index}
                >
                  <i className="p-icon--switcher-environments"></i>
                  <span>Configuration</span>
                </Button>,
              ]}
              // subtitle="Pod statistics"
              title="Monitor"
            />
          }
          key="kubeopsHeader"
        >
          <div style={{ height: "60px" }}></div>
          <MonitorDashboard
            showConfigModal={showConfigModal}
            toggleConfigModal={toggleConfigModal}
          />
        </Section>
      </Route>
      <Route exact path={monitorUrls.monitorDashboardList.index}>
        <Section
          className="u-no-padding--bottom"
          header={
            <SectionHeader
              buttons={[
                <Button
                  className="p-button has-icon"
                  element={Link}
                  to={monitorUrls.monitorDashboard.index}
                >
                  <i className="p-icon--switcher-dashboard"></i>
                  <span>Monitor View</span>
                </Button>,
              ]}
              subtitle="Configure Dashboards"
              title="Monitor DashBoard List"
            />
          }
          key="kubeopsHeader"
        >
          <ConfigurationTable />
        </Section>
      </Route>
    </Switch>
  );
};

export default Monitor;
