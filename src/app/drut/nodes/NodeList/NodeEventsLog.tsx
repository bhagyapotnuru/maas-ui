import { useEffect, useState } from "react";

import { MainTable, Spinner, Tooltip } from "@canonical/react-components";

import { fetchData } from "app/drut/config";

type Props = {
  nodeId: string;
};

const NodeEventLog = (props: Props): JSX.Element => {
  const abortController = new AbortController();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventData(props.nodeId);
    return () => {
      abortController.abort();
    };
  }, []);

  const eventStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "p-icon--information";
      case "failed":
        return "p-icon--error";
    }
  };

  const events_header = [
    {
      content: "Time",
      sortKey: "created",
      className: "time-col",
    },
    {
      content: "Events",
      sortKey: "description",
      className: "drut-col",
    },
  ];

  async function getEventData(id: any = "") {
    setLoading(true);
    const url = `/MAAS/api/2.0/dfab/events/?op=query&nodeid=${id}`;
    await fetchData(url, true, abortController.signal)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          if (result && result.events && result.events.length) {
            setEvents(result.events);
          } else {
            setEvents([]);
          }
          setLoading(false);
        },
        (error: any) => {
          setEvents([]);
          console.log(error);
          setLoading(false);
        }
      );
  }

  const getEventIformation = (events: any) => {
    return events.map((elm: any, index: number) => {
      return {
        key: `${elm.created}_${index}_${Math.random()}`,
        className: "",
        columns: [
          {
            key: `time_${index}_${Math.random()}`,
            className: "time-col",
            content: (
              <span>
                <span style={{ marginRight: "2%" }}>
                  <Tooltip
                    key={`event_icon_tooltip_${index}`}
                    followMouse={true}
                    message={`Event Status: ${elm?.status}`}
                  >
                    <i className={eventStatusIcon(elm?.status)} />
                  </Tooltip>
                </span>
                {elm.created}
              </span>
            ),
          },
          {
            key: `yype_${index}_${Math.random()}`,
            className: "",
            content: (
              <span>{`${elm.type && elm.type.length ? `${elm.type} - ` : ""}${
                elm.description
              }`}</span>
            ),
          },
        ],
        sortData: {
          created: elm?.created,
          level: elm?.level,
          type: elm?.type,
          description: `${elm.type && elm.type.length ? `${elm.type} - ` : ""}${
            elm.description
          }`,
        },
      };
    });
  };

  const logsTable = (
    <MainTable
      key={`mt_${Math.random()}`}
      headers={events_header}
      className={"event-logs-table"}
      rows={getEventIformation(events)}
      sortable
      emptyStateMsg="Event data not available."
    />
  );

  const elementToRender = loading ? <Spinner text="Loading..." /> : logsTable;

  return <>{elementToRender}</>;
};
export default NodeEventLog;
