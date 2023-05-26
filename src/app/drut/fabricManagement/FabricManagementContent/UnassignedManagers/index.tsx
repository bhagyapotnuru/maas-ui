import { useState, useEffect } from "react";

import { Button, ContextualMenu } from "@canonical/react-components";
import { Route, Switch, Link } from "react-router-dom";

import managersUrl from "../../url";
import AddManagerForm from "../Managers/AddManager/AddManagerForm";
import type { Zone } from "../Managers/AddManager/type";
import DeleteManagerForm from "../Managers/DeleteManager/DeleteManagerForm";
import type { Manager } from "../Managers/type";

import UnassignedManagersContent from "./Content";
import SetZoneForm from "./SetZone/SetZoneForm";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useWindowTitle } from "app/base/hooks";
import NotFound from "app/base/views/NotFound";
import { fetchData, throwHttpMessage } from "app/drut/config";

const UnassignedManagers = (): JSX.Element => {
  const [renderAddManagersForm, setRenderAddManagersForm] = useState(false);
  const [renderDeleteManagersForm, setRenderDeleteManagersForm] =
    useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [manager, setManager] = useState<Manager | undefined>();
  const [timeoutId, setTimeoutId] = useState<any>("");
  const [renderSetZoneForm, setRenderSetZoneForm] = useState(false);
  const [fetchManagers, setFetchManagers] = useState(false);
  const [error, setError] = useState("");
  const [managers, setManagers] = useState([] as Manager[]);
  const [SelectedIDs, setSelectedIDs] = useState([] as number[]);
  const abortController = new AbortController();

  useEffect(() => {
    getZones();
    return () => {
      abortController.abort();
    };
  }, []);

  let headerTitle = "Unassigned Managers";
  let headerContent: JSX.Element | null = null;
  useWindowTitle(headerTitle);

  if (renderAddManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderAddManagersForm(false)}
        zoneRackPairs={zones.filter(
          (zone: Zone) => zone.zone_name.toLowerCase() !== "default_zone"
        )}
        setFetchManagers={setFetchManagers}
        setError={setError}
        isUnassigned={true}
      />
    );
    headerTitle = "Add Manager";
  }
  if (renderDeleteManagersForm) {
    headerContent = (
      <DeleteManagerForm
        managerToDelete={manager}
        setFetchManagers={setFetchManagers}
        onClose={() => setRenderDeleteManagersForm(false)}
      />
    );
    headerTitle = "Delete Manager";
  }
  if (renderSetZoneForm) {
    headerContent = (
      <SetZoneForm
        zones={zones}
        clearHeaderContent={() => setRenderSetZoneForm(false)}
        setError={setError}
        setFetchManagers={setFetchManagers}
        managerToMove={managers.filter((manager: Manager) =>
          SelectedIDs.includes(manager.id)
        )}
        setSelectedIDs={setSelectedIDs}
      />
    );
    headerTitle = "Set Zone";
  }

  useEffect(() => {
    clearTimeout(timeoutId);
  }, [timeoutId]);

  const deleteManager = (manager: any) => {
    clearHeaderContent();
    setManager(manager);

    const timeOutId = setTimeout(() => {
      setRenderDeleteManagersForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const setManagerToPool = () => {
    clearHeaderContent();

    const timeOutId = setTimeout(() => {
      setRenderSetZoneForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const onCreateManager = (event: boolean) => {
    clearHeaderContent();

    const timeOutId = setTimeout(() => {
      setRenderAddManagersForm(event);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const clearHeaderContent = () => {
    if (renderAddManagersForm) {
      setRenderAddManagersForm(false);
    }
    if (renderDeleteManagersForm) {
      setRenderDeleteManagersForm(false);
    }
    if (renderSetZoneForm) {
      setRenderSetZoneForm(false);
    }
  };

  const buttonContent: JSX.Element[] | null = [
    <Button
      key="add-a-manager"
      onClick={() => {
        onCreateManager(true);
      }}
    >
      Add Manager
    </Button>,
    <Button element={Link} key="managers" to="/drut-cdi/managers">
      Managers
    </Button>,
    <ContextualMenu
      data-testid="take-action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Move to Pool..",
          onClick: () => {
            setManagerToPool();
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="row-menu-toggle u-no-margin--bottom"
      toggleDisabled={SelectedIDs.length <= 0}
      toggleLabel="Take action"
    />,
  ];

  const getZones = async () => {
    await fetchData(
      "dfab/nodegroups/?op=get_zones_and_racks",
      false,
      abortController.signal
    )
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then((res: any) => {
        res = res.filter(
          (zone: Zone) => zone.zone_name.toLowerCase() !== "default_zone"
        );
        setZones(res);
      })
      .catch((e: any) => setError(e));
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
            headerContent={headerContent}
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
              SelectedIDs={SelectedIDs}
              setSelectedIDs={setSelectedIDs}
              error={error}
              setFetchManagers={setFetchManagers}
              fetchManagers={fetchManagers}
              setError={setError}
              setManagers={setManagers}
              setRenderDeleteManagerForm={deleteManager}
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
