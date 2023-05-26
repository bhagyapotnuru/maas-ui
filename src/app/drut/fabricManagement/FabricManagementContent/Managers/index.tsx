import { useEffect, useState } from "react";

import { Button, ContextualMenu, Spinner } from "@canonical/react-components";
import { Route, Switch, Link } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddManagerForm from "./AddManager/AddManagerForm";
import type { Rack, Zone, Manager } from "./AddManager/type";
import DeleteManagerForm from "./DeleteManager/DeleteManagerForm";
import ManagerContent from "./ManagerContent";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import NotFound from "app/base/views/NotFound";
import { fetchData, throwHttpMessage, postData } from "app/drut/config";

const Managers = (): JSX.Element => {
  const [renderAddManagersForm, setRenderAddManagersForm] = useState(false);
  const [renderUpdateManagersForm, setRenderUpdateManagersForm] =
    useState(false);
  const [renderDeleteManagersForm, setRenderDeleteManagersForm] =
    useState(false);

  const [manager, setManager] = useState<Manager | undefined>();
  const [managerData, setManagerData] = useState<Manager[]>([]);
  const [timeoutId, setTimeoutId] = useState<any>("");
  const [zoneRackPairs, setZoneRackPairs] = useState([] as Zone[]);
  const [fetchManagers, setFetchManagers] = useState(false);
  const [rackNames, setRackNames] = useState<Set<string> | null>(null);
  const [selectedIDs, setSelectedIDs] = useState([] as number[]);
  const [loading, setLoading] = useState(false);

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
        .map((rack: Rack) => rack.rack_fqgn);
      setRackNames(new Set<string>(rackNames));
    }
  }, [zoneRackPairs]);

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
        setZoneRackPairs(res);
      })
      .catch((e: any) => setError(e));
  };

  const moveManagersToRack = (managersTobeUpdated: Manager[]) => {
    const racks =
      zoneRackPairs.find(
        (zone: Zone) => zone.zone_name.toLowerCase() === "default_zone"
      )?.racks || [];
    const rackObj = (racks as Rack[]).find(
      (rack: Rack) => rack.rack_name.toLowerCase() === "default_rack"
    );
    const updateManagersPayoad: Manager[] = managersTobeUpdated.map(
      (manager: Manager) => {
        return {
          id: manager.id,
          rack_id: rackObj?.rack_id,
          rack_name: rackObj?.rack_name,
          rack_fqgn: rackObj?.rack_fqgn,
          name: manager?.name,
        } as Manager;
      }
    );
    setLoading(true);
    postData(`dfab/managers/`, updateManagersPayoad, true)
      .then((response: any) => {
        if (response.status === 200) {
          setFetchManagers(true);
          setLoading(false);
          setSelectedIDs([]);
          return response.json();
        } else {
          response.text().then((text: string) => {
            const isConstraintViolation: boolean = text.includes(
              "ConstraintViolationException"
            );
            const errorMsg = `Manager name already exists in rack ${rackObj?.rack_name}  Cannot be created with a duplicate name.`;
            setError(isConstraintViolation ? errorMsg : text);
            setLoading(false);
          });
        }
      })
      .catch((e: any) => setError(e));
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
  useWindowTitle(headerTitle);

  if (renderAddManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderAddManagersForm(false)}
        isUnassigned={false}
        setError={setError}
        setFetchManagers={setFetchManagers}
        zoneRackPairs={zoneRackPairs.filter(
          (zone: Zone) => zone.zone_name.toLowerCase() !== "default_zone"
        )}
      />
    );
    headerTitle = "Add Manager";
  }
  if (renderUpdateManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderUpdateManagersForm(false)}
        isUnassigned={false}
        managerToUpdate={manager}
        setError={setError}
        setFetchManagers={setFetchManagers}
        zoneRackPairs={zoneRackPairs.filter(
          (zone: Zone) => zone.zone_name.toLowerCase() !== "default_zone"
        )}
      />
    );
    headerTitle = "Update Manager";
  }
  if (renderDeleteManagersForm) {
    headerContent = (
      <DeleteManagerForm
        managerToDelete={manager}
        onClose={() => setRenderDeleteManagersForm(false)}
        setFetchManagers={setFetchManagers}
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
    <ContextualMenu
      data-testid="take-action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Move to Unassigned..",
          onClick: () => {
            moveManagersToRack(
              managerData.filter((manager: Manager) =>
                selectedIDs.includes(manager.id || 0)
              )
            );
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="row-menu-toggle u-no-margin--bottom"
      toggleDisabled={selectedIDs.length <= 0}
      toggleLabel="Take action"
    />,
  ];

  return (
    <>
      <Section
        className="u-no-padding--bottom"
        header={
          <FabricManagementHeader
            buttonContent={buttonContent}
            headerContent={headerContent}
            subtitle={loading && <Spinner text="Unassigning..." />}
            tag="managers"
            title={headerTitle}
          />
        }
        key="managersHeader"
      >
        <Switch>
          <Route exact path={managersUrl.fabricManagement.managers.index}>
            <ManagerContent
              error={error}
              fetchManagers={fetchManagers}
              managerData={managerData}
              rackNames={rackNames}
              selectedIDs={selectedIDs}
              setError={setError}
              setFetchManagers={setFetchManagers}
              setManagerData={setManagerData}
              setRenderDeleteManagerForm={deleteManager}
              setRenderUpdateManagerForm={updateManager}
              setSelectedIDs={setSelectedIDs}
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
