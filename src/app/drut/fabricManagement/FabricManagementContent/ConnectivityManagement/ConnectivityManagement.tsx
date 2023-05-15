import { ThemeProvider } from "@mui/material/styles";
import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import OxcManagement from "./OxcManagement";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import customDrutTheme from "app/utils/Themes/Themes";

const Manager = (): JSX.Element => {
  return (
    <Section
      className="u-no-padding--bottom"
      header={
        <FabricManagementHeader tag="oxcManagement" title="Fabric Management" />
      }
      key="managersHeader"
    >
      <Switch>
        <Route
          exact
          path={managersUrl.fabricManagement.connectivityManagement.index}
        >
          <ThemeProvider theme={customDrutTheme}>
            <OxcManagement />
          </ThemeProvider>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Manager;
