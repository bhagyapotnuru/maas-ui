import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";
import { Route, Switch } from "react-router-dom";

import manageUrls from "../url";

import ManageRBMainHeader from "./Header/ManageGroupsMainHeader";
import AddResourceGroups from "./view/AddResourceGroups";

const DrutManageRB = (): JSX.Element => {
  useWindowTitle("MATRIX-Events");

  return (
    <Section
      className="u-no-padding--bottom"
      header={<ManageRBMainHeader />}
      key="nodehSecetion"
    >
      <Switch>
        <Route exact path={manageUrls.manage.groups}>
          <AddResourceGroups />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default DrutManageRB;
