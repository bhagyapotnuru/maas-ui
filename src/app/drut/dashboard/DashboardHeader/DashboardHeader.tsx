import { useState, useEffect } from "react";

import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import { NavLink, Link } from "react-router-dom";

import { fetchData } from "../../config";

import SectionHeader from "app/base/components/SectionHeader";

interface Props {
  onClickTab?: any;
}

const DashboardHeader = ({ onClickTab }: Props): JSX.Element => {
  const abcSumData = new AbortController();
  // const history = createBrowserHistory();
  const [fabric, setFabric]: [any, any] = useState(null);
  const [tabs, setTabs] = useState([
    {
      active: true,
      id: "sum",
      label: "Dashboard",
      onClick: () => getDetails("sum"),
    },
    {
      active: false,
      id: "dp",
      label: "Data Paths",
      onClick: () => getDetails("dp"),
    },
  ]);

  const getDetails = (id: any) => {
    onClickTab(id);
    const data: any = [];
    tabs.forEach((dt: any) => {
      dt.active = false;
      if (dt.id === id) {
        dt.active = true;
      }
      data.push(dt);
    });
    setTabs(data);
  };

  async function getSummaryData() {
    await fetchData("dfab/fabrics/", false, abcSumData.signal)
      .then((response: any) => response.json())
      .then(
        (result: any) => {
          if (result && result.length) {
            const fabm = result.find((dt: any) => dt.enabled === true);
            if (fabm.url) {
              const a = document.createElement("a");
              a.href = fabm.url;
              fabm.url = `${a.hostname}:${a.port}`;
            }
            setFabric(fabm);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  useEffect(() => {
    getSummaryData();
    return () => {
      abcSumData.abort();
    };
  }, []);

  const getHeaderButtons = () => {
    return [
      <Button element={Link} key="add-a-node" to="/drut-cdi/compose-node">
        Compose Node
      </Button>,
      // <ContextualMenu
      //   hasToggleIcon
      //   className="drut-button"
      //   links={[
      //     {
      //       children: "Resources",
      //       onClick: () => history.push("drut-cdi/resources"),
      //     },
      //     {
      //       children: "Nodes",
      //       onClick: () => history.push("drut-cdi/nodes"),
      //     },
      //     {
      //       children: "Events",
      //       onClick: () => history.push("drut-cdi/dfab-events"),
      //     },
      //   ]}
      //   position="right"
      //   toggleLabel="dFabric"
      // />,
    ];
  };

  return (
    <SectionHeader
      key="dashboardHeades"
      buttons={getHeaderButtons()}
      title="Dashboard"
      morelink={
        <NavLink to="/drut-cdi/dfab-health">{fabric && fabric.url}</NavLink>
      }
      subtitle={
        fabric
          ? "Fabric Manager running at "
          : "Fabric Manager inactive or not configured"
      }
      tabLinks={tabs}
    />
  );
};

DashboardHeader.protoTypes = {};

export default DashboardHeader;
