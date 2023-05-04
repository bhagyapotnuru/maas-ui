import { Route, Switch } from "react-router-dom";

import manageUrls from "../url";

import ManageSessionMainHeader from "./Header/ManageSessionMainHeader";
import ManageSessionMain from "./view/ManageSessionMain";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

const DrutManageSession = (): JSX.Element => {
  useWindowTitle("MATRIX-Events");

  return (
    <Section
      className="u-no-padding--bottom"
      header={<ManageSessionMainHeader />}
      key="nodehSecetion"
    >
      <Switch>
        <Route exact path={manageUrls.manage.session}>
          <ManageSessionMain />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default DrutManageSession;
