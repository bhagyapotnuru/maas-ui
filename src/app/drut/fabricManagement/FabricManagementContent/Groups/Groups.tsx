import { useState } from "react";

import { Button } from "@canonical/react-components";
import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddGroupForm from "./AddGroup/AddGroupForm";
import DeleteGroupForm from "./DeleteGroup/DeleteGroupForm";
import GroupList from "./GroupList";
import type { Group } from "./type";

const Groups = (): JSX.Element => {
  const [renderAddGroupsForm, setRenderAddGroupsForm] = useState(false);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [renderUpdateGroupsForm, setRenderUpdateGroupsForm] = useState(false);
  const [fetchGroups, setFetchGroups] = useState(true);
  const [error, setError] = useState("");

  const [renderDeleteGroupsForm, setRenderDeleteGroupsForm] = useState(false);

  let headerContent: JSX.Element | null = null;
  let renderTitle = "Fabric Management";

  if (renderAddGroupsForm) {
    headerContent = (
      <AddGroupForm
        clearHeaderContent={() => createGroupFunctionality(false)}
        groupList={groupList}
        setError={setError}
        setFetchGroups={setFetchGroups}
      />
    );
    renderTitle = "Add Group";
  }
  if (renderUpdateGroupsForm) {
    headerContent = (
      <AddGroupForm
        clearHeaderContent={() => setRenderUpdateGroupsForm(false)}
        groupList={groupList}
        groupToUpdate={group}
        setError={setError}
        setFetchGroups={setFetchGroups}
      />
    );
    renderTitle = "Update Group";
  }
  if (renderDeleteGroupsForm) {
    headerContent = (
      <DeleteGroupForm
        groupData={group}
        onClose={() => setRenderDeleteGroupsForm(false)}
        setError={setError}
        setFetchGroups={setFetchGroups}
      />
    );
    renderTitle = "Delete Group";
  }

  const buttonContent: JSX.Element[] | null = [
    <Button key="add-a-group" onClick={() => createGroupFunctionality(true)}>
      Add Group
    </Button>,
  ];

  const deleteGroupFunctionality = (group: Group) => {
    setRenderDeleteGroupsForm(true);
    setGroup(group);
  };

  const updateGroupFunctionality = (group: Group) => {
    setRenderUpdateGroupsForm(true);
    setGroup(group);
  };

  const createGroupFunctionality = (check: boolean) => {
    setRenderAddGroupsForm(check);
  };

  return (
    <Section
      className="u-no-padding--bottom"
      header={
        <FabricManagementHeader
          buttonContent={buttonContent}
          headerContent={headerContent}
          tag="groups"
          title={renderTitle}
        />
      }
      key="managersHeader"
    >
      <Switch>
        <Route exact path={managersUrl.fabricManagement.index}>
          <GroupList
            error={error}
            fetchGroups={fetchGroups}
            setError={setError}
            setGroupList={(groups: Group[]) => {
              setFetchGroups(false);
              setGroupList(groups);
            }}
            setRenderDeleteGroupForm={deleteGroupFunctionality}
            setRenderUpdateGroupForm={updateGroupFunctionality}
          />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Groups;
