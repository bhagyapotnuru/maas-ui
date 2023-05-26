import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import { fetchData } from "../../../config";
import { MANAGER_TYPES } from "../Managers/AddManager/constants";

import ManagerControls from "./ManagerControls";
import ManagerTable from "./ManagerTable";
import type { Manager } from "./type";

import { paginationOptions } from "app/drut/types";

export enum Label {
  Title = "Manager list",
}

const TIME_OUT = 10000;

type Props = {
  setError: (error: string) => void;
  error: string;
  setRenderUpdateManagerForm: (manager: any) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
  setFetchManagers: (value: boolean) => void;
  fetchManagers: boolean;
  rackNames: Set<string> | null;
  selectedIDs: number[];
  setSelectedIDs: (selectedId: number[]) => void;
  managerData: any[];
  setManagerData: (managers: any[]) => void;
};

const ManagerContent = ({
  setError,
  error,
  setRenderDeleteManagerForm,
  setRenderUpdateManagerForm,
  fetchManagers,
  setFetchManagers,
  rackNames,
  selectedIDs,
  setSelectedIDs,
  managerData,
  setManagerData,
}: Props): JSX.Element => {
  const [pageSize, setPageSize] = useState(paginationOptions[0].value);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  let setTimeOut: any;

  const abortController = new AbortController();

  useEffect(() => {
    if (fetchManagers) {
      getManagersData(false);
      return () => {
        abortController.abort();
      };
    }
  }, [fetchManagers]);

  useEffect(() => {
    getManagersData(false);
    return () => {
      abortController.abort();
    };
  }, [next, prev, selectedItem]);

  useEffect(() => {
    if (+pageSize < count) {
      getManagersData(false);
      return () => {
        abortController.abort();
      };
    }
  }, [pageSize]);

  useEffect(() => {
    return () => {
      clearTimeout(setTimeOut);
    };
  }, []);

  const filterData = {
    "Manager Type": MANAGER_TYPES,
    Pools: rackNames,
  };

  async function getManagersData(isInProgressCall: boolean) {
    let url = `dfab/managers/?page=${next}&limit=${pageSize}`;
    if (filterType === "Manager Type") {
      url += `&manager_type=${selectedItem}`;
    } else if (filterType === "Pools") {
      url += `&rack_fqgn=${selectedItem}`;
    }
    if (!isInProgressCall) {
      setLoading(true);
    }
    await fetchData(url, false, abortController.signal)
      .then((response: any) => response.json())
      .then(
        (response: any) => {
          if (response) {
            setCount(response.count);
            setFetchManagers(false);
            setManagerData(response?.results);
            const res = response?.results?.filter(
              (r: Manager) => r.discovery_status === "IN_PROGRESS"
            );
            if (res?.length) {
              setTimeOut = setTimeout(() => {
                clearTimeout(setTimeOut);
                getManagersData(true);
              }, TIME_OUT);
            }
            setLoading(false);
          }
        },
        (error: any) => {
          setFetchManagers(false);
          setLoading(false);
          setError(error);
        }
      );
  }

  const errorValue = error.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification inline onDismiss={() => setError("")} severity="negative">
          {errorValue}
        </Notification>
      )}
      <div aria-label={Label.Title}>
        <ManagerControls
          aria-label="manager list controls"
          count={count}
          filterData={filterData}
          managerCount={managerData?.length}
          next={next}
          pageSize={pageSize}
          prev={prev}
          searchText={searchText}
          selectedItem={selectedItem}
          setFilterType={setFilterType}
          setNext={setNext}
          setPageSize={setPageSize}
          setPrev={setPrev}
          setSearchText={setSearchText}
          setSelectedItem={setSelectedItem}
        />
        {loading ? (
          <Notification inline severity="information">
            <Spinner text="Loading..." />
          </Notification>
        ) : (
          <ManagerTable
            aria-label="managers"
            managersData={managerData || []}
            next={next}
            pageSize={pageSize}
            prev={prev}
            searchText={searchText}
            selectedIDs={selectedIDs}
            setRenderDeleteManagerForm={setRenderDeleteManagerForm}
            setRenderUpdateManagerForm={setRenderUpdateManagerForm}
            setSelectedIDs={setSelectedIDs}
          />
        )}
      </div>
    </>
  );
};

export default ManagerContent;
