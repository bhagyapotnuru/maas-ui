import { Col, Row } from "@canonical/react-components";
import { ThemeProvider } from "@mui/material/styles";

import DSPieChart from "../View/DSPieChart";

import { COLOURS } from "app/base/constants";
import NodeDataPaths from "app/drut/nodes/NodeList/NodeDataPaths/NodeDataPaths";
import NodeDataPathContextProvider from "app/drut/nodes/NodeList/NodeDataPaths/Store/NodeDataPath-Context-Provider";
import customDrutTheme from "app/utils/Themes/Themes";

const DashboardDatapaths = ({ summary }: { summary: any }): JSX.Element => {
  const colorCode = {
    Healthy: { color: COLOURS.POSITIVE, link: "positive" },
    Critical: { color: COLOURS.NEGATIVE, link: "negative" },
    Warning: { color: COLOURS.CAUTION, link: "caution" },
  };

  return (
    <>
      <strong className="p-muted-heading">Datapath Summary</strong>
      <hr />
      <Row>
        <Col size={12}>
          <div className="overall-dashboard-card">
            <DSPieChart
              key={`pathStatus_node`}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: summary?.DataPath?.Nodes?.OK,
                  Critical: summary?.DataPath?.Nodes?.Critical,
                  Warning: summary?.DataPath?.Nodes?.Warning,
                },
                data: null,
                position: 0,
                title: "Nodes",
                total: summary?.DataPath.Nodes?.Count,
                totalTitle: "Nodes",
                unit: "",
              }}
              box={"box1"}
              colorCode={colorCode}
            />
            <DSPieChart
              key={`pathStatus_resource`}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: summary?.DataPath?.ResourceBlock?.OK,
                  Critical: summary?.DataPath?.ResourceBlock?.Critical,
                  Warning: summary?.DataPath?.ResourceBlock?.Warning,
                },
                data: null,
                position: 0,
                title: "Resource Block",
                total: summary?.DataPath?.ResourceBlock?.Count,
                totalTitle: "Attached",
                unit: "",
              }}
              box={"box2"}
              colorCode={colorCode}
            />
            <DSPieChart
              key={`pathStatus_dp`}
              data={{
                chart: "PIE",
                counters: {
                  Healthy: summary?.DataPath?.EndPoints?.OK,
                  Critical: summary?.DataPath?.EndPoints?.Critical,
                  Warning: summary?.DataPath?.EndPoints?.Warning,
                },
                data: null,
                position: 0,
                title: "EndPoints",
                total: summary?.DataPath?.EndPoints?.Count,
                totalTitle: (
                  <span>
                    EndPoints and{" "}
                    <b> {summary?.DataPath?.DataPathCount || "NA"}</b> Datapaths
                  </span>
                ),
                unit: "",
              }}
              box={"box3"}
              colorCode={colorCode}
            />
          </div>
        </Col>
      </Row>
      <br />
      <strong className="p-muted-heading">Datapath Details</strong>
      <hr />
      <Row>
        <Col size={12}>
          <ThemeProvider theme={customDrutTheme}>
            <NodeDataPathContextProvider>
              <NodeDataPaths isNodesPage={false} />
            </NodeDataPathContextProvider>
          </ThemeProvider>
        </Col>
      </Row>
    </>
  );
};
export default DashboardDatapaths;
