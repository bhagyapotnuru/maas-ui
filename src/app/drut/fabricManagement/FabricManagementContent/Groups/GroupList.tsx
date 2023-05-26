import { useEffect, useState, Fragment } from "react";

import {
  Col,
  MainTable,
  Notification,
  SearchBox,
  Row,
  Tooltip,
  Select,
  Spinner,
} from "@canonical/react-components";

import { fetchData } from "../../../config";

import type { Group } from "./type";
import { DEFAULT_GROUP_NAMES } from "./type";

import TableActions from "app/base/components/TableActions";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  setRenderUpdateGroupForm: (group: Group) => void;
  setRenderDeleteGroupForm: (group: Group) => void;
  fetchGroups: boolean;
  setError: (error: string) => void;
  error: string;
  setGroupList: (list: Group[]) => void;
};

const groupOptions = [
  {
    value: "none",
    label: "No filter",
  },
  {
    value: "zone",
    label: "Zone",
  },
  {
    value: "rack",
    label: "Pool",
  },
];
const GroupList = ({
  setRenderUpdateGroupForm,
  setRenderDeleteGroupForm,
  fetchGroups,
  setGroupList,
  setError,
  error,
}: Props): JSX.Element => {
  const abortController = new AbortController();
  const [groupsData, setGroupsData] = useState<Group[]>([]);
  const [groupsDataCopy, setGroupsDataCopy] = useState<Group[]>([]);
  const [filter, setFilter] = useState("");
  const [searchFilterText, setSearchFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = [
    {
      content: "Fully Qualified Group Name",
      sortKey: "FullyQualifiedGroupName",
      className: "drut-col-name-left-sn",
      width: 150,
      maxWidth: 150,
    },
    {
      content: "Group Name",
      sortKey: "GroupName",
      className: "drut-col-name-left-sn",
      width: 100,
    },
    {
      content: "Category",
      sortKey: "Category",
      className: "drut-col-name-left-sn",
      width: 50,
    },
    {
      content: "Actions",
      sortKey: "Actions",
      className: "drut-col-name",
      width: 50,
    },
  ];

  async function getGroupData() {
    setLoading(true);
    await fetchData("dfab/nodegroups/", false, abortController.signal)
      .then((response: any) => response.json())
      .then(
        (response: any) => {
          if (response) {
            response = response.filter(
              (group: any) =>
                !DEFAULT_GROUP_NAMES.includes(group.name.toLowerCase())
            );
            response = response.map((grp: any) => {
              return {
                ...grp,
                categoryName: grp.category === "RACK" ? "POOL" : grp.category,
              };
            });
            setGroupsData(response);
            setGroupsDataCopy(response);
            setGroupList(response);
            setLoading(false);
          }
        },
        (error: any) => {
          setLoading(false);
          setError(error);
        }
      );
  }

  useEffect(() => {
    if (fetchGroups) {
      getGroupData();
      return () => {
        abortController.abort();
      };
    }
  }, [fetchGroups]);

  useEffect(() => {
    if (searchFilterText === "" && filter === "none") {
      setGroupsData(groupsDataCopy);
    } else {
      let filterdGroups = groupsDataCopy.filter((group: Group) =>
        group.name.toLowerCase().includes(searchFilterText.toLowerCase())
      );
      switch (filter) {
        case "none":
          break;
        case "zone":
          filterdGroups = filterdGroups.filter(
            (group) => group?.category.toLowerCase() === "zone"
          );
          break;
        case "rack":
          filterdGroups = filterdGroups.filter(
            (group) => group?.category.toLowerCase() === "rack"
          );
          break;
      }
      setGroupsData(filterdGroups);
    }
  }, [filter, searchFilterText]);

  const getDeleteDisabledMessage = (group: Group) => {
    if (DEFAULT_GROUP_NAMES.includes(group.name.toLowerCase())) {
      return `${group.name} cannot be deleted`;
    }
    if (group?.inUse) {
      return `${group.name} is in use`;
    }
    return "";
  };

  const generateRows = (groups: Group[]) => {
    if (groups && groups.length) {
      return groups.map((group: Group, index: number) => {
        return {
          key: `${group.id}_${index}_${Math.random()}`,
          columns: [
            {
              key: `FullyQualifiedGroupName_${index}_${Math.random()}`,
              content: (
                <CustomizedTooltip
                  key={`FullyQualifiedGroupName_tooltip_${index}`}
                  title={group?.fqgn}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>{group?.fqgn}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 150,
              maxWidth: 150,
            },
            {
              key: `GroupName_${index}_${Math.random()}`,
              content: (
                <CustomizedTooltip
                  key={`FullyQualifiedGroupName_tooltip_${index}`}
                  title={group?.name}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>{group?.name}</span>
                </CustomizedTooltip>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
            },
            {
              key: `GroupCategory_${index}_${Math.random()}`,
              content: <span>{group?.categoryName}</span>,
              className: "drut-col-name-left-sn",
              width: 50,
            },

            {
              key: `Actions_${index}_${Math.random()}`,
              content: (
                <Tooltip
                  key={`disable_icon_tooltip_${index}`}
                  followMouse={true}
                  message={getDeleteDisabledMessage(group)}
                >
                  <TableActions
                    //editDisabled={group.name.toLowerCase() === "drut" || true}
                    deleteDisabled={
                      group.inUse || group.name.toLowerCase() === "default_rack"
                    }
                    onDelete={() => {
                      window.scrollTo(0, 0);
                      setRenderDeleteGroupForm(group);
                    }}
                    // onEdit={() => {
                    //   window.scrollTo(0, 0);
                    //   setRenderUpdateGroupForm(group);
                    // }}
                  />
                </Tooltip>
              ),
              className: "drut-col-name-center",
              width: 50,
            },
          ],
          sortData: {
            GroupName: group?.name,
            GroupType: group?.type,
            Category: group?.category,
            FullyQualifiedGroupName: group?.fqgn,
          },
        };
      });
    } else {
      return [];
    }
  };

  return (
    <Fragment>
      {error && error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          inline
          severity="negative"
        >
          {error}
        </Notification>
      )}
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text="Loading..."
            key={`groupListSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <div>
          <Row>
            <Col size={12}>
              <Fragment>
                <Row className="u-nudge-down--small">
                  <Col size={2}>
                    <Select
                      defaultValue={"none"}
                      name="group-filter"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setFilter(e.target.value);
                      }}
                      options={groupOptions}
                    />
                  </Col>
                  <Col size={6}>
                    <SearchBox
                      key={`searchbox_group_list`}
                      onChange={(searchFilterText: string) => {
                        setSearchFilterText(searchFilterText);
                      }}
                      placeholder="Search Groups"
                    />
                  </Col>
                </Row>
                <hr />
                <MainTable
                  key={`groupListTable_${Math.random()}`}
                  className="p-table--network-group p-table-expanding--light"
                  defaultSort="FullyQualifiedGroupName"
                  defaultSortDirection="ascending"
                  headers={headers}
                  rows={generateRows(groupsData)}
                  sortable
                  emptyStateMsg="No group created yet or Group data not available."
                />
              </Fragment>
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  );
};

export default GroupList;
