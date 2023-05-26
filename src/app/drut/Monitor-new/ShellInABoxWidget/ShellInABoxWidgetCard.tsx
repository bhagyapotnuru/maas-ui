import { useEffect, useState } from "react";

import { ThemeProvider } from "@mui/material/styles";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
// import classess from "../monitor.module.scss";

import DoughnutChart from "app/base/components/DoughnutChart";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";

type Props = {
  configData: MonitorConfiguration;
};

const COLORS = {
  New: { color: "#F99B11", link: "caution" },
  Missing: { color: "#0E8420", link: "positive" },
  Reserved: { color: "#fdb211", link: "caution" },
};

const MachineDetails = ({ machineData }: { machineData: any }) => {
  const segments: Array<any> = [];
  segments.push({
    tooltip: `CORES (${machineData.CORES})`,
    value: machineData.CORES,
    color: COLORS["Missing"].color,
  });
  segments.push({
    tooltip: `RAM (${machineData.RAM})`,
    value: machineData.RAM,
    color: COLORS["Reserved"].color,
  });
  segments.push({
    tooltip: `STORAGE (${machineData.STORAGE})`,
    value: machineData.STORAGE,
    color: COLORS["New"].color,
  });
  return (
    <>
      <div
        style={{
          marginTop: 30,
          fontSize: 14,
          fontWeight: 500,
          color: "#666 !important",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <span style={{ marginRight: 20 }}>CORES &#58; {machineData.CORES}</span>
        <span style={{ marginRight: 20 }}>RAM &#58; {machineData.RAM}</span>
        <span>STORAGE &#58; {machineData.STORAGE}</span>
      </div>
      <>
        <div>
          <div className="dspie-chart-body" style={{ marginLeft: 30 }}>
            <DoughnutChart
              label={machineData.TOTAL_MACHINES}
              segmentHoverWidth={40}
              segmentWidth={30}
              segments={segments}
              size={200}
            />
          </div>
        </div>
      </>
    </>
  );
};

const ShellInABoxWidgetCard = ({ configData }: Props): JSX.Element => {
  const [machineData, setMachineData] = useState({} as any);

  useEffect(() => {
    fetchMachineData();
  }, []);

  const fetchMachineData = async () => {
    try {
      const promise = await fetchData(
        `dfab/summary/?op=get_resourcepool&PoolName=${configData.resourcepool}`
      );
      const response = await promise.json();
      setMachineData(response);
    } catch (e) {}
  };

  return (
    <>
      <ThemeProvider theme={customDrutTheme}>
        <MachineDetails machineData={machineData} />
      </ThemeProvider>
    </>
  );
};

export default ShellInABoxWidgetCard;
