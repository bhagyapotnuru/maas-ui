import React, { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import DashboardDatpath from "./DashboardDatapaths";
import DashboardView from "./DashboardView";

import { fetchSummaryData } from "app/drut/api";

interface Props {
  pageid: string;
}
const DashboardMain = ({ pageid }: Props): JSX.Element => {
  const [summary, setSummary] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abort = new AbortController();

  useEffect(() => {
    if (pageid === "sum") {
      getSummaryData();
    }
  }, [pageid]);

  const getSummaryData = async () => {
    try {
      setLoading(true);
      const response = await fetchSummaryData(abort.signal);
      setSummary(response);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const errorValue = error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
        </Notification>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {pageid === "sum" ? (
            <DashboardView summary={summary} setError={setError} />
          ) : (
            <DashboardDatpath summary={summary.Summary} />
          )}
        </>
      )}
    </>
  );
};
export default DashboardMain;
