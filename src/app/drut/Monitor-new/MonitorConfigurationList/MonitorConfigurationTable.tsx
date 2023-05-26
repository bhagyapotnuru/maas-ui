import { useEffect, useState } from "react";

import { Button, MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableActions from "app/base/components/TableActions";
import TableHeader from "app/base/components/TableHeader";
import type { TableSort } from "app/base/hooks/index";
import { useTableSort } from "app/base/hooks/index";
import { SortDirection } from "app/base/types";
import {
  generateCheckboxHandlers,
  groupAsMap,
  isComparable,
  simpleSortByKey,
  someInArray,
} from "app/utils";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type Props = {
  grouping: string;
  hiddenGroups: string[];
  monitorConfigs: MonitorConfiguration[];
  selectedIDs: MonitorConfiguration["id"][];
  setHiddenGroups: (hiddenGroups: string[]) => void;
  setSelectedIDs: (selectedId: number[]) => void;
  updateMonitorConfigurationFunctionality: (
    value: MonitorConfiguration
  ) => void;
  setConfigToDelete: (value: MonitorConfiguration) => void;
};

type group = {
  label: any;
  configs: MonitorConfiguration[];
};

type SortKey = keyof MonitorConfiguration;

type GenerateRowParams = {
  handleRowCheckbox: CheckboxHandlers<
    MonitorConfiguration["id"]
  >["handleRowCheckbox"];
  monitorConfigs: MonitorConfiguration[];
  selectedIDs: NonNullable<Props["selectedIDs"]>;
  sortRows: TableSort<MonitorConfiguration, SortKey>["sortRows"];
  updateMonitorConfigurationFunctionality: (
    value: MonitorConfiguration
  ) => void;
  setConfigToDelete: (value: MonitorConfiguration) => void;
};

const getSortValue = (
  sortKey: SortKey,
  monitorConfig: MonitorConfiguration
): string | number | null => {
  switch (sortKey) {
    case "cluster_type":
      return monitorConfig.cluster_type || null;
    case "header":
      return monitorConfig.header || null;
    case "display":
      return monitorConfig.display ? "Yes" : "No";
    case "url":
      return monitorConfig?.url || null;
  }
  const value = monitorConfig[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = ({
  handleRowCheckbox,
  monitorConfigs,
  selectedIDs,
  sortRows,
  updateMonitorConfigurationFunctionality,
  setConfigToDelete,
}: GenerateRowParams) => {
  const sortedMonitorConfigs = sortRows(monitorConfigs);

  return sortedMonitorConfigs.map((row) => {
    const columns = [
      {
        "aria-label": "Type",
        key: "type",
        className: "drut-col-name-left-sn",
        content: (
          // <DoubleRow
          //   data-testid="type-column"
          //   primary={
          //     <RowCheckbox
          //       handleRowCheckbox={() => handleRowCheckbox(row.id, selectedIDs)}
          //       item={row.id}
          //       items={selectedIDs}
          //       inputLabel={row.cluster_type}
          //     />
          //   }
          //   secondary={row.cluster_type}
          //   secondaryClassName={"u-nudge--secondary-row u-align--left"}
          // />
          <RowCheckbox
            handleRowCheckbox={() => handleRowCheckbox(row.id, selectedIDs)}
            item={row.id}
            items={selectedIDs}
            inputLabel={row.cluster_type}
          />
        ),
      },
      {
        "aria-label": "Configuration Url",
        key: "config-url",
        width: 130,
        maxWidth: 130,
        className: "drut-col-name-left-sn-ellipsis",
        content: (
          <CustomizedTooltip
            key={`ManagerName_tooltip_${row.url}`}
            title={row.url}
            className="drut-col-name-left-sn-ellipsis"
            placement={"bottom-start"}
          >
            <a href={row.url} target="_blank" rel="noreferrer">
              {row.url || "-"}
            </a>
          </CustomizedTooltip>
        ),
      },
      {
        "aria-label": "Widget Name",
        key: "header",
        width: 130,
        maxWidth: 130,
        className: "drut-col-name-left-sn-ellipsis",
        content: <span>{row.header}</span>,
      },
      {
        "aria-label": "Description",
        key: "description",
        className: "drut-col-name-left-sn-ellipsis",
        content: <span>{row.description}</span>,
      },
      {
        "aria-label": "Displaying",
        key: "display",
        className: "drut-col-name-left-sn",
        content: <span>{row.display ? "Yes" : "No"}</span>,
      },
      {
        "aria-label": "Actions",
        key: "actions",
        className: "drut-col-name-left-sn",
        content: (
          <TableActions
            deleteDisabled={row.cluster_type === "Maas"}
            editDisabled={row.cluster_type === "Maas"}
            onDelete={() => {
              setConfigToDelete(row);
            }}
            onEdit={() => {
              updateMonitorConfigurationFunctionality(row);
            }}
          />
        ),
      },
    ];

    return {
      key: Math.floor(Math.random() * 1000),
      // className: classNames("machine-list__machine", {
      //   "machine-list__machine--active": isActive,
      //   "truncated-border": showActions,
      // }),
      columns: columns,
    };
  });
};

const generateGroups = (
  grouping: Props["grouping"],
  monitorConfigs: MonitorConfiguration[]
) => {
  if (grouping === "pool") {
    const groupMap = groupAsMap(
      monitorConfigs,
      (config) => config?.applicationpool
    );
    return Array.from(groupMap)
      .map(([label, configs]) => ({
        label: label?.toString() || "No pool",
        configs,
      }))
      .sort(simpleSortByKey("label"));
  }
  if (grouping === "type") {
    const groupMap = groupAsMap(
      monitorConfigs,
      (config) => config.cluster_type
    );
    return Array.from(groupMap)
      .map(([label, configs]) => ({
        label: label?.toString(),
        configs,
      }))
      .sort(simpleSortByKey("label"));
  }

  return null;
};

const generateGroupRows = ({
  groups,
  handleGroupCheckbox,
  hiddenGroups,
  selectedIDs,
  setHiddenGroups,
  updateMonitorConfigurationFunctionality,
  setConfigToDelete,
  ...rowProps
}: {
  groups: any[];
  handleGroupCheckbox: CheckboxHandlers<
    MonitorConfiguration["id"]
  >["handleGroupCheckbox"];
  hiddenGroups: NonNullable<Props["hiddenGroups"]>;
  setHiddenGroups: Props["setHiddenGroups"];
} & Omit<GenerateRowParams, "monitorConfigs">) => {
  let rows: MainTableRow[] = [];
  groups.length &&
    groups.forEach((group) => {
      const { label, configs } = group;
      const monitorConfigIds = configs?.map(
        (config: MonitorConfiguration) => config.id
      );
      const collapsed = hiddenGroups.includes(label);
      rows.push({
        className: "machine-list__group",
        columns: [
          {
            colSpan: 6,
            content: (
              <>
                <DoubleRow
                  data-testid="group-cell"
                  primary={
                    <GroupCheckbox
                      checkAllSelected={(_, selectedIDs) =>
                        monitorConfigIds.every((id: any) =>
                          selectedIDs.includes(id)
                        )
                      }
                      checkSelected={(_, selectedIDs) =>
                        someInArray(selectedIDs, monitorConfigIds)
                      }
                      inRow
                      items={monitorConfigIds}
                      selectedItems={selectedIDs}
                      handleGroupCheckbox={handleGroupCheckbox}
                      inputLabel={<strong>{label}</strong>}
                    />
                  }
                  secondary={
                    <span>{`${monitorConfigIds.length} Monitor Configs`}</span>
                  }
                />
                <div className="machine-list__group-toggle">
                  <Button
                    appearance="base"
                    dense
                    hasIcon
                    onClick={() => {
                      if (collapsed) {
                        setHiddenGroups &&
                          setHiddenGroups(
                            hiddenGroups.filter((group) => group !== label)
                          );
                      } else {
                        setHiddenGroups &&
                          setHiddenGroups(hiddenGroups.concat([label]));
                      }
                    }}
                  >
                    {collapsed ? (
                      <i className="p-icon--plus">Show</i>
                    ) : (
                      <i className="p-icon--minus">Hide</i>
                    )}
                  </Button>
                </div>
              </>
            ),
          },
        ],
      });
      const visibleMonitors = collapsed ? [] : configs;
      rows = rows.concat(
        generateRows({
          ...rowProps,
          monitorConfigs: visibleMonitors,
          selectedIDs,
          updateMonitorConfigurationFunctionality,
          setConfigToDelete,
        })
      );
    });
  return rows;
};

export const MonitorConfigurationTable = ({
  grouping = "none",
  hiddenGroups = [],
  monitorConfigs,
  selectedIDs = [],
  setHiddenGroups,
  setSelectedIDs,
  updateMonitorConfigurationFunctionality,
  setConfigToDelete,
  ...props
}: Props): JSX.Element => {
  const [groups, setGroups] = useState([] as group[]);
  const monitorIds = monitorConfigs.map((config) => config.id);
  const { currentSort, sortRows, updateSort } = useTableSort<
    MonitorConfiguration,
    SortKey
  >(getSortValue, {
    key: "header",
    direction: SortDirection.DESCENDING,
  });

  useEffect(() => {
    const groups = generateGroups(grouping, monitorConfigs) as group[];
    setGroups(groups);
  }, [grouping, monitorConfigs]);

  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    MonitorConfiguration["id"]
  >((monitorConfigIds) => {
    setSelectedIDs(monitorConfigIds);
  });

  const rowProps = {
    handleRowCheckbox,
    sortRows,
  };

  const headers = [
    {
      "aria-label": "Type",
      key: "type",
      content: (
        <div className="u-flex">
          {
            <GroupCheckbox
              data-testid="all-monitorConfigs-checkbox"
              handleGroupCheckbox={handleGroupCheckbox}
              items={monitorIds}
              selectedItems={selectedIDs}
            />
          }
          <div>
            <TableHeader
              currentSort={currentSort}
              data-testid="cluster_type-header"
              onClick={() => {
                updateSort("cluster_type");
              }}
              sortKey="cluster_type"
            >
              Type
            </TableHeader>
          </div>
        </div>
      ),
    },
    {
      "aria-label": "Configured Url",
      key: "url",
      // className: "power-col",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="url-header"
          onClick={() => updateSort("url")}
          sortKey="url"
        >
          Configured Url
        </TableHeader>
      ),
    },
    {
      "aria-label": "Widget Name",
      key: "header",
      // className: "header-col",
      content: (
        <TableHeader
          className="p-double-row__header-spacer"
          currentSort={currentSort}
          data-testid="header-header"
          onClick={() => updateSort("header")}
          sortKey="header"
        >
          Widget Name
        </TableHeader>
      ),
    },
    {
      "aria-label": "Description",
      key: "description",
      // className: "owner-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="description-header"
            onClick={() => updateSort("description")}
            sortKey="description"
          >
            Description
          </TableHeader>
        </>
      ),
    },
    {
      "aria-label": "Displaying",
      key: "display",
      className: "display-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="display-header"
            onClick={() => updateSort("display")}
            sortKey="display"
          >
            Displaying
          </TableHeader>
        </>
      ),
    },
    {
      "aria-label": "Actions",
      key: "actions",
      className: "display-col",
      content: (
        <>
          <TableHeader>Actions</TableHeader>
        </>
      ),
    },
  ];

  let rows: MainTableRow[] | null = null;

  if (grouping === "none") {
    rows = generateRows({
      monitorConfigs,
      selectedIDs,
      updateMonitorConfigurationFunctionality,
      setConfigToDelete,
      ...rowProps,
    });
  } else if (groups) {
    rows = generateGroupRows({
      groups,
      handleGroupCheckbox,
      hiddenGroups,
      selectedIDs,
      setHiddenGroups,
      updateMonitorConfigurationFunctionality,
      setConfigToDelete,
      ...rowProps,
    });
  }

  return (
    <>
      <MainTable
        className={classNames("p-table-expanding--light", "machine-list", {
          "machine-list--grouped": grouping !== "none",
        })}
        headers={headers}
        rows={rows ? rows : undefined}
        emptyStateMsg={"No monitor configs match the search criteria."}
        {...props}
      />
    </>
  );
};

export default MonitorConfigurationTable;
