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

import WidgetHeader from "../MonitorWidgetHeader/MonitorWidgetHeader";
import type {
  MonitorAppTypes,
  MonitorConfiguration,
} from "../Types/MonitorConfiguration";
import classess from "../monitor.module.css";

import { CEPH_STATUS_FILTERS } from "./constants";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import { fetchData } from "app/drut/config";
import customDrutTheme from "app/utils/Themes/Themes";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

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
    <Stack direction="row" spacing={1} className={classess.ceph_chip_stack}>
      {["All", ...CEPH_STATUS_FILTERS].map((label: string) => (
        <Chip
          size="small"
          label={label}
          color="primary"
          variant={selectedChip === label ? "filled" : "outlined"}
          key={label}
          onClick={(event: any) => {
            setChipFilter(event?.target?.innerText);
            appendQueryParamsToIframeUrl(event?.target?.innerText);
          }}
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
  return (
    <div className={classess.widget_iframe} style={{ overflow: "hidden" }}>
      <iframe
        style={{
          position: "relative",
          height: "100%",
          border: "none",
          width: "100%",
          overflow: "hidden",
        }}
        src={url}
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
      id="checkboxes-apps"
      multiple
      disableCloseOnSelect
      options={applications}
      getOptionLabel={(value: MonitorAppTypes) => value.appname}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={option.checked || selected}
          />
          {option?.appname}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          className={classess.autocomplete_text_field}
          {...params}
          label="Applications"
          variant="standard"
        />
      )}
      renderTags={(list: MonitorAppTypes[]) => {
        const checkedApps: string = list.map((item) => item.appname).join(", ");
        return (
          <CustomizedTooltip
            title={checkedApps}
            className={classess.ceph_autocomplete_text}
          >
            <span>{checkedApps}</span>
          </CustomizedTooltip>
        );
      }}
      onChange={(key, value: MonitorAppTypes[]) => {
        setApplications(value);
      }}
      onBlur={(e) => {
        e.preventDefault();
        e.stopPropagation();
        appendQueryParamsToIframeUrl("");
      }}
      className={classess.ceph_autocomplete}
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
          onRemoveWidget={onRemoveWidget}
          onPinWidgetHandler={onPinWidgetHandler}
          onMinimizeWidget={onMinimizeWidget}
        />
        <MachineDetails machineData={machineData} />
        <div>
          <div className={classess.ceph_actions_header}>
            <div className={classess.ceph_filters}>
              <StatusFilterChips
                setChipFilter={setChipFilter}
                selectedChip={selectedChip}
                appendQueryParamsToIframeUrl={appendQueryParamsToIframeUrl}
              />
              <Divider style={{ height: "30px" }} />
              <ApplicationSelect
                applications={configData.apps || []}
                setApplications={setApplications}
                appendQueryParamsToIframeUrl={appendQueryParamsToIframeUrl}
              />
            </div>
            <div className={classess.ceph_redirect}>
              <a target="_blank" href={iframeUrl}>
                <OpenInNewIcon />
              </a>
            </div>
          </div>
          <Iframe url={iframeUrl} refreshedKey={refreshedKey} />
        </div>
      </ThemeProvider>
    </>
  );
};

export default ShellInABoxWidget;
