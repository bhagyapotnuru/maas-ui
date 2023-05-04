import { Route, Switch } from "react-router-dom";

import ComposeNode from "./ComposeNode";
import ComposeNodeHeader from "./ComposeNodeHeader";
import composeUrl from "./url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

const Compose = (): JSX.Element => {
  useWindowTitle("MATRIX-Compose Machine");

  return (
    <Section
      className="u-no-padding--bottom"
      header={<ComposeNodeHeader />}
      key="composeHeader"
    >
      <Switch>
        <Route exact path={composeUrl.compose.index}>
          <ComposeNode />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Compose;
