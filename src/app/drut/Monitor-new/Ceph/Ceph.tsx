import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import WarningIcon from "@mui/icons-material/Warning";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration;
  onMinimizeWidget: (value: number) => void;
};

const StatusDetails = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 17,
          fontWeight: 300,
          marginLeft: 20,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        Status &#58;
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto 50px",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Cluster Status &#58;
          </div>
          <div>
            <IconButton
              style={{
                color: "orange",
                fontSize: "20px",
                padding: "0px !important",
                marginLeft: 4,
                marginBottom: 4,
                fontWeight: 400,
              }}
            >
              Health Warning
              <WarningIcon
                style={{
                  fontSize: "20px",
                  marginTop: "2px",
                  marginLeft: "2px",
                  color: "orange",
                }}
              />
            </IconButton>
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Hosts &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            10 total
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Monitors &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            3 &#40;quorum 0, 1, 2&#41;
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>OSDs &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>9 Total</span>
            <span>9 up, 9 in</span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto 50px",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Managers &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>1 active</span>
            <span>1 standby</span>
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 12 }}>
            Object Gateways &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            6 total
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Metadata Servers &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            no filesystems
          </div>
        </div>
        <div
          style={{
            width: 200,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            iSCSI Gateways &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>4 total</span>
            <span>4 up, 0 down</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CapacityDetails = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 17,
          fontWeight: 300,
          marginLeft: 20,
          marginBottom: 10,
        }}
      >
        Capacity &#58;
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto 50px",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 270,
            height: 190,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Raw Capacity &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Used &#58; 68.8 Gib</span>
            <span>Available 8.1 Tib</span>
          </div>
        </div>
        <div
          style={{
            width: 270,
            height: 190,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Objects &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>14.2k Objects</span>
            <span>Healthy 100%</span>
          </div>
        </div>
        <div
          style={{
            width: 270,
            height: 190,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>PG status &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>431 PGs</span>
            <span>Cleaning 431</span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto 50px",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 414,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Pools &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            21
          </div>
        </div>
        <div
          style={{
            width: 414,
            height: 100,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>PGs per OSD &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            143.7
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceDetails = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 17,
          fontWeight: 300,
          marginLeft: 20,
          marginBottom: 10,
        }}
      >
        Performance &#58;
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto 50px",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 260,
            height: 200,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Clean Read/Write &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>4 IOPS</span>
            <span>Reads &#58; 4/s, Writes &#58; 0/s</span>
          </div>
        </div>
        <div
          style={{
            width: 260,
            height: 200,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Client Throughput &#58;
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>5 KiB/s</span>
            <span>Reads &#58; 5/s, Writes &#58; 0/s</span>
          </div>
        </div>
        <div
          style={{
            width: 130,
            height: 200,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>
            Recovery Throughput
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            0 B/s
          </div>
        </div>
        <div
          style={{
            width: 130,
            height: 200,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 300, fontSize: 13 }}>Scrubbing &#58;</div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 17,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            Inactive
          </div>
        </div>
      </div>
    </div>
  );
};

const Ceph = ({ configData, onMinimizeWidget }: Props): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={customDrutTheme}>
        <div
          style={{
            // width: 950,
            margin: "auto",
            borderRadius: 10,
            border: "1px solid #e7f1ee",
            background: "#e9ecef",
          }}
        >
          <div
            className={"window-header"}
            key={configData?.id}
            style={{ width: "950px !important" }}
          >
            <div className="logo-container">
              <a target="_blank" href={configData.url}>
                <span className="app-name">{configData?.header}&nbsp;›</span>
              </a>
            </div>
            <div className="actions-container">
              <CustomizedTooltip title={`Minimize`}>
                <IconButton
                  className={`${classess.monitor_minimize_icon}`}
                  aria-label="open_new"
                  color="primary"
                  type="button"
                  disableRipple
                  disableTouchRipple
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMinimizeWidget(+configData.id);
                  }}
                >
                  <CloseFullscreenIcon />
                </IconButton>
              </CustomizedTooltip>
            </div>
          </div>
          <StatusDetails />
          <CapacityDetails />
          <PerformanceDetails />
        </div>
      </ThemeProvider>
    </>
  );
};

export default Ceph;
