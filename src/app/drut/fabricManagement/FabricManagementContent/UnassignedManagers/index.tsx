import { useState, useEffect } from "react";

import { Button, ContextualMenu } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Link } from "react-router-dom";

import managersUrl from "../../url";
import AddManagerForm from "../Managers/AddManager/AddManagerForm";
import DeleteManagerForm from "../Managers/DeleteManager/DeleteManagerForm";
import type { Manager } from "../Managers/type";

import UnassignedManagersContent from "./Content";
import SetZoneForm from "./SetZone/SetZoneForm";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useWindowTitle } from "app/base/hooks";
import NotFound from "app/base/views/NotFound";
import { fetchZoneRacksByQuery, actions } from "app/store/drut/managers/slice";
import type { RootState } from "app/store/root/types";

const UnassignedManagers = (): JSX.Element => {
  const [renderAddManagersForm, setRenderAddManagersForm] = useState(false);
  const [renderDeleteManagersForm, setRenderDeleteManagersForm] =
    useState(false);
  const [manager, setManager] = useState<Manager | undefined>();
  const [timeoutId, setTimeoutId] = useState<any>("");
  const [renderSetZoneForm, setRenderSetZoneForm] = useState(false);
  const abortController = new AbortController();
  const { selectedIds } = useSelector((state: RootState) => state.Managers);
  const dispatch = useDispatch();

  let headerTitle = "Unassigned Managers";
  let headerContent: JSX.Element | null = null;
  useWindowTitle(headerTitle);

  useEffect(() => {
    dispatch(actions.cleanup());
    dispatch(actions.setIsUnassigned(true));
  }, []);

  useEffect(() => {
    dispatch(fetchZoneRacksByQuery(abortController.signal));
    return () => {
      abortController.abort();
    };
  }, []);

  if (renderAddManagersForm) {
    headerContent = (
      <AddManagerForm
        clearHeaderContent={() => setRenderAddManagersForm(false)}
      />
    );
    headerTitle = "Add Manager";
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
  if (renderSetZoneForm) {
    headerContent = (
      <SetZoneForm clearHeaderContent={() => setRenderSetZoneForm(false)} />
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
      toggleDisabled={selectedIds.length <= 0}
      toggleLabel="Take action"
    />,
  ];

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
