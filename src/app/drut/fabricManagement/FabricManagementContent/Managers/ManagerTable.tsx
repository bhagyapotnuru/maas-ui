/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useState, useEffect } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";

import type { Manager } from "./type";

import TableActions from "app/base/components/TableActions";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const Manager_Headers = [
  {
    content: "Name",
    sortKey: "managerName",
    className: "drut-col-name-left-sn",
    width: 100,
    maxWidth: 100,
  },
  {
    content: "Manager Type",
    sortKey: "manager_type",
    className: "drut-col-name-left-sn",
    width: 70,
  },
  {
    content: "Fully Qualified Group Name",
    sortKey: "rackFqgn",
    className: "drut-col-name-left-sn",
    width: 130,
    maxWidth: 100,
  },
  {
    content: "Manufacturer",
    sortKey: "manufacturer",
    className: "drut-col-name-left-sn",
    width: 70,
  },
  {
    content: "Protocol",
    sortKey: "protocol",
    className: "drut-col-name-left-sn",
    width: 60,
  },
  {
    content: "IP Address",
    sortKey: "ip_ddress",
    className: "drut-col-name-left-sn",
    width: 80,
    maxWidth: 100,
  },
  {
    content: "Port Count",
    sortKey: "port_count",
    className: "drut-col-name-left-sn",
    width: 50,
    maxWidth: 50,
  },
  {
    content: "Actions",
    sortKey: "actions",
    className: "drut-col-name-left-sn",
    width: 50,
  },
];

type Props = {
  searchText: string;
  setRenderUpdateManagerForm: (manager: any) => void;
  setRenderDeleteManagerForm: (manager: any) => void;
  managersData: Manager[];
  pageSize: string;
  prev: number;
  next: number;
};

const ManagerTable = ({
  searchText,
  setRenderUpdateManagerForm,
  managersData,
  pageSize,
  prev,
  next,
}: Props): JSX.Element => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [managersCopy, setManagersCopy] = useState<Manager[]>([]);

  useEffect(() => {
    setManagers(managersData);
    setManagersCopy(managersData);
  }, []);

  useEffect(() => {
    onSearchValueChange(searchText);
  }, [searchText]);

  const onSearchValueChange = (searchText: string) => {
    const filteredConfigs = (managersData as []).filter((row: any) =>
      Object.values(row)
        .join("")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setManagers(filteredConfigs);
  };

  useEffect(() => {
    if (managersCopy && managersCopy.length) {
      const paginatedManagers = managersCopy.slice(
        prev * +pageSize,
        next * +pageSize
      );
      setManagers(paginatedManagers);
    }
  }, [prev, next]);

  const generateRows = (managers: Manager[]) => {
    if (managers && managers.length > 0) {
      return managers.map((manager: Manager, index: number) => {
        return {
          key: `${manager.id}_${index}_${Math.random()}`,
          columns: [
            {
              key: `Name_${index}_${Math.random()}`,
              content: (
                <CustomizedTooltip
                  className="drut-col-name-left-sn-ellipsis"
                  key={`ManagerName_tooltip_${index}`}
                  placement={"bottom-start"}
                  title={manager?.name}
                >
                  <span>{manager?.name || "-"}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
              maxWidth: 100,
            },
            {
              key: `Type_${index}_${Math.random()}`,
              content: <span>{manager?.manager_type || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 70,
            },
            {
              key: `Fully_Qualified_Group_Name_${index}_${Math.random()}`,
              content: (
                <CustomizedTooltip
                  className="drut-col-name-left-sn-ellipsis"
                  key={`FullyQualifiedGroupName_tooltip_${index}`}
                  placement={"bottom-start"}
                  title={manager?.rack_fqgn}
                >
                  <span>{manager?.rack_fqgn || "-"}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 130,
              maxWidth: 130,
            },
            {
              key: `Manufacturer_${index}_${Math.random()}`,
              content: <span>{manager?.manufacturer || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 70,
            },
            {
              key: `Protocol_${index}_${Math.random()}`,
              content: <span>{manager?.protocol || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 60,
            },

            {
              key: `IP_Address_${index}_${Math.random()}`,
              content: (
                <CustomizedTooltip
                  className="drut-col-name-left-sn-ellipsis"
                  key={`IP_Address_tooltip_${index}`}
                  placement={"bottom-start"}
                  title={manager?.remote_redfish_uri}
                >
                  <span>
                    <a
                      href={manager?.remote_redfish_uri}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {manager?.ip_address || "-"}
                    </a>
                  </span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 80,
              maxWidth: 100,
            },
            {
              key: `Port_Count_${index}_${Math.random()}`,
              content: <span>{manager?.port_count || "-"}</span>,
              className: "drut-col-name-left-sn",
              width: 50,
            },
            {
              key: `Actions_${index}_${Math.random()}`,
              content: (
                <TableActions
                  // For future reference, Currently we are not supporting
                  // onDelete={() => {
                  //   console.log(manager);
                  //   setRenderDeleteManagerForm(manager);
                  // window.scrollTo(0, 0);
                  // }}
                  onEdit={() => {
                    setRenderUpdateManagerForm(manager);
                    window.scrollTo(0, 0);
                  }}
                />
              ),
              className: "drut-col-name-center",
              width: 50,
            },
          ],
          sortData: {
            managerName: manager?.name,
            rackFqgn: manager?.rack_fqgn,
            manufacturer: manager?.manufacturer,
            ip_ddress: manager?.ip_address,
            manager_type: manager?.manager_type,
          },
        };
      });
    } else {
      return [];
    }
  };

  return (
    <>
      <Fragment key={`${Math.random()}`}>
        <div>
          <Row>
            <Col size={12}>
              <Fragment key={`nl_${Math.random()}`}>
                <MainTable
                  className="p-table--network-group p-table-expanding--light"
                  defaultSort="Name"
                  defaultSortDirection="ascending"
                  emptyStateMsg="No manager created yet or manager data not available."
                  headers={Manager_Headers}
                  key={`managerListTable_${Math.random()}`}
                  rows={generateRows(managers)}
                  sortable
                />
              </Fragment>
            </Col>
          </Row>
        </div>
      </Fragment>
    </>
  );
};

export default ManagerTable;
