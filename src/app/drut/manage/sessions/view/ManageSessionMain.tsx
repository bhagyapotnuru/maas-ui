import { useEffect, useRef, useState } from "react";

import {
  Col,
  MainTable,
  Row,
  Spinner,
  SearchBox,
  Button,
} from "@canonical/react-components";
import { CSVLink } from "react-csv";

import { fetchData, deleteData } from "../../../config";

export const DEBOUNCE_INTERVAL = 500;

const ManageSessionMain = (): JSX.Element => {
  const [sessionFullData, setSessionFullData] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sessionData, setSessionData] = useState([]);
  const [sessionEData, setSessionEData] = useState([]);

  async function getSessionData() {
    setLoading(true);
    const url = "/MAAS/api/2.0/dfab/user-sessions/";
    await fetchData(url, true)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          setLoading(false);
          if (result && result.length) {
            const dt = result;
            setSessionFullData(dt);
            setSessionData(dt);

            const exportData = dt.map((d: any) => {
              return {
                "User Name": d.last_name || "NA",
                "User ID": d.user_name,
                "User Type": d.is_superuser ? "Administrator" : "User",
                "Last Login": d.last_login || "NA",
                "Expire Date": d.expire_date || "NA",
              };
            });
            setSessionEData(exportData);
          }
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
    const rsd: any = JSON.parse(JSON.stringify(sessionFullData));
    if (e === "") {
      setSessionData(rsd);
    } else {
      const str: any = e.toUpperCase();
      const fn = rsd.filter((session: any) => {
        const ev: any = `${session.user_name} ${
          session.is_superuser ? "Administrator" : "user"
        } ${session.last_login} ${session.expire_date} ${
          session.last_name
        }`.toUpperCase();
        return ev.includes(str);
      });
      setSessionData(fn);
    }
  };

  const onDelete = (key: any = "") => {
    deleteData(`/dfab/user-sessions/${key}/`).then(
      () => {
        getSessionData();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  const getSessionIformation = (sessions: any) => {
    return sessions.map((elm: any) => {
      return {
        key: elm.Id,
        className: "",
        CheckboxInput: "",
        columns: [
          {
            key: "last_name",
            className: "drut-na",
            content: <span>{elm?.last_name || "NA"}</span>,
          },
          {
            key: "user_name",
            className: "drut-na",
            content: <span>{elm?.user_name || "NA"}</span>,
          },
          {
            key: "is_superuser",
            className: "drut-na",
            content: (
              <span>{elm?.is_superuser ? "Administrator" : "User"}</span>
            ),
          },
          {
            key: "last_login",
            className: "drut-na",
            content: <span>{elm?.last_login || "NA"}</span>,
          },
          {
            key: "expire_date",
            className: "drut-na",
            content: <span>{elm?.expire_date || "NA"}</span>,
          },
          {
            key: "delete",
            className: "drut-col-sn",
            content: (
              <>
                <Button
                  appearance="base"
                  className="is-dense u-table-cell-padding-overlap"
                  data-testid="table-actions-delete"
                  disabled={false}
                  hasIcon
                  onClick={() => onDelete(elm?.session_key)}
                  type="button"
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </>
            ),
          },
        ],
        sortData: {
          last_name: elm?.last_name,
          user_name: elm?.user_name,
          is_superuser: elm?.is_superuser,
          last_login: elm?.last_login,
          expire_date: elm?.expire_date,
        },
      };
    });
  };

  const sessions_header = [
    {
      content: "User Name",
      sortKey: "last_name",
    },
    {
      content: "User ID",
      sortKey: "user_name",
    },
    {
      content: "User Type",
      sortKey: "is_superuser",
    },
    {
      content: "Last Login",
      sortKey: "last_login",
    },

    {
      content: "Expire Time",
      sortKey: "expire_date",
    },
    {
      content: "",
      className: "drut-col-sn",
    },
  ];

  useEffect(() => {
    getSessionData();
  }, []);

  return (
    <>
      <Row>
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
        <Col size={2}></Col>
        <Col size={4}>
          <Button onClick={() => getSessionData()} style={{ float: "right" }}>
            Refresh
          </Button>
          <CSVLink
            data={sessionEData}
            filename={`SessionData-${new Date().toLocaleString()}.csv`}
            separator={";"}
            style={{ float: "right", marginRight: "4px" }}
          >
            <Button>Export Data</Button>
          </CSVLink>
        </Col>
        <Col size={12}>
          <div>
            {loading ? (
              <Spinner text="loading ..." />
            ) : (
              <MainTable
                className={"event-logs-table"}
                emptyStateMsg="Data not available."
                headers={sessions_header}
                rows={getSessionIformation(sessionData)}
                sortable
              />
            )}
          </div>
        </Col>
        <Col size={4}></Col>
      </Row>
    </>
  );
};
export default ManageSessionMain;
