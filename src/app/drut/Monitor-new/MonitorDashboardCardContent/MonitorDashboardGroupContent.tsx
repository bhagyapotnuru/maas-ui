import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import MonitorDashboardCardContent from "./MonitorDashboardCardContent";

type group = {
  label: string;
  configs: MonitorConfiguration[];
};

const MonitorDashboardGroupContent = ({
  groups,
  setMaximizedWidget,
}: {
  groups: group[];
  setMaximizedWidget: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element => {
  return (
    <>
      <div>
        {groups.map((group: group, index: number) => {
          const { label, configs } = group;
          return (
            <Card
              key={label}
              sx={{
                minWidth: "90%",
                width: "100%",
                boxShadow: 5,
                ":hover": {
                  boxShadow: 20,
                },
              }}
              style={{ marginBottom: 20 }}
            >
              <CardHeader title={label} />
              <CardContent
                style={{
                  height: "-webkit-fill-available",
                }}
              >
                <MonitorDashboardCardContent
                  setMaximizedWidget={setMaximizedWidget}
                  configResponse={configs}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default MonitorDashboardGroupContent;
