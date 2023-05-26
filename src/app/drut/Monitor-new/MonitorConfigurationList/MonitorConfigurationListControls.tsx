import { Col, SearchBox, Row, Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";

type Props = {
  setGrouping: (text: string) => void;
  grouping: string;
  setSearchText: (text: string) => void;
  searchText: string;
  setFilter: (text: string) => void;
  filter: string;
};

const groupOptions = [
  {
    value: "none",
    label: "No grouping",
  },
  {
    value: "pool",
    label: "Group by pool",
  },
  {
    value: "type",
    label: "Group by type",
  },
];

const MonitorConfigurationListControls = ({
  setGrouping,
  grouping,
  setSearchText,
  searchText,
  setFilter,
  filter,
}: Props): JSX.Element => {
  const { clusterTypes } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  return (
    <>
      <div>
        <Row>
          <Col size={12}>
            <Row className="u-nudge-down--small">
              <Col size={3}>
                <Select
                  defaultValue={"none"}
                  name="monitor-filtering"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFilter(e.target.value);
                  }}
                  value={filter}
                  options={[
                    {
                      value: "none",
                      label: "No Filter",
                    },
                    ...clusterTypes.map((type: any) => ({
                      key: `type-${type}`,
                      label: type,
                      value: type,
                    })),
                  ]}
                />
              </Col>
              <Col size={6}>
                <SearchBox
                  key={`searchbox_monitor_config_list`}
                  value={searchText}
                  onChange={(searchText: string) => {
                    setSearchText(searchText);
                  }}
                  placeholder="Search Monitor Configs"
                />
              </Col>
              <Col size={3}>
                <Select
                  defaultValue={"none"}
                  name="monitor-grouping"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setGrouping(e.target.value);
                  }}
                  value={grouping}
                  options={groupOptions}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MonitorConfigurationListControls;
