import { useEffect, useRef, useState } from "react";

import {
  Col,
  MainTable,
  Row,
  // Icon,
  Spinner,
  Button,
  SearchBox,
  Select,
  Tooltip,
} from "@canonical/react-components";

import { fetchData } from "../../config";

import classess from "./EventsView.module.css";

export const DEBOUNCE_INTERVAL = 500;

const EventsView = (): JSX.Element => {
  const [eventFullData, setEventFullData] = useState([]);
  const [oldPageSize, setOldPageSize] = useState("25");
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");
  const [prevNext, setPrevNext]: [any, any] = useState([null, null]);
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pageSize, setPageSize] = useState("");

  // const eventIcon = (icon: any) => {
  //   switch (icon) {
  //     case "audit":
  //     case "info":
  //       icon = "information";
  //       break;
  //     case "critical":
  //       icon = "error";
  //       break;
  //     case "debug":
  //       icon = "inspector-debug";
  //       break;
  //   }
  //   return icon;
  // };

  const eventStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "p-icon--information";
      case "failed":
        return "p-icon--error";
      default:
        return;
    }
  };

  const getEventIformation = (events: any) => {
    return events.map((elm: any, index: number) => {
      return {
        key: elm.Id,
        className: "",
        columns: [
          {
            key: "time",
            className: "time-col",
            content: (
              /**
               * <Tooltip
                    key={`tp_${Math.random()}`}
                    className="doughnut-chart__tooltip"
                    followMouse={true}
                    message={`Datapath Creation Order Status: ${node?.DataPathCreationOrderStatus}`}
                    position="btm-center"
                  >
                    <i
                      className={getDpCreationOrderStatusIcon(
                        node?.DataPathCreationOrderStatus
                      )}
                    ></i>
                  </Tooltip>
               */
              <span>
                <span style={{ marginRight: "2%" }}>
                  <Tooltip
                    followMouse={true}
                    key={`event_icon_tooltip_${index}`}
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
            key: "Type",
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

  async function getEventData() {
    setLoading(true);
    let url = "";
    if (pageSize !== oldPageSize) {
      url = `/MAAS/api/2.0/dfab/events/?op=query&limit=${
        pageSize === "" ? oldPageSize : pageSize
      }`;
      setOldPageSize(pageSize);
    } else {
      url = path;
    }
    await fetchData(url, true)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          setLoading(false);
          if (result.events && result.events.length) {
            const dt = result.events;
            setEventFullData(dt);
            setEvents(dt);
          }
          setPrevNext([result.next_uri, result.prev_uri]);
        },
        (error: any) => {
          console.log(error);
          setLoading(false);
        }
      );
  }

  const onSearchValueChange = (e: any) => {
    setSearchText(e);
  };

  const fiterString = (e: any) => {
    const rsd: any = JSON.parse(JSON.stringify(eventFullData));
    if (e === "") {
      setEvents(rsd);
    } else {
      const str: any = e.toUpperCase();
      const fn = rsd.filter((event: any) => {
        const ev: any =
          `${event.type} ${event.description} ${event.level} ${event.created}`.toUpperCase();
        return ev.includes(str);
      });
      setEvents(fn);
    }
  };

  const previousNext = (type: any) => {
    if (type === "P") {
      setPath(prevNext[0]);
    } else {
      setPath(prevNext[1]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getEventData();
    }, 10);
  }, [path, pageSize]);

  return (
    <>
      <Row className="u-nudge-down--small">
        <Col size={6}>
          <SearchBox
            onChange={(e) => {
              // setDebouncing(true);
              // Clear the previous timeout.
              if (intervalRef.current) {
                clearTimeout(intervalRef.current);
              }

              onSearchValueChange(e);
              intervalRef.current = setTimeout(() => {
                fiterString(e);
                // setDebouncing(false);
              }, DEBOUNCE_INTERVAL);
            }}
            placeholder="Search event logs"
            value={searchText}
          />
        </Col>
        <Col className={classess.show_select} size={6}>
          <Col className={classess.select_label_name} size={1}>
            <span>Show</span>
          </Col>
          <Col size={1}>
            <Select
              className={`u-auto-width ${classess.pagingation_select}`}
              defaultValue={pageSize.toString()}
              name="page-size"
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                setPageSize(evt.target.value);
              }}
              options={[
                {
                  value: "25",
                  label: "25",
                },
                {
                  value: "50",
                  label: "50",
                },
                {
                  value: "100",
                  label: "100",
                },
                {
                  value: "200",
                  label: "200",
                },
              ]}
              wrapperClassName="u-display-inline-block u-nudge-right"
            />
          </Col>
          <Col size={1}>
            <Button
              appearance="base"
              className="u-no-margin--right u-no-margin--bottom"
              disabled={prevNext[0] === "" || prevNext[0] === null}
              hasIcon
              onClick={() => previousNext("P")}
            >
              <i className="p-icon--chevron-up drut-prev-icon"></i>
            </Button>
            <Button
              appearance="base"
              className="u-no-margin--right u-no-margin--bottom"
              disabled={prevNext[1] === "" || prevNext[1] === null}
              hasIcon
              onClick={() => previousNext("N")}
            >
              <i className="p-icon--chevron-up drut-next-icon"></i>
            </Button>
          </Col>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col size={12}>
          <div>
            {loading ? (
              <Spinner text="loading ..." />
            ) : (
              <MainTable
                className={"event-logs-table"}
                emptyStateMsg="Data not available."
                headers={events_header}
                rows={getEventIformation(events)}
                sortable
              />
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

EventsView.protoTypes = {};

export default EventsView;
