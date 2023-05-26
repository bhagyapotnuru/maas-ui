import { useState, useEffect } from "react";

import {
  Col,
  MainTable,
  Row,
  Button,
  Icon,
  Tooltip,
} from "@canonical/react-components";

import type { Data } from "app/store/drut/userzones/types";

const UserZoneHeaders = [
  {
    content: "User",
    sortKey: "username",
    width: 100,
  },
  {
    content: "Super User",
    sortKey: "admin",
    width: 50,
  },
  {
    content: "Zones",
    sortKey: "zones",
    width: 180,
  },
  {
    content: "Active Zone",
    sortKey: "active_zone",
    width: 100,
  },
  {
    content: "Actions",
    width: 50,
  },
];
type Props = {
  searchText: string;
  data: Data[];
  pageSize: string;
  prev: number;
  next: number;
  setSearchText: (value: string) => void;
  setRenderAddZonesForm: (val: any) => void;
  setRenderRemoveZonesForm: (val: any) => void;
  setCurrentUser: (val: Data) => void;
};

const UserZoneTable = ({
  searchText,
  data,
  pageSize,
  prev,
  next,
  setRenderAddZonesForm,
  setRenderRemoveZonesForm,
  setCurrentUser,
}: Props): JSX.Element => {
  const [userZoneData, setUserZoneData] = useState<Data[]>([]);

  useEffect(() => {
    setUserZoneData(data);
  }, []);

  useEffect(() => {
    if (searchText === "") {
      filteredData();
    } else {
      onSearchValueChange(searchText);
    }
  }, [searchText]);

  const onSearchValueChange = (searchText: string) => {
    const filteredConfigs = (data || []).filter((row: Data) => {
      const value = Object.values(row).join("").toLowerCase();
      return value.includes(searchText.toLowerCase());
    });
    setUserZoneData(filteredConfigs);
  };

  useEffect(() => {
    filteredData();
  }, [prev, next, pageSize]);

  const filteredData = () => {
    const dataObj = searchText ? userZoneData : data;
    if (dataObj && dataObj.length) {
      const paginatedUserZone = dataObj.slice(
        prev * +pageSize,
        next * +pageSize
      );
      setUserZoneData(paginatedUserZone);
    }
  };

  const generateRows = (userZoneData: Data[]) => {
    if (userZoneData && userZoneData.length > 0) {
      return userZoneData.map((el: Data) => {
        return {
          columns: [
            {
              content: el.username || "-",
              width: 100,
            },
            {
              content: el.is_superuser ? "Yes" : "No",
              width: 50,
            },
            {
              content: el.zonesValue || "-",
              width: 180,
            },
            {
              content: el.active_zone || "-",
              width: 100,
            },
            {
              content: (
                <>
                  <Tooltip message="Add Zones" position="btm-left">
                    <Button
                      appearance="base"
                      hasIcon
                      style={{ margin: 0 }}
                      onClick={() => {
                        setCurrentUser(el);
                        setRenderAddZonesForm(true);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Icon name="plus" />
                    </Button>
                  </Tooltip>

                  <Tooltip message="Remove Zones" position="btm-left">
                    <Button
                      appearance="base"
                      hasIcon
                      style={{ margin: 0 }}
                      disabled={!el.zonesValue}
                      onClick={() => {
                        setCurrentUser(el);
                        setRenderRemoveZonesForm(true);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Icon name="delete" />
                    </Button>
                  </Tooltip>
                </>
              ),
              width: 50,
            },
          ],
          sortData: {
            username: el.username,
            admin: el.is_superuser ? "Yes" : "No",
            zones: el.zones,
            active_zone: el.active_zone,
          },
        };
      });
    } else {
      return [];
    }
  };

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="p-table--network-group p-table-expanding--light"
          defaultSort="username"
          defaultSortDirection="ascending"
          headers={UserZoneHeaders}
          rows={generateRows(userZoneData)}
          sortable
          emptyStateMsg="No Data available."
        />
      </Col>
    </Row>
  );
};

export default UserZoneTable;
