import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { Route, Switch, Link } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddManagerForm from "./AddManager/AddManagerForm";
import type { Rack, Zone, Manager } from "./AddManager/type";
import DeleteManagerForm from "./DeleteManager/DeleteManagerForm";
import ManagerContent from "./ManagerContent";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import { fetchData } from "app/drut/config";

const Managers = (): JSX.Element => {
  const [renderAddManagersForm, setRenderAddManagersForm] = useState(false);
  const [renderUpdateManagersForm, setRenderUpdateManagersForm] =
    useState(false);
  const [renderDeleteManagersForm, setRenderDeleteManagersForm] =
    useState(false);

  const [manager, setManager] = useState<Manager | undefined>();
  const [timeoutId, setTimeoutId] = useState<any>("");
  const [zoneRackPairs, setZoneRackPairs] = useState([] as Zone[]);
  const [fetchManagers, setFetchManagers] = useState(true);
  const [rackNames, setRackNames] = useState<Set<string> | null>(null);

  const [error, setError] = useState("");
  const abortController = new AbortController();

  useEffect(() => {
    getZones();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (zoneRackPairs) {
      const rackNames = (zoneRackPairs as Zone[])
        .map((zoneRackPair: Zone) => zoneRackPair.racks as Rack[])
        .reduce((accumulator: any, value: any) => accumulator.concat(value), [])
        .map((rack: Rack) => rack.rack_name);
      setRackNames(new Set<string>(rackNames));
    }
  }, [zoneRackPairs]);

  const getZones = async () => {
    try {
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        let response = await promise.json();
        response = response.filter(
          (zoneRackPair: Zone) =>
            zoneRackPair.zone_name.toLowerCase() !== "default_zone"
        );
        setZoneRackPairs(response);
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
    }
  };

  const clearHeaderContent = () => {
    if (renderAddManagersForm) {
      setRenderAddManagersForm(false);
    }
    if (renderUpdateManagersForm) {
      setRenderUpdateManagersForm(false);
    }
    if (renderDeleteManagersForm) {
      setRenderDeleteManagersForm(false);
    }
  };

  let headerContent: JSX.Element | null = null;
  let headerTitle = "Fabric Management";

  if (renderAddManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderAddManagersForm(false)}
        zoneRackPairs={zoneRackPairs}
        setFetchManagers={setFetchManagers}
        setError={setError}
      />
    );
    headerTitle = "Add Manager";
  }
  if (renderUpdateManagersForm) {
    headerContent = (
      <AddManagerForm
        managerToUpdate={manager}
        clearHeaderContent={() => setRenderUpdateManagersForm(false)}
        zoneRackPairs={zoneRackPairs}
        setFetchManagers={setFetchManagers}
        setError={setError}
      />
    );
    headerTitle = "Update Manager";
  }
  if (renderDeleteManagersForm) {
    headerContent = (
      <DeleteManagerForm
        setError={setError}
        managerData={manager}
        setFetchManagers={setFetchManagers}
        onClose={() => setRenderDeleteManagersForm(false)}
      />
    );
    headerTitle = "Delete Manager";
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

  const updateManager = (manager: any) => {
    clearHeaderContent();
    setManager(manager);

    const timeOutId = setTimeout(() => {
      setRenderUpdateManagersForm(true);
      setTimeoutId(timeOutId);
    }, 10);
  };

  const onCreateManager = (event: boolean) => {
    setRenderAddManagersForm(event);
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
    <Button
      element={Link}
      key="unassigned-managers"
      to="/drut-cdi/unassigned-managers"
    >
      Unassigned Managers
    </Button>,
  ];

  return (
    <>
      <Section
        key="managersHeader"
        className="u-no-padding--bottom"
        header={
          <FabricManagementHeader
            tag="managers"
            headerContent={headerContent}
            buttonContent={buttonContent}
            title={headerTitle}
          />
        }
      >
        <Switch>
          <Route exact path={managersUrl.fabricManagement.managers.index}>
            <ManagerContent
              error={error}
              setFetchManagers={setFetchManagers}
              setError={setError}
              rackNames={rackNames}
              fetchManagers={fetchManagers}
              setRenderUpdateManagerForm={updateManager}
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

export default Managers;
