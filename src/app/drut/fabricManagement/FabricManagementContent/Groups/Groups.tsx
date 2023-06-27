import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddGroupForm from "./AddGroup/AddGroupForm";
import DeleteGroupForm from "./DeleteGroup/DeleteGroupForm";
import GroupList from "./GroupList";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import { actions } from "app/store/drut/groups/slice";
import type { RootState } from "app/store/root/types";

const Groups = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    renderAddGroupsForm,
    renderDeleteGroupsForm,
    renderUpdateGroupsForm,
  } = useSelector((state: RootState) => state.Group);

  let headerContent: JSX.Element | null = null;
  let renderTitle = "Fabric Management";

  if (renderAddGroupsForm) {
    headerContent = (
      <AddGroupForm
        clearHeaderContent={() =>
          dispatch(actions.setRenderAddGroupsForm(false))
        }
      />
    );
    renderTitle = "Add Group";
  }
  if (renderUpdateGroupsForm) {
    headerContent = (
      <AddGroupForm
        clearHeaderContent={() =>
          dispatch(actions.setRenderUpdateGroupsForm(false))
        }
      />
    );
    renderTitle = "Update Group";
  }
  if (renderDeleteGroupsForm) {
    headerContent = <DeleteGroupForm />;
    renderTitle = "Delete Group";
  }

  const buttonContent: JSX.Element[] | null = [
    <Button
      key="add-a-group"
      onClick={() => dispatch(actions.setRenderAddGroupsForm(true))}
    >
      Add Group
    </Button>,
  ];

  return (
    <Section
      key="managersHeader"
      className="u-no-padding--bottom"
      header={
        <FabricManagementHeader
          tag="groups"
          headerContent={headerContent}
          buttonContent={buttonContent}
          title={renderTitle}
        />
      }
    >
      <Switch>
        <Route exact path={managersUrl.fabricManagement.index}>
          <GroupList />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Groups;
