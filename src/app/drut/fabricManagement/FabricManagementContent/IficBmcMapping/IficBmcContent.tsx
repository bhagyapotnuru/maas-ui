import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import IficBmcControls from "./IficBmcControls";
import IficBmcTable from "./IficBmcTable";
import type { IficBmc } from "./type";

import { fetchData } from "app/drut/config";
import { paginationOptions } from "app/drut/types";

export enum Label {
  Title = "Ific-Bmc List",
}

type Props = {
  error: string;
  setError: (error: string) => void;
  zoneName: Set<string> | null;
  rackName: Set<string> | null;
};

const IficBmcContent = ({
  error,
  setError,
  zoneName,
  rackName,
}: Props): JSX.Element => {
  const [pageSize, setPageSize] = useState(paginationOptions[0].value);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(1);
  const [ificBmcData, setIficBmcData] = useState<IficBmc[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const abortController = new AbortController();

  useEffect(() => {
    getIficBmcData();
    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterData = {
    Zones: zoneName,
    Pools: rackName,
  };

  const getIficBmcData = async () => {
    try {
      setLoading(true);
      const promise = await fetchData(
        "dfab/managers/?op=get_ific_bmc_map",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response = await promise.json();
        setIficBmcData(response);
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

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
          <IficBmcControls
            aria-label="Ific-Bmc list controls"
            searchText={searchText}
            setSearchText={setSearchText}
            ifiBmcCount={ificBmcData?.length}
            filterData={filterData}
            pageSize={pageSize}
            setPageSize={setPageSize}
            next={next}
            setNext={setNext}
            prev={prev}
            setPrev={setPrev}
          />
          <IficBmcTable
            setSearchText={setSearchText}
            aria-label="Ific-Bmc"
            ificBmcDataValues={ificBmcData || []}
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

export default IficBmcContent;
