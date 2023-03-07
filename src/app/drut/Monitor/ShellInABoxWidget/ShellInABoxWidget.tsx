import { useEffect, useState } from "react";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

import WidgetHeader from "../MonitorWidgetHeader/MonitorWidgetHeader";
import type {
  MonitorAppTypes,
  MonitorConfiguration,
} from "../Types/MonitorConfiguration";
import classess from "../monitor.module.css";

import { CEPH_STATUS_FILTERS } from "./constants";

type Props = {
  resizedWidget: MonitorConfiguration | undefined;
  configData: MonitorConfiguration;
  onRemoveWidget: (value: number) => void;
  onMinimizeWidget: (value: number) => void;
  onPinWidgetHandler: (value: number) => void;
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
    AVALIABLE: { color: COLOURS.POSITIVE, link: "positive" },
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

const StatusFilterChips = ({
  setChipFilter,
  selectedChip,
  appendQueryParamsToIframeUrl,
}: {
  setChipFilter: (value: string) => void;
  selectedChip: string;
  appendQueryParamsToIframeUrl: (selectedChip: string) => void;
}) => {
  return (
    <Stack className={classess.ceph_chip_stack} direction="row" spacing={1}>
      {["All", ...CEPH_STATUS_FILTERS].map((label: string) => (
        <Chip
          color="primary"
          key={label}
          label={label}
          onClick={(event: any) => {
            setChipFilter(event?.target?.innerText);
            appendQueryParamsToIframeUrl(event?.target?.innerText);
          }}
          size="small"
          variant={selectedChip === label ? "filled" : "outlined"}
        />
      ))}
    </Stack>
  );
};

const Divider = (props: { style?: any }) => (
  <div className={classess.divider} {...props} />
);

const Iframe = ({
  url,
  refreshedKey,
}: {
  url: string;
  refreshedKey: string;
}): JSX.Element => {
  console.log(refreshedKey);
  return (
    <div className={classess.widget_iframe} style={{ overflow: "hidden" }}>
      <iframe
        src={url}
        style={{
          position: "relative",
          height: "100%",
          border: "none",
          width: "100%",
          overflow: "hidden",
        }}
        // key={refreshedKey}
      />
    </div>
  );
};

const ApplicationSelect = ({
  applications = [],
  setApplications,
  appendQueryParamsToIframeUrl,
}: {
  applications: MonitorAppTypes[];
  setApplications: (value: MonitorAppTypes[]) => void;
  appendQueryParamsToIframeUrl: (value: string) => void;
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <Autocomplete
      className={classess.ceph_autocomplete}
      disableCloseOnSelect
      getOptionLabel={(value: MonitorAppTypes) => value.appname}
      id="checkboxes-apps"
      multiple
      onBlur={(e) => {
        e.preventDefault();
        e.stopPropagation();
        appendQueryParamsToIframeUrl("");
      }}
      onChange={(key, value: MonitorAppTypes[]) => {
        setApplications(value);
        console.log(key);
      }}
      options={applications}
      renderInput={(params) => (
        <TextField
          className={classess.autocomplete_text_field}
          {...params}
          label="Applications"
          variant="standard"
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            checked={option.checked || selected}
            checkedIcon={checkedIcon}
            icon={icon}
            style={{ marginRight: 8 }}
          />
          {option?.appname}
        </li>
      )}
      renderTags={(list: MonitorAppTypes[]) => {
        const checkedApps: string = list.map((item) => item.appname).join(", ");
        return (
          <CustomizedTooltip
            className={classess.ceph_autocomplete_text}
            title={checkedApps}
          >
            <span>{checkedApps}</span>
          </CustomizedTooltip>
        );
      }}
    />
  );
};

const ShellInABoxWidget = ({
  resizedWidget,
  configData,
  onMinimizeWidget,
  onPinWidgetHandler,
  onRemoveWidget,
}: Props): JSX.Element => {
  const [iframeUrl, setIframeUrl] = useState(configData.shellinabox_url);
  const [applications, setApplications] = useState<MonitorAppTypes[]>();
  const [selectedChip, setChipFilter] = useState("All");
  const [machineData, setMachineData] = useState({} as any);
  const [refreshedKey, refreshKey] = useState(`shell_Iframe_${Math.random()}`);

  useEffect(() => {
    fetchMachineData();
    setIframeUrl(configData.shellinabox_url);
  }, []);

  useEffect(() => {
    if (
      configData.id === resizedWidget?.id ||
      configData.shellinabox_url !== iframeUrl
    ) {
      refreshKey(`ceph_iframe_${Math.random()}`);
    }
  }, [resizedWidget, iframeUrl]);

  const fetchMachineData = async () => {
    try {
      const promise = await fetchData(
        `dfab/summary/?op=get_resourcepool&PoolName=${configData.resourcepool}`
      );
      const response = await promise.json();
      setMachineData(response);
    } catch (e) {}
  };

  const appendQueryParamsToIframeUrl = (selectedChipValue?: string) => {
    const chipFilter = selectedChipValue || selectedChip;
    console.log("COnfig datat", configData.shellinabox_url);
    let newUrl = configData.shellinabox_url;
    console.log("New url ", newUrl);
    if (chipFilter && chipFilter?.toLowerCase() !== "all") {
      newUrl = `${newUrl}&status=${chipFilter?.toLowerCase()}`;
    }
    if (applications && applications.length) {
      applications.forEach((app: MonitorAppTypes) => {
        newUrl = `${newUrl}&app=${app.appname.toLowerCase()}`;
      });
    }
    setIframeUrl(newUrl);
  };

  return (
    <>
      <ThemeProvider theme={customDrutTheme}>
        <WidgetHeader
          configData={configData}
          onMinimizeWidget={onMinimizeWidget}
          onPinWidgetHandler={onPinWidgetHandler}
          onRemoveWidget={onRemoveWidget}
        />
        <MachineDetails machineData={machineData} />
        <div>
          <div className={classess.ceph_actions_header}>
            <div className={classess.ceph_filters}>
              <StatusFilterChips
                appendQueryParamsToIframeUrl={appendQueryParamsToIframeUrl}
                selectedChip={selectedChip}
                setChipFilter={setChipFilter}
              />
              <Divider style={{ height: "30px" }} />
              <ApplicationSelect
                appendQueryParamsToIframeUrl={appendQueryParamsToIframeUrl}
                applications={configData.apps || []}
                setApplications={setApplications}
              />
            </div>
            <div className={classess.ceph_redirect}>
              <a href={iframeUrl} rel="noreferrer" target="_blank">
                <OpenInNewIcon />
              </a>
            </div>
          </div>
          <Iframe refreshedKey={refreshedKey} url={iframeUrl} />
        </div>
      </ThemeProvider>
    </>
  );
};

export default ShellInABoxWidget;
