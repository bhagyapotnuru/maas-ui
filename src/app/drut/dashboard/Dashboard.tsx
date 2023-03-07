import { useState } from "react";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import { Route, Switch } from "react-router-dom";

import DashboardHeader from "./DashboardHeader";
import DashboardView from "./DashboardView";
import dashboardURLs from "./url";

const Dashboard = (): JSX.Element => {
  const [pageid, setPageId] = useState("sum");

  const onClickTab = (id: any = "sum") => {
    setPageId(id);
  };
  return (
    <Section
      className="u-no-padding--bottom"
      header={<DashboardHeader onClickTab={onClickTab} />}
      key="nodehSecetion"
    >
      <Switch>
        <Route exact path={dashboardURLs.dashboard.index}>
          <DashboardView pageid={pageid} />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Dashboard;
