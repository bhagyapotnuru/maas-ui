import { Route, Switch } from "react-router-dom";

import EventHeader from "./EventsHeader";
import EventView from "./EventsView";
import eventUrl from "./url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

const Dashboard = (): JSX.Element => {
  useWindowTitle("MATRIX-Events");

  return (
    <Section
      className="u-no-padding--bottom"
      header={<EventHeader />}
      key="nodehSecetion"
    >
      <Switch>
        <Route exact path={eventUrl.events.index}>
          <EventView />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Dashboard;
