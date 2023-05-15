import { ThemeProvider } from "@mui/material/styles";
import { Route, Switch } from "react-router-dom";

import ComposeNodeContent from "../ComposeNodeContent";
import ComposeNodeHeader from "../ComposeNodeHeader";
import composeUrl from "../url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";
import customDrutTheme from "app/utils/Themes/Themes";

const ComposeNode = (): JSX.Element => {
  useWindowTitle("MATRIX-Compose Machine");

  return (
    <Section
      className="u-no-padding--bottom"
      header={<ComposeNodeHeader />}
      key="composeHeader"
    >
      <Switch>
        <Route exact path={composeUrl.compose.index}>
          <ThemeProvider theme={customDrutTheme}>
            <ComposeNodeContent />
          </ThemeProvider>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default ComposeNode;
