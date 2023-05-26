import { useEffect, useState } from "react";

import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";
import classess from "../monitor.module.scss";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  configData: MonitorConfiguration;
  onMinimizeWidget?: (value: number) => void;
};

const MachineDetails = ({ machineData }: { machineData: any }) => {
  return (
    <div className={classess.machine_details_block}>
      <div className={classess.ceph_machine_details_content}>
        <span>TOTAL MACHINES &#58; {machineData.TOTAL_MACHINES}</span>
        <span>CORES &#58; {machineData.CORES}</span>
        <span>RAM &#58; {machineData.RAM}</span>
        <span>STORAGE &#58; {machineData.STORAGE}</span>
      </div>

      <div className={classess.ceph_meter_chart_content}>
        {machineData && Object.keys(machineData).length && (
          <MachineDetailsMeterChart machineData={machineData} />
        )}
      </div>
    </div>
  );
};

const MachineDetailsMeterChart = ({ machineData }: { machineData: any }) => {
  const colorCode = {
    AVAILABLE: { color: COLOURS.POSITIVE, link: "positive" },
    FAILED: { color: COLOURS.NEGATIVE, link: "negative" },
    INTRANSITION: { color: COLOURS.CAUTION, link: "caution" },
    UNKNOWN: { color: COLOURS.LINK_FADED, link: "link-faded" },
    USED: { color: COLOURS.LINK, link: "link" },
  };

  return (
    <div>
      <div className={classess.overall_ceph_meter_chart}>
        {Object.keys(machineData.STATE).map((key) => (
          <div className="u-align--right" key={key}>
            <p className="p-heading--small u-text--light">
              {key}
              <span className="u-nudge-right--small">
                <i
                  className={`p-circle--${
                    colorCode[key as keyof typeof colorCode].link
                  } u-no-margin--top`}
                ></i>
              </span>
            </p>
            <div className="u-nudge-left">{machineData.STATE[key]}</div>
          </div>
        ))}
      </div>
      <div style={{ gridArea: "meter" }}>
        <Meter
          data={Object.keys(machineData.STATE).map((key) => {
            return {
              color: colorCode[key as keyof typeof colorCode].color,
              value: machineData.STATE[key],
            };
          })}
          max={machineData.TOTAL_MACHINES}
          segmented={false /**/}
          small
        />
      </div>
    </div>
  );
};

const ShellInABoxWidget = ({
  configData,
  onMinimizeWidget,
}: Props): JSX.Element => {
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
        <div
          style={{
            width: 950,
            margin: "auto",
            borderRadius: 10,
            border: "1px solid #e7f1ee",
          }}
        >
          {onMinimizeWidget && (
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
                    onClick={(e: any) => {
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
          )}
          <MachineDetails machineData={machineData} />
        </div>
      </ThemeProvider>
    </>
  );
};

export default ShellInABoxWidget;
