import { useState } from "react";

import { Button } from "@canonical/react-components";
import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddGroupForm from "./AddGroup/AddGroupForm";
import DeleteGroupForm from "./DeleteGroup/DeleteGroupForm";
import GroupList from "./GroupList";
import type { Group } from "./type";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";

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
        setError={setError}
        setFetchGroups={setFetchGroups}
        clearHeaderContent={() => createGroupFunctionality(false)}
        groupList={groupList}
      />
    );
    renderTitle = "Add Group";
  }
  if (renderUpdateGroupsForm) {
    headerContent = (
      <AddGroupForm
        groupToUpdate={group}
        setError={setError}
        groupList={groupList}
        setFetchGroups={setFetchGroups}
        clearHeaderContent={() => setRenderUpdateGroupsForm(false)}
      />
    );
    renderTitle = "Update Group";
  }
  if (renderDeleteGroupsForm) {
    headerContent = (
      <DeleteGroupForm
        setError={setError}
        groupData={group}
        setFetchGroups={setFetchGroups}
        onClose={() => setRenderDeleteGroupsForm(false)}
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
          <GroupList
            setRenderUpdateGroupForm={updateGroupFunctionality}
            setRenderDeleteGroupForm={deleteGroupFunctionality}
            fetchGroups={fetchGroups}
            setGroupList={(groups: Group[]) => {
              setFetchGroups(false);
              setGroupList(groups);
            }}
            error={error}
            setError={setError}
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
