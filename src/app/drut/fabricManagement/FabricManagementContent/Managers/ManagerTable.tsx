import { useState, useEffect } from "react";

import { MainTable } from "@canonical/react-components";

import type { Manager } from "./type";
import { getIconByStatus } from "./type";

import GroupCheckbox from "app/base/components/GroupCheckbox/GroupCheckbox";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableActions from "app/base/components/TableActions";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks/index";
import { SortDirection } from "app/base/types";
import { generateCheckboxHandlers, isComparable } from "app/utils";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  searchText: string;
  setRenderUpdateManagerForm: (manager: any) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
  managersData: Manager[];
  pageSize: string;
  prev: number;
  next: number;
  selectedIDs: number[];
  setSelectedIDs: (selectedId: number[]) => void;
};

type SortKey =
  | "name"
  | "manager_type"
  | "rack_fqgn"
  | "manufacturer"
  | "ip_address"
  | "port_count"
  | "discovery_status";

const getSortValue = (sortKey: SortKey, manager: Manager) => {
  switch (sortKey) {
    case "discovery_status":
      return manager?.discovery_status;
    case "rack_fqgn":
      return manager?.rack_fqgn || null;
    case "ip_address":
      return manager?.ip_address || null;
    case "port_count":
      return manager?.port_count || 0;
  }
  const value = manager[sortKey];
  return isComparable(value) ? value : null;
};

