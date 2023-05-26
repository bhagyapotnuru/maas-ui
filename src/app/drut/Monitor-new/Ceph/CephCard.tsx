import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircleIcon from "@mui/icons-material/Circle";
import WarningIcon from "@mui/icons-material/Warning";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classes from "../monitor.module.scss";

import customDrutTheme from "app/utils/Themes/Themes";

type Props = {
  configData: MonitorConfiguration;
};

const CephCard = ({ configData }: Props): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={customDrutTheme}>
        <div
          style={{
            marginTop: 30,
            fontSize: 14,
            fontWeight: 500,
            color: "#666 !important",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className={classes.ceph_summary_card}>HOSTS &#58; 10 </div>
          <div className={classes.ceph_summary_card}>MONITORS &#58; 3 </div>
          <div className={classes.ceph_summary_card}>
            OSDs &#58;
            <IconButton
              style={{
                color: "green",
                fontSize: "14px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              9
              <ArrowUpwardIcon
                style={{
                  fontSize: "14px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "green",
                  padding: "0px !important",
                }}
              />
            </IconButton>
            <IconButton
              style={{
                color: "red",
                fontSize: "14px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              9
              <ArrowDownwardIcon
                style={{
                  fontSize: "14px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "red",
                  padding: "0px !important",
                }}
              />
            </IconButton>
          </div>
          <div className={classes.ceph_summary_card}>POOLS &#58; 21</div>
          <div className={classes.ceph_summary_card}>
            PGs PER OSD &#58; 143.7
          </div>
          <div>
            CLUSTER STATUS &#58;
            <IconButton
              style={{
                color: "orange",
                fontSize: "14px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              Health Warning
              <WarningIcon
                style={{
                  fontSize: "14px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "orange",
                }}
              />
            </IconButton>
          </div>
          <div className={classes.ceph_summary_card}>
            OBJECT GATEWAY &#58; 7 Total
          </div>
          <div className={classes.ceph_summary_card}>
            MANAGERS &#58;
            <IconButton
              style={{
                color: "green",
                fontSize: "14px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              1
              <CircleIcon
                style={{
                  fontSize: "14px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "green",
                  padding: "0px !important",
                }}
              />
            </IconButton>
            <IconButton
              style={{
                color: "orange",
                fontSize: "14px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              1
              <CircleIcon
                style={{
                  fontSize: "14px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "orange",
                  padding: "0px !important",
                }}
              />
            </IconButton>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default CephCard;
