import { useState } from "react";

import { Route, Switch } from "react-router-dom";

import HealthHeader from "./HealthHeader";
import HealthView from "./HealthView";
import healthUrl from "./url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

const Health = (): JSX.Element => {
  useWindowTitle("MATRIX-Health");
  const [rf, setRf] = useState("");

  return (
    <Section
      className="u-no-padding--bottom"
      header={
        <HealthHeader onRefresh={(): void => setRf(Math.random().toString())} />
      }
      key="nodehSecetion"
    >
      <Switch>
        <Route exact path={healthUrl.health.index}>
          <HealthView rf={rf} />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Health;
