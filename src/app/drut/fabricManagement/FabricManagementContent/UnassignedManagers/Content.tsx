import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import { fetchData } from "../../../config";
import { MANAGER_TYPES } from "../Managers/AddManager/constants";
import type { Manager } from "../Managers/type";

import ManagerControls from "./Controls";
import ManagerTable from "./Table";

import { paginationOptions } from "app/drut/types";

export enum Label {
  Title = "Manager list",
}
const TIME_OUT = 10000;

type Props = {
  SelectedIDs: number[];
  setSelectedIDs: (value: number[]) => void;
  error: string;
  fetchManagers: boolean;
  setManagers: React.Dispatch<React.SetStateAction<Manager[]>>;
  setError: (value: string) => void;
  setFetchManagers: (value: boolean) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
};

const ManagerContent = ({
  SelectedIDs,
  setSelectedIDs,
  error,
  setError,
  setManagers,
  fetchManagers,
  setFetchManagers,
  setRenderDeleteManagerForm,
}: Props): JSX.Element => {
  const [pageSize, setPageSize] = useState(paginationOptions[0].value);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(1);
  const [managerData, setManagerData] = useState<Manager[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [count, setCount] = useState(0);
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
  };

  async function getManagersData(isInProgressCall: boolean) {
    let url = `dfab/managers/?rack_name=Default_Rack&page=${next}&limit=${pageSize}`;
    if (filterType === "Manager Type") {
      url += `&manager_type=${selectedItem}`;
    }
    if (!isInProgressCall) setLoading(true);
    await fetchData(url, false, abortController.signal)
      .then((response: any) => response.json())
      .then(
        (response: any) => {
          if (response) {
            setCount(response.count);
            response = response?.results?.map((data: Manager) => {
              return { ...data, checked: false };
            });
            setManagerData(response);
            setManagers(response);
            const res = response?.filter(
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
          setLoading(false);
          setFetchManagers(false);
        },
        (error: any) => {
          setFetchManagers(false);
          setLoading(false);
          setError(error);
        }
      );
  }

  return (
    <>
      {error && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {error.toString()}
        </Notification>
      )}
      <div aria-label={Label.Title}>
        <ManagerControls
          aria-label="manager list controls"
          searchText={searchText}
          setSearchText={setSearchText}
          managerCount={managerData?.length}
          filterData={filterData}
          pageSize={pageSize}
          setPageSize={setPageSize}
          next={next}
          setNext={setNext}
          prev={prev}
          setPrev={setPrev}
          setFilterType={setFilterType}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          count={count}
        />
        {loading ? (
          <Notification inline severity="information">
            <Spinner text="Loading..." />
          </Notification>
        ) : (
          <ManagerTable
            aria-label="managers"
            managersData={managerData || []}
            searchText={searchText}
            setRenderDeleteManagerForm={setRenderDeleteManagerForm}
            pageSize={pageSize}
            prev={prev}
            next={next}
            SelectedIDs={SelectedIDs}
            setSelectedIDs={setSelectedIDs}
          />
        )}
      </div>
    </>
  );
};

export default ManagerContent;
