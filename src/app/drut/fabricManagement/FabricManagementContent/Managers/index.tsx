import { useEffect, useState } from "react";

import { Button, ContextualMenu, Spinner } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Link } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";

import AddManagerForm from "./AddManager/AddManagerForm";
import DeleteManagerForm from "./DeleteManager/DeleteManagerForm";
import ManagerContent from "./ManagerContent";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import NotFound from "app/base/views/NotFound";
import {
  createUpdateManager,
  fetchZoneRacksByQuery,
  actions,
} from "app/store/drut/managers/slice";
import type { Rack, Zone, Manager } from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

const Managers = (): JSX.Element => {
  const { formLoading, zones, selectedIds, items } = useSelector(
    (state: RootState) => state.Managers
  );
  const dispatch = useDispatch();

  const [renderAddManagersForm, setRenderAddManagersForm] = useState(false);
  const [renderUpdateManagersForm, setRenderUpdateManagersForm] =
    useState(false);
  const [renderDeleteManagersForm, setRenderDeleteManagersForm] =
    useState(false);

  const [manager, setManager] = useState<Manager | undefined>();
  const [timeoutId, setTimeoutId] = useState<any>("");

  const abortController = new AbortController();

  useEffect(() => {
    dispatch(fetchZoneRacksByQuery(abortController.signal));
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    dispatch(actions.cleanup());
    dispatch(actions.setIsUnassigned(false));
  }, []);

  const moveManagersToRack = (managersTobeUpdated: Manager[]) => {
    const racks =
      zones.find(
        (zone: Zone) => zone.zone_name.toLowerCase() === "default_zone"
      )?.racks || [];
    const rackObj = racks.find(
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
    dispatch(
      createUpdateManager({
        params: "",
        data: updateManagersPayoad,
        isUpdateOperation: true,
      })
    );
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
    dispatch(actions.setRedfishurlEdit(false));
  };

  let headerContent: JSX.Element | null = null;
  let headerTitle = "Fabric Management";
  useWindowTitle(headerTitle);

  if (renderAddManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderAddManagersForm(false)}
      />
    );
    headerTitle = "Add Manager";
  }
  if (renderUpdateManagersForm) {
    headerContent = (
      <AddManagerForm
        managerToUpdate={manager}
        clearHeaderContent={() => setRenderUpdateManagersForm(false)}
      />
    );
    headerTitle = "Update Manager";
  }
  if (renderDeleteManagersForm) {
    headerContent = (
      <DeleteManagerForm
        managerToDelete={manager}
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
    <ContextualMenu
      data-testid="take-action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Move to Unassigned..",
          onClick: () => {
            moveManagersToRack(
              items.filter((manager: Manager) =>
                selectedIds.includes(manager.id || 0)
              )
            );
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="row-menu-toggle u-no-margin--bottom"
      toggleDisabled={selectedIds.length <= 0}
      toggleLabel="Take action"
    />,
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
            subtitle={formLoading && <Spinner text="Unassigning..." />}
          />
        }
      >
        <Switch>
          <Route exact path={managersUrl.fabricManagement.managers.index}>
            <ManagerContent
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
