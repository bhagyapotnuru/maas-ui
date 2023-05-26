import { useState } from "react";

import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddZonesForm from "./AddZonesForm";
import Content from "./Content";
import RemoveZonesForm from "./RemoveZonesForm";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import type { Data } from "app/store/drut/userzones/types";

const UserZoneMapping = (): JSX.Element => {
  let headerContent: JSX.Element | null = null;
  let headerTitle = "Fabric Management";

  const [renderAddZonesForm, setRenderAddZonesForm] = useState(false);
  const [renderRemoveZonesForm, setRenderRemoveZonesForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<Data | null>(null);

  const clearHeaderContent = () => {
    if (renderAddZonesForm) {
      setRenderAddZonesForm(false);
    }
    if (renderRemoveZonesForm) {
      setRenderRemoveZonesForm(false);
    }
  };

  if (renderAddZonesForm) {
    headerContent = (
      <AddZonesForm
        clearHeaderContent={clearHeaderContent}
        currentUser={currentUser}
      />
    );
    headerTitle = `Add Zones (${currentUser?.username})`;
  }

  if (renderRemoveZonesForm) {
    headerContent = (
      <RemoveZonesForm
        clearHeaderContent={clearHeaderContent}
        currentUser={currentUser}
      />
    );
    headerTitle = `Remove Zones (${currentUser?.username})`;
  }

  return (
    <Section
      key="managersHeader"
      className="u-no-padding--bottom"
      header={
        <FabricManagementHeader
          tag="User-zone-mapping"
          headerContent={headerContent}
          title={headerTitle}
        />
      }
    >
      <Switch>
        <Route exact path={managersUrl.fabricManagement.userZoneMap.index}>
          <Content
            setCurrentUser={setCurrentUser}
            setRenderAddZonesForm={setRenderAddZonesForm}
            setRenderRemoveZonesForm={setRenderRemoveZonesForm}
          />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default UserZoneMapping;
