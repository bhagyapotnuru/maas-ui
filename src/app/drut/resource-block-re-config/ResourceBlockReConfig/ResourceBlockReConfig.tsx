import { ThemeProvider } from "@mui/material/styles";
import { Route, Switch } from "react-router-dom";

import ResourceBlockReConfigHeader from "../ResourceBlockReConfigHeader";
import ResourceBlockReConfigMainPage from "../ResourceBlockReConfigMainPage";
import ResourceBlockReConfigContextProvider from "../Store/resource-block-re-config-provider";
import ResourceBlockReConfigUrl from "../url";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";
import customDrutTheme from "app/utils/Themes/Themes";

const ResourceBlockReConfig = (): JSX.Element => {
  useWindowTitle("MATRIX-Reousrce Block Re-Configuration");
  return (
    <Section
      key="composeHeader"
      className="u-no-padding--bottom"
      header={<ResourceBlockReConfigHeader />}
    >
      <Switch>
        <Route exact path={ResourceBlockReConfigUrl.reConfig.index}>
          <ThemeProvider theme={customDrutTheme}>
            <ResourceBlockReConfigContextProvider>
              <ResourceBlockReConfigMainPage />
            </ResourceBlockReConfigContextProvider>
          </ThemeProvider>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default ResourceBlockReConfig;