const ManagerTable = ({
  searchText,
  setRenderUpdateManagerForm,
  setRenderDeleteManagerForm,
  managersData,
  selectedIDs,
  setSelectedIDs,
}: Props): JSX.Element => {
  const managerIds = managersData.map((manager) => manager.id);
  const { currentSort, sortRows, updateSort } = useTableSort<Manager, SortKey>(
    getSortValue,
    {
      key: "manager_type",
      direction: SortDirection.DESCENDING,
    }
  );
  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    Manager["id"]
  >((managerIds) => {
    setSelectedIDs(managerIds);
  });
  const Manager_Headers = [
    {
      content: (
        <GroupCheckbox
          handleGroupCheckbox={handleGroupCheckbox}
          items={managerIds}
          selectedItems={selectedIDs}
        />
      ),
      className: "drut-col-center",
      width: 15,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="discovery_status"
          onClick={() => updateSort("discovery_status")}
          sortKey="discovery_status"
        >
          Discovery Status
        </TableHeader>
      ),
      className: "drut-col-center",
      width: 80,
      maxWidth: 80,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="name"
          onClick={() => updateSort("name")}
          sortKey="name"
        >
          Name
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 100,
      maxWidth: 100,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="manager_type"
          onClick={() => updateSort("manager_type")}
          sortKey="manager_type"
        >
          Manager Type
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 70,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="rack_fqgn"
          onClick={() => updateSort("rack_fqgn")}
          sortKey="rack_fqgn"
        >
          Fully Qualified Group Name
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 130,
      maxWidth: 100,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="manufacturer"
          onClick={() => updateSort("manufacturer")}
          sortKey="manufacturer"
        >
          Manufacturer
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 70,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="ip_address"
          onClick={() => updateSort("ip_address")}
          sortKey="ip_address"
        >
          IP Address
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 80,
      maxWidth: 100,
    },
    {
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="port_count"
          onClick={() => updateSort("port_count")}
          sortKey="port_count"
        >
          Port Count
        </TableHeader>
      ),
      className: "drut-col-name-left-sn",
      width: 60,
      maxWidth: 60,
    },
    {
      content: "Actions",
      className:
        "actions-col u-align--right u-align-non-field u-no-padding--right",
      width: 50,
    },
  ];
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    searchText === ""
      ? setManagers(managersData)
      : onSearchValueChange(searchText);
  }, [searchText]);

  const onSearchValueChange = (searchText: string) => {
    const managers = ((managersData as []) || []).filter((row: any) =>
      Object.values(row)
        .join("")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setManagers(managers);
  };

  const generateRows = (managers: Manager[]) => {
    const sortedManagers = sortRows(managers);

    if (sortedManagers && sortedManagers.length > 0) {
      return sortedManagers.map((manager: Manager, index: number) => {
        return {
          columns: [
            {
              className: "drut-col-name-left-sn",
              content: (
                <RowCheckbox
                  handleRowCheckbox={() =>
                    handleRowCheckbox(manager.id, selectedIDs)
                  }
                  item={manager.id}
                  items={selectedIDs}
                />
              ),
              width: 15,
            },
            {
              content: (
                <CustomizedTooltip
                  title={
                    manager?.discovery_status === "IN_PROGRESS"
                      ? "IN PROGRESS"
                      : manager?.discovery_status
                  }
                  className="drut-col-name-left-sn-ellipsis"
                  placement="bottom-start"
                >
                  <i className={getIconByStatus(manager?.discovery_status)}></i>
                </CustomizedTooltip>
              ),
              className: "drut-col-center",
              width: 80,
              maxWidth: 80,
            },
            {
              content: (
                <>
                  <CustomizedTooltip
                    title={manager?.name}
                    className="drut-col-name-left-sn-ellipsis"
                    placement="bottom-start"
                  >
                    <span>{manager?.name || "-"}</span>
                  </CustomizedTooltip>
                  {manager.mapped_manager && (
                    <CustomizedTooltip
                      title={manager.mapped_manager?.fqnn}
                      className="drut-col-name-left-sn-ellipsis"
                      placement="bottom-start"
                    >
                      <span style={{ fontSize: 12 }}>
                        <b>
                          {manager.manager_type === "IFIC" ? "BMC: " : "IFIC: "}
                        </b>
                        {manager.mapped_manager?.name || "-"}
                      </span>
                    </CustomizedTooltip>
                  )}
                </>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
              maxWidth: 100,
            },
            {
              content: <span>{manager?.manager_type || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 70,
            },
            {
              content: (
                <CustomizedTooltip
                  title={manager?.rack_fqgn}
                  className="drut-col-name-left-sn-ellipsis"
                  placement="bottom-start"
                >
                  <span>{manager?.rack_fqgn || "-"}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 130,
              maxWidth: 130,
            },
            {
              content: <span>{manager?.manufacturer || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 70,
            },
            {
              content: (
                <>
                  <CustomizedTooltip
                    title={
                      manager.manager_type === "OXC"
                        ? `https://${manager?.ip_address}`
                        : manager?.remote_redfish_uri
                    }
                    className="drut-col-name-left-sn-ellipsis"
                    placement="bottom-start"
                  >
                    <span>
                      <a
                        target="_blank"
                        href={
                          manager.manager_type === "OXC"
                            ? `https://${manager?.ip_address}`
                            : manager?.remote_redfish_uri
                        }
                        rel="noreferrer"
                      >
                        {`${manager?.ip_address}${
                          manager?.port ? `-${manager?.port}` : ""
                        }` || "-"}
                      </a>
                    </span>
                  </CustomizedTooltip>
                  {manager.mapped_manager && (
                    <CustomizedTooltip
                      title={manager.mapped_manager?.remote_redfish_uri}
                      className="drut-col-name-left-sn-ellipsis"
                      placement="bottom-start"
                    >
                      <span style={{ fontSize: 12 }}>
                        <b>
                          {manager.manager_type === "IFIC" ? "BMC: " : "IFIC: "}
                        </b>
                        <a
                          target="_blank"
                          href={manager.mapped_manager?.remote_redfish_uri}
                          rel="noreferrer"
                        >
                          {`${manager.mapped_manager.ip_address}${
                            manager.mapped_manager?.port
                              ? `-${manager.mapped_manager?.port}`
                              : ""
                          }` || "-"}
                        </a>
                      </span>
                    </CustomizedTooltip>
                  )}
                </>
              ),
              className: "drut-col-name-left-sn",
              width: 80,
              maxWidth: 100,
            },
            {
              content: <span>{manager?.port_count || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 60,
            },
            {
              content: (
                <TableActions
                  onDelete={() => {
                    setRenderDeleteManagerForm(manager);
                    window.scrollTo(0, 0);
                  }}
                  onEdit={() => {
                    setRenderUpdateManagerForm(manager);
                    window.scrollTo(0, 0);
                  }}
                />
              ),
              className:
                "actions-col u-align--right u-align-non-field u-no-padding--right",
              width: 50,
            },
          ],
        };
      });
    } else {
      return [];
    }
  };

  return (
    <MainTable
      className="p-table--network-group p-table-expanding--light"
      defaultSort="manager_type"
      defaultSortDirection="ascending"
      headers={Manager_Headers}
      rows={generateRows(managers)}
      sortable
      emptyStateMsg={
        searchText
          ? "No Results Found."
          : "No manager created yet or manager data not available."
      }
    />
  );
};

export default ManagerTable;
