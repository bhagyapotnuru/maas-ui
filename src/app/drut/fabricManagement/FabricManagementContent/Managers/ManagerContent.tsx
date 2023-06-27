import { useEffect, useRef } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import ManagerControls from "./ManagerControls";
import ManagerTable from "./ManagerTable";

import { fetchManagersByQuery, actions } from "app/store/drut/managers/slice";
import type { RootState } from "app/store/root/types";

export enum Label {
  Title = "Manager list",
}

const TIME_OUT = 10000;

type Props = {
  setRenderUpdateManagerForm: (manager: any) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
};

const ManagerContent = ({
  setRenderDeleteManagerForm,
  setRenderUpdateManagerForm,
}: Props): JSX.Element => {
  const {
    fetchManagers,
    next,
    prev,
    pageSize,
    count,
    selectedItem,
    filterType,
    isInProgressCallManagers,
    errors,
    loading,
    items,
  } = useSelector((state: RootState) => state.Managers);

  const dispatch = useDispatch();

  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  const abortController = new AbortController();

  useEffect(() => {
    if (fetchManagers) {
      getManagersData();
      return () => {
        abortController.abort();
      };
    }
  }, [fetchManagers]);

  useEffect(() => {
    if (isInProgressCallManagers) {
      timer.current = setTimeout(() => {
        getManagersData();
      }, TIME_OUT);
      return () => {
        abortController.abort();
      };
    }
  }, [isInProgressCallManagers, items]);

  useEffect(() => {
    getManagersData();
    return () => {
      abortController.abort();
    };
  }, [next, prev, selectedItem]);

  useEffect(() => {
    if (+pageSize < count) {
      getManagersData();
      return () => {
        abortController.abort();
      };
    }
  }, [pageSize]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current as NodeJS.Timeout);
    };
  }, []);

  async function getManagersData() {
    let params = `page=${next}&limit=${pageSize}`;
    if (filterType === "Manager Type") {
      params += `&manager_type=${selectedItem}`;
    } else if (filterType === "Pools") {
      params += `&rack_fqgn=${selectedItem}`;
    }
    dispatch(fetchManagersByQuery({ params, signal: abortController.signal }));
  }

  const errorValue = errors?.toString();

  return (
    <>
      {errorValue && !errorValue?.toLowerCase()?.includes("abort") && (
        <Notification
          onDismiss={() => dispatch(actions.setError(""))}
          inline
          severity="negative"
        >
          {errorValue}
        </Notification>
      )}
      <div aria-label={Label.Title}>
        <ManagerControls aria-label="manager list controls" />
        {loading ? (
          <Notification inline severity="information">
            <Spinner text="Loading..." />
          </Notification>
        ) : (
          <ManagerTable
            aria-label="managers"
            setRenderUpdateManagerForm={setRenderUpdateManagerForm}
            setRenderDeleteManagerForm={setRenderDeleteManagerForm}
          />
        )}
      </div>
    </>
  );
};

export default ManagerContent;
