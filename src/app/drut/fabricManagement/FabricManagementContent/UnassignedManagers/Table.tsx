import { useState, useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import type { Manager } from "../Managers/type";
import { getIconByStatus } from "../Managers/type";

import GroupCheckbox from "app/base/components/GroupCheckbox/GroupCheckbox";
import RowCheckbox from "app/base/components/RowCheckbox/RowCheckbox";
import TableActions from "app/base/components/TableActions";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks/index";
import { SortDirection } from "app/base/types";
import { actions } from "app/store/drut/managers/slice";
import type { RootState } from "app/store/root/types";
import { generateCheckboxHandlers, isComparable } from "app/utils";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  setRenderDeleteManagerForm: (manager: any) => void;
};

type SortKey =
  | "discovery_status"
  | "name"
  | "manager_type"
  | "manufacturer"
  | "ip_address";

const getSortValue = (sortKey: SortKey, manager: Manager) => {
  switch (sortKey) {
    case "discovery_status":
      return manager?.discovery_status;
    case "ip_address":
      return manager?.ip_address || null;
  }
  const value = manager[sortKey];
  return isComparable(value) ? value : null;
};

const ManagerTable = ({ setRenderDeleteManagerForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { unassignedManagers, searchText, selectedIds } = useSelector(
    (state: RootState) => state.Managers
  );
  const [managers, setManagers] = useState<Manager[] | any>([]);
  const unassignedManagersIds = unassignedManagers.map(
    (unassignedManagers: any) => unassignedManagers.id
  );

  const { currentSort, sortRows, updateSort } = useTableSort<Manager, SortKey>(
    getSortValue,
    {
      key: "manager_type",
      direction: SortDirection.DESCENDING,
    }
  );

  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    Manager["id"]
  >((unassignedManagersIds) => {
    dispatch(actions.setSelectedIds(unassignedManagersIds));
  });

  const Manager_Headers = [
    {
      content: (
        <GroupCheckbox
          handleGroupCheckbox={handleGroupCheckbox}
          items={unassignedManagersIds}
          selectedItems={selectedIds}
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
      width: 70,
      maxWidth: 70,
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
      width: 55,
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
      content: "Actions",
      sortKey: "actions",
      className:
        "actions-col u-align--right u-align-non-field u-no-padding--right",
      width: 50,
    },
  ];

  useEffect(() => {
    searchText === ""
      ? setManagers(unassignedManagers)
      : onSearchValueChange(searchText);
  }, [searchText, unassignedManagers]);

  const onSearchValueChange = (searchText: string) => {
    const managers = ((unassignedManagers as []) || []).filter((row: any) =>
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
          key: `${manager.id}_${index}_${Math.random()}`,
          columns: [
            {
              content: (
                <RowCheckbox
                  handleRowCheckbox={() =>
                    handleRowCheckbox(manager.id, selectedIds)
                  }
                  item={manager.id}
                  items={selectedIds}
                />
              ),
              className: "drut-col-center",
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
              width: 70,
              maxWidth: 70,
            },
            {
              content: (
                <CustomizedTooltip
                  title={manager?.name}
                  className="drut-col-name-left-sn-ellipsis"
                  placement="bottom-start"
                >
                  <span>{manager?.name || "-"}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
              maxWidth: 100,
            },
            {
              content: <span>{manager?.manager_type || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 55,
            },
            {
              content: <span>{manager?.manufacturer || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 70,
            },
            {
              content: (
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
              ),
              className: "drut-col-name-left-sn",
              width: 80,
              maxWidth: 100,
            },
            {
              key: `Actions_${index}_${Math.random()}`,
              content: (
                <TableActions
                  onDelete={() => {
                    setRenderDeleteManagerForm(manager);
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
        searchText ? "No Results Found." : "No Unassigned Managers available."
      }
    />
  );
};

export default ManagerTable;
