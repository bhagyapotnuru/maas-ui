import { useState, useEffect } from "react";

import { Col, Row, Card, Spinner } from "@canonical/react-components";
import { COLOURS } from "app/base/constants";
import DataPathInfo from "app/drut/fabric/FabricDataPath/DataPathInfo";
import { NavLink } from "react-router-dom";

import { fetchData, throwHttpMessage } from "../../config";
// import FabricDataPath from "../../fabric/FabricDataPath/FabricDataPath";
import DSPieChart from "../View/DSPieChart";

const DashboardDatapaths = (): JSX.Element => {
  const dp: any = {};
  const abcSummary = new AbortController();
  const [dataPaths, setDataPaths]: [any, any] = useState([]);
  const [mainData, setMainData]: [any, any] = useState({ mt: [] });
  const [stats, setStats]: [any, any] = useState({
    node: { healthy: 0, warning: 0, critical: 0, total: 0 },
    resources: { healthy: 0, warning: 0, critical: 0, total: 0 },
    dp: { healthy: 0, warning: 0, critical: 0, total: 0 },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeState, setActiveState]: [any, any] = useState({});

  const colorCode = {
    Healthy: { color: COLOURS.POSITIVE, link: "positive" },
    Critical: { color: COLOURS.NEGATIVE, link: "negative" },
    Warning: { color: COLOURS.CAUTION, link: "caution" },
  };
  const getExpSTatus = (index: any) => {
    return activeState[index];
  };

  const changeSate = (index: any) => {
    activeState[index] = !activeState[index];
    setActiveState(activeState);
    generateDataPath(mainData.mt);
  };

  const calcStatus: any = (st: any, type: any, status: string) => {
    st[type].total = st[type].total + 1;
    if (status === "OK") {
      st[type].healthy = st[type].healthy + 1;
    } else if (status === "Critical") {
      st[type].critical = st[type].critical + 1;
    } else {
      st[type].warning = st[type].warning + 1;
    }
    return st;
  };

  const getStatsData = (data: any, flag: any = false) => {
    let st: any = {};
    st.node = { healthy: 0, critical: 0, warning: 0, total: 0 };
    st.resources = { healthy: 0, critical: 0, warning: 0, total: 0 };
    st.dp = { healthy: 0, critical: 0, warning: 0, total: 0, total_dp: 0 };
    data.forEach((elm: any) => {
      st = calcStatus(st, "node", elm.Status.Health);
      st = calcStatus(st, "resources", elm.Status.Health);
      if (elm.ConnectedResourceBlocks && elm.ConnectedResourceBlocks.length) {
        const crb = elm.ConnectedResourceBlocks;
        crb.forEach((rb: any) => {
          st = calcStatus(
            st,
            "resources",
            rb.TargetResourceBlock.Status.Health
          );
          // DataPath Calculation
          if (rb.DataPath && rb.DataPath.length) {
            rb.DataPath.forEach((dp: any) => {
              dp.ConnectedRemoteEndpoints.forEach((cre: any) => {
                st = calcStatus(
                  st,
                  "dp",
                  cre.PathToRemoteEndpoint.Status.Health
                );
              });
            });
            st.dp.total_dp = st.dp.total_dp + 1;
          }
        });
      }
    });
    if (!flag) {
      setStats(st);
      return 0;
    } else {
      return st;
    }
  };

  const generateDataPath = (data: any) => {
    getStatsData(data);
    const dataPath: any = [];
    data.forEach((rs: any, midx: any) => {
      // const dt: any = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true };
      dataPath.push(
        <li
          className="p-accordion__group111"
          key={`dsdp_${midx}_key_${Math.random()}`}
        >
          <div
            aria-level={1}
            className="p-accordion__heading"
            key={`divdp_${midx}_key_${Math.random()}`}
            role="heading"
          >
            <button
              aria-controls={`${midx}_id_sec`}
              aria-expanded={getExpSTatus(midx + 1)}
              className="p-accordion__tab"
              id={`${midx}_id`}
              key={`btndp_${midx}_key_${Math.random()}`}
              onClick={() => changeSate(midx + 1)}
              type="button"
            >
              <b>Node Name:</b>&nbsp;
              <NavLink
                key={`link_key_${Math.random()}`}
                to={`/drut-cdi/nodes/${rs?.Id}`}
              >
                {rs?.Name || "NA"} {"[ Machine Name ]"}
              </NavLink>
              <span
                style={{ float: "right" }}
              >{`${rs?.stats?.dp?.total_dp} Datapaths, ${rs?.stats?.resources?.total} Resource Blocks, ${rs?.stats?.dp?.total} Endpoints`}</span>
            </button>
          </div>
          <section
            aria-hidden={!activeState[midx + 1]}
            aria-labelledby={`${midx}_id`}
            className="p-accordion__panel"
            id={`${midx}_id_sec`}
            key={`dpsec_${Math.random()}`}
            style={{ paddingLeft: "1rem" }}
          >
            <div
              className="drut-dashboard-summary-card-ns"
              key={`dsdivdp_${midx}_key_${Math.random()}`}
            >
              <DataPathInfo data={rs} isList={true}></DataPathInfo>
              {/* <FabricDataPath
                key={`dpdash_${midx}_${Math.random()}`}
                data={rs}
                dp={dt}
                onDataChange={(): any => ""}
                isList={true}
              /> */}
            </div>
          </section>
        </li>
      );
    });
    setDataPaths(dataPath);
  };

  const getNodeDataPath = () => {
    setLoading(true);
    fetchData(`dfab/nodes/?op=get_data_path`, false, abcSummary.signal)
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then(
        (results: any) => {
          setLoading(false);
          if (results && results.length) {
            results.map((data: any) => {
              const dt = [];
              dt.push(data);
              data.stats = getStatsData(dt, true);
              return data;
            });
            for (let i = 0; i < results.length; i++) {
              dp[i + 1] = true;
              activeState[i + 1] = true;
            }
            setActiveState(activeState);
            // console.log(results);
            mainData.mt = results;
            setMainData(mainData);
            generateDataPath(results);
          }
        },
        (error: any) => {
          setLoading(false);
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getNodeDataPath();
    return () => {
      abcSummary.abort();
    };
  }, []);

  return (
    <>
      {loading ? <Spinner /> : ""}
      {error}
      <strong className="p-muted-heading">Datapath Summary</strong>
      <hr />
      <Row>
        <Col size={12}>
          <div className="overall-dashboard-card">
            <DSPieChart
              box={"box1"}
              colorCode={colorCode}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: stats?.node?.healthy,
                  Critical: stats?.node?.critical,
                  Warning: stats?.node?.warning,
                },
                data: null,
                position: 0,
                title: "Nodes",
                total: stats?.node?.total,
                totalTitle: "Nodes",
                unit: "",
              }}
              key={`pathStatus_node`}
            />
            <DSPieChart
              box={"box2"}
              colorCode={colorCode}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: stats?.resources?.healthy,
                  Critical: stats?.resources?.critical,
                  Warning: stats?.resources?.warning,
                },
                data: null,
                position: 0,
                title: "Resource Block",
                total: stats?.resources?.total,
                totalTitle: "Attached",
                unit: "",
              }}
              key={`pathStatus_resource`}
            />
            <DSPieChart
              box={"box3"}
              colorCode={colorCode}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: stats?.dp?.healthy,
                  Critical: stats?.dp?.critical,
                  Warning: stats?.dp?.warning,
                },
                data: null,
                position: 0,
                title: "EndPoints",
                total: stats?.dp?.total,
                totalTitle: (
                  <span>
                    EndPoints and <b> {stats?.dp?.total_dp || "NA"}</b>{" "}
                    Datapaths
                  </span>
                ),
                unit: "",
              }}
              key={`pathStatus_dp`}
            />
          </div>
        </Col>
      </Row>
      <br />
      <strong className="p-muted-heading">Datapath Details</strong>
      <hr />
      <Row>
        <Col size={12}>
          <Card style={{ textAlign: "center" }}>
            <aside className="p-accordion11">
              <ul className="p-accordion__list">{dataPaths}</ul>
            </aside>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default DashboardDatapaths;
