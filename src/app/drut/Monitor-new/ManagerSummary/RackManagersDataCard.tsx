import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { NavLink } from "react-router-dom";

import type { Manager } from "../../fabricManagement/FabricManagementContent/Managers/AddManager/type";
import classess from "../monitor.module.scss";

import DoughnutChart from "app/base/components/DoughnutChart";
import { groupAsMap } from "app/utils";

type Props = {
  managerData: Manager[];
  rackName: string;
};

const MANAGER_SUMMARY_PIE_COLOR_CODES: any = {
  OXC: { color: "#84AEAC", link: "morning-blue" },
  IFIC: { color: "#008080", link: "teal" },
  BMC: { color: "#A1CAF1", link: "baby-blue" },
  TFIC: { color: " #4F97A3", link: "cadet-blue" },
  PRU: { color: "#B0E0E6", link: "powder-blue" },
};

const RackManagersDataCard = ({
  managerData,
  rackName,
}: Props): JSX.Element => {
  const [segments, setSegments] = useState([] as any);
  const [labels, setLabels] = useState([] as any);
  const [total, setTotal] = useState("0");
  const half = Math.ceil(labels.length / 2);

  useEffect(() => {
    if (managerData) {
      setTotal(managerData.length.toString());
      const groupMap = groupAsMap(
        managerData,
        (manager: Manager) => manager?.manager_type
      );
      const groupData = Array.from(groupMap).map(([label, configs]) => ({
        label: label?.toString() || "No type",
        total: configs.length,
      }));
      getParsedSummary(groupData);
    }
  }, [managerData]);

  const getParsedSummary = (summary: any = null): any => {
    const data: { [key: string]: number } = {};
    summary.forEach((element: { label: string; total: number }) => {
      data[element.label] = element.total;
    });
    const segments: Array<any> = [];
    const labels: Array<any> = [];
    const ct = data;
    Object.keys(ct).forEach((key: string, index: any) => {
      segments.push({
        color: MANAGER_SUMMARY_PIE_COLOR_CODES[key]?.color,
        tooltip: `${key} (${ct[key]})`,
        value: ct[key],
      });
      labels.push(
        <tr key={"" + index + Math.random()}>
          <td>
            <span className={classess.machine_summary_label}>{key}</span>
          </td>
          <td
            className={`u-align--right ${classess.machine_summary_legend_value}`}
          >
            {ct[key]}
            <span className="u-nudge-right--small">
              <i
                className={`p-circle--${MANAGER_SUMMARY_PIE_COLOR_CODES[key].link}`}
              ></i>
            </span>
          </td>
        </tr>
      );
    });
    setSegments(segments);
    setLabels(labels);
  };
  return (
    <>
      <Card
        key={+rackName}
        sx={{
          minWidth: "18rem",
          width: "18rem",
          height: 300,
          boxShadow: 5,
          minHeight: 300,
          ":hover": {
            boxShadow: 20,
          },
        }}
      >
        <CardContent
          style={{
            height: "-webkit-fill-available",
          }}
        >
          <>
            <div key={`card-content-${rackName}`}>
              <span
                style={{
                  color: "black",
                  fontSize: "1rem",
                  float: "left",
                  fontWeight: 500,
                }}
              >
                <NavLink to={"/drut-cdi/managers"}>{rackName}&nbsp;›</NavLink>
              </span>
            </div>
            <>
              <div style={{ marginTop: 30 }}>
                {managerData.length ? (
                  <>
                    <div
                      className="dspie-chart-body-small"
                      style={{ marginLeft: 65 }}
                    >
                      <DoughnutChart
                        label={total}
                        segmentHoverWidth={20}
                        segmentWidth={15}
                        size={120}
                        segments={segments}
                      />
                    </div>
                    <div>
                      <span>{labels.slice(0, half)}</span>
                      <span>{labels.slice(half)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ marginLeft: 25, marginTop: 50 }}>
                    Manager data not available
                  </div>
                )}
              </div>
            </>
          </>
        </CardContent>
      </Card>
    </>
  );
};

export default RackManagersDataCard;
