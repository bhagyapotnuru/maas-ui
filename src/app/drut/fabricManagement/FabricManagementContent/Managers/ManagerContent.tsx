import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import { fetchData } from "../../../config";

import ManagerControls from "./ManagerControls";
import ManagerTable from "./ManagerTable";
import type { Manager } from "./type";

export enum Label {
  Title = "Manager list",
}

type Props = {
  setError: (error: string) => void;
  error: string;
  setRenderUpdateManagerForm: (manager: any) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
  setFetchManagers: (value: boolean) => void;
  fetchManagers: boolean;
  rackNames: Set<string> | null;
};

const ManagerContent = ({
  setError,
  error,
  setRenderDeleteManagerForm,
  setRenderUpdateManagerForm,
  fetchManagers,
  setFetchManagers,
  rackNames,
}: Props): JSX.Element => {
  const [pageSize, setPageSize] = useState("25");
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(1);
  const [managerData, setManagerData] = useState<Manager[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const abortController = new AbortController();

  useEffect(() => {
    if (fetchManagers) {
      getManagersData();
      return () => {
        abortController.abort();
      };
    }
  }, [fetchManagers]);

  const filterData = {
    "Manager Type": ["TFIC", "IFIC", "BMC", "OXC"],
    Racks: rackNames,
  };

  async function getManagersData() {
    setLoading(true);
    await fetchData("dfab/managers/", false, abortController.signal)
      .then((response: any) => response.json())
      .then(
        (response: any) => {
          if (response) {
            setFetchManagers(false);
            setManagerData(response);
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

  return (
    <>
      {error && error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          inline
          severity="negative"
        >
          {error}
        </Notification>
      )}
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text="Loading..."
            key={`managerListSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
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
          />
          <ManagerTable
            aria-label="managers"
            managersData={managerData || []}
            setRenderUpdateManagerForm={setRenderUpdateManagerForm}
            setRenderDeleteManagerForm={setRenderDeleteManagerForm}
            searchText={searchText}
            pageSize={pageSize}
            prev={prev}
            next={next}
          />
        </div>
      )}
    </>
  );
};

export default ManagerContent;
