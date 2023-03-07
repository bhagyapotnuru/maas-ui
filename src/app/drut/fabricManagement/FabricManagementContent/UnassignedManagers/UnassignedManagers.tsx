import { useState, useEffect } from "react";

import { Button, ContextualMenu } from "@canonical/react-components";
import { Route, Switch, Link } from "react-router-dom";

import managersUrl from "../../url";
import type { Zone } from "../Managers/AddManager/type";
import type { Manager } from "../Managers/type";

import SetZoneForm from "./SetZone/SetZoneForm";
import UnassignedManagersContent from "./UnassignedManagersContent";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import NotFound from "app/base/views/NotFound";
import { fetchData } from "app/drut/config";

const UnassignedManagers = (): JSX.Element => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [renderSetZoneForm, setRenderSetZoneForm] = useState(false);
  const [fetchManagers, setFetchManagers] = useState(true);
  const [error, setError] = useState("");
  const [managers, setManagers] = useState([] as Manager[]);

  const abortController = new AbortController();

  useEffect(() => {
    getZones();
    return () => {
      abortController.abort();
    };
  }, []);

  let headerTitle = "Unassigned Managers";

  const buttonContent: JSX.Element[] | null = [
    <Button element={Link} key="managers" to="/drut-cdi/managers">
      Managers
    </Button>,
    <ContextualMenu
      data-testid="take-action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Move to Rack..",
          onClick: () => {
            setRenderSetZoneForm(true);
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="row-menu-toggle u-no-margin--bottom"
      toggleDisabled={managers.every((manager: Manager) => !manager.checked)}
      toggleLabel="Take action"
    />,
  ];

  let headerContent: JSX.Element | null = null;

  if (renderSetZoneForm) {
    headerContent = (
      <SetZoneForm
        zones={zones}
        clearHeaderContent={() => setRenderSetZoneForm(false)}
        setError={setError}
        setFetchManagers={setFetchManagers}
        managerToMove={managers.filter((manager: Manager) => manager.checked)}
      />
    );
    headerTitle = "Set Zone";
  }

  const getZones = async () => {
    console.log(headerContent)
    try {
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        let response = await promise.json();
        response = response.filter(
          (zone: Zone) => zone.zone_name.toLowerCase() !== "default_zone"
        );
        setZones(response);
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
    }
  };

  return (
    <>
      <Section
        key="unassignedManagersHeader"
        className="u-no-padding--bottom"
        header={
          <SectionHeader
            key="UnassignedManagersHeader"
            buttons={buttonContent}
            // headerContent={headerContent}
            title={headerTitle}
          />
        }
      >
        <Switch>
          <Route
            exact
            path={managersUrl.fabricManagement.unassignedManagers.index}
          >
            <UnassignedManagersContent
              error={error}
              setFetchManagers={setFetchManagers}
              fetchManagers={fetchManagers}
              setError={setError}
              setManagers={setManagers}
            />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Section>
    </>
  );
};

export default UnassignedManagers;
