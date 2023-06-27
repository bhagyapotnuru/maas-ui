import { useEffect, useState } from "react";

import {
  Col,
  Row,
  Spinner,
  MainTable,
  Link,
  Card,
  Notification,
} from "@canonical/react-components";

import { arrayObject } from "../../parser";

import { fetchFabricData, fetchFabricDataById } from "app/drut/api";
interface Props {
  rf: any;
}

const HealthView = ({ rf }: Props): JSX.Element => {
  const [hd, setHD] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [error, setError] = useState("");

  async function getActiveFabricData() {
    await fetchFabricData()
      .then((result: any) => {
        if (result && result.length) {
          const fabm = result.find((dt: any) => dt.enabled === true);
          if (fabm.id) {
            getHealthData(fabm.id);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const handleClick = (index: any): void => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
  };

  const iconName = (elm: any) => {
    return elm?.Status?.Phase === "Running" ? (
      <div className="drut-service-status drut-color-green">Running</div>
    ) : (
      <div className="drut-service-status drut-color-red">Not Running</div>
    );
  };

  const renderRSTable = (res: any) => {
    if (res && res.length) {
      return res.map((elm: any, index: any) => {
        return {
          key: elm.Id,
          className:
            index === expandedRow
              ? "drut-table-selected-row"
              : "drut-table-un-selected-row",
          columns: [
            {
              key: "Status",
              className: "drut-col-s-status",
              content: iconName(elm),
            },
            {
              key: "App",
              className: "drut-col-s-na",
              content: (
                <span>
                  <Link
                    key="nodeNameLink"
                    title={elm?.Labels?.App}
                    onClick={(e: any) => {
                      e.preventDefault();
                      handleClick(index);
                    }}
                    color="default"
                  >
                    {elm?.Labels?.App || "NA"}
                  </Link>
                </span>
              ),
            },
            {
              key: "Version",
              className: "drut-col-s-version",
              content: <>{elm?.Labels?.Version || "NA"}</>,
            },
            {
              key: "Release",
              className: "drut-col-ip-address",
              content: <>{elm?.Labels?.Release}</>,
            },
            {
              key: "NodeIP",
              className: "drut-col-ip-address",
              content: <>{elm?.Status?.NodeIP || "NA"}</>,
            },
            {
              key: "PodIP",
              className: "drut-col-ip-address",
              content: <>{elm?.Status?.PodIP || "NA"}</>,
            },
            {
              key: "Cpu",
              className: "drut-col-s-common",
              content: <>{elm?.Status?.ContainerStatuses?.[0]?.Cpu || "NA"}</>,
            },
            {
              key: "Memory",
              className: "drut-col-s-common",
              content: (
                <>{elm?.Status?.ContainerStatuses?.[0]?.Memory || "NA"}</>
              ),
            },
          ],
          expanded: expandedRow === index,
          expandedContent:
            expandedRow === index ? (
              <Row>
                <Col size={12}>
                  {
                    <div className="element-container">
                      <div>
                        <Card>
                          <strong className="p-muted-heading">
                            Detailed Information
                          </strong>
                          {arrayObject([elm], 12).colFnd}
                        </Card>
                      </div>
                    </div>
                  }
                </Col>
              </Row>
            ) : (
              ""
            ),
          sortData: {
            App: elm?.Labels?.App,
            Release: elm?.Labels?.Release,
            Version: elm?.Labels?.Version,
            Status: elm?.Status?.Phase,
            NodeIP: elm?.Status?.NodeIP,
            PodIP: elm?.Status?.PodIP,
            CPU: elm?.ContainerStatuses?.Cpu,
            Memory: elm?.ContainerStatuses?.Memory,
          },
        };
      });
    } else {
      return [];
    }
  };

  const getHealthData = (id: any) => {
    fetchFabricDataById(id)
      .then((results: any) => {
        setLoading(false);
        if (results) {
          setHD(results.sort((a: any, b: any) => a - b));
        }
      })
      .catch((error: any) => {
        setLoading(false);
        setError(error);
      });
  };

  useEffect(() => {
    getActiveFabricData();
    return () => {
      // clearTimeout(setTimeOut);
    };
  }, [rf]);

  const headers = [
    {
      content: "Status",
      sortKey: "Status",
      className: "drut-col-s-status",
    },
    {
      content: "App",
      sortKey: "App",
      className: "drut-col-s-na",
    },
    {
      content: "Version",
      sortKey: "Version",
      className: "drut-col-s-version",
    },
    {
      content: "Release",
      sortKey: "Release",
      className: "drut-col-ip-address",
    },
    {
      content: "Node IP",
      sortKey: "NodeIP",
      className: "drut-col-ip-address",
    },
    {
      content: "Pod IP",
      sortKey: "PodIP",
      className: "drut-col-ip-address",
    },
    {
      content: "CPU",
      sortKey: "CPU",
      className: "drut-col-s-common",
    },
    {
      content: "Memory",
      sortKey: "Memory",
      className: "drut-col-s-common",
    },
  ];

  const errorValue = error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
        </Notification>
      )}
      <Row className="u-nudge-down--small">
        <Col size={12}>
          {loading ? <Spinner text="Loading..." /> : ""}

          <MainTable
            key="resourceTableTable"
            expanding
            defaultSort="App"
            defaultSortDirection="ascending"
            responsive={false}
            headers={headers}
            rows={renderRSTable(hd)}
            sortable
            emptyStateMsg="Resource data not available."
          />
        </Col>
      </Row>
    </>
  );
};

HealthView.protoTypes = {};

export default HealthView;
