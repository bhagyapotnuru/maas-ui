import { Fragment, useEffect, useState } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";

import type { IficBmc } from "./type";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const IficBmcHeaders = [
  {
    content: "IFIC FQNN",
    sortKey: "Ific_fqnn",
    className: "drut-col-name-left-sn",
    width: 180,
  },
  {
    content: "IFIC IP Address",
    sortKey: "Ific_ipaddress",
    className: "drut-col-name-left-sn",
    width: 100,
  },
  {
    content: "BMC FQNN",
    sortKey: "Bmc_fqnn",
    className: "drut-col-name-left-sn",
    width: 180,
  },
  {
    content: "BMC IP Address",
    sortKey: "Bmc_ipaddress",
    className: "drut-col-name-left-sn",
    width: 100,
  },
];
type Props = {
  searchText: string;
  setSearchText: (searchText: string) => void;
  ificBmcDataValues: IficBmc[];
  pageSize: string;
  prev: number;
  next: number;
};

const IficBmcTable = ({
  searchText,
  ificBmcDataValues,
  pageSize,
  prev,
  next,
}: Props): JSX.Element => {
  const [ificBmcData, setIficBmcData] = useState<IficBmc[]>([]);

  useEffect(() => {
    if (searchText === "") {
      filteredData();
    } else {
      onSearchValueChange(searchText);
    }
  }, [searchText]);

  const onSearchValueChange = (searchText: string) => {
    const filteredConfigs = (ificBmcDataValues || []).filter((row: IficBmc) => {
      return Object.values(row.BMC)
        .concat(Object.values(row.IFIC))
        .join("")
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setIficBmcData(filteredConfigs);
  };

  useEffect(() => {
    filteredData();
  }, [prev, next, pageSize]);

  const filteredData = () => {
    if (searchText === "") {
      if (ificBmcDataValues && ificBmcDataValues.length) {
        const paginatedIficBmc = ificBmcDataValues.slice(
          prev * +pageSize,
          next * +pageSize
        );
        setIficBmcData(paginatedIficBmc);
      }
    }
  };

  const generateRows = (ificBmcData: IficBmc[]) => {
    if (ificBmcData && ificBmcData.length > 0) {
      return ificBmcData.map((ificBmc: IficBmc, index: number) => {
        return {
          key: `${ificBmc.BMC.fqnn}_${index}_${Math.random()}`,
          columns: [
            {
              key: `IFIC_FQNN${index}_${Math.random()}`,
              content: ificBmc.IFIC.fqnn ? (
                <CustomizedTooltip
                  key={`IficBmc_tooltip_${index}`}
                  title={ificBmc?.IFIC.fqnn}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>{ificBmc.IFIC.fqnn}</span>
                </CustomizedTooltip>
              ) : (
                <span>-</span>
              ),
              className: "drut-col-name-left-sn",
              width: 180,
            },

            {
              key: `IFIC_IP_Address${index}_${Math.random()}`,
              content: ificBmc.IFIC.remote_redfish_uri ? (
                <CustomizedTooltip
                  key={`IficBmc_tooltip_${index}`}
                  title={ificBmc.IFIC.remote_redfish_uri}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>
                    <a
                      target="_blank"
                      href={ificBmc.IFIC.remote_redfish_uri}
                      rel="noreferrer"
                    >
                      {ificBmc.IFIC.ip_address}
                    </a>
                  </span>
                </CustomizedTooltip>
              ) : (
                <span>-</span>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
              maxWidth: 100,
            },
            {
              key: `BMC_FQNN${index}_${Math.random()}`,
              content: ificBmc.BMC.fqnn ? (
                <CustomizedTooltip
                  key={`IficBmc_tooltip_${index}`}
                  title={ificBmc?.BMC.fqnn}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>{ificBmc.BMC.fqnn}</span>
                </CustomizedTooltip>
              ) : (
                <span>-</span>
              ),
              className: "drut-col-name-left-sn",
              width: 180,
              maxWidth: 180,
            },

            {
              key: `BMC_IP_Address${index}_${Math.random()}`,
              content: ificBmc.BMC.remote_redfish_uri ? (
                <CustomizedTooltip
                  key={`IficBmc_tooltip_${index}`}
                  title={ificBmc?.BMC.remote_redfish_uri}
                  className="drut-col-name-left-sn-ellipsis"
                  placement={"bottom-start"}
                >
                  <span>
                    <a
                      target="_blank"
                      href={ificBmc.BMC.remote_redfish_uri}
                      rel="noreferrer"
                    >
                      {ificBmc.BMC.ip_address}
                    </a>
                  </span>
                </CustomizedTooltip>
              ) : (
                <span> -</span>
              ),
              className: "drut-col-name-left-sn",
              width: 100,
              maxWidth: 100,
            },
          ],
          sortData: {
            Ific_fqnn: ificBmc.IFIC?.fqnn,
            Ific_ipaddress: ificBmc.IFIC?.ip_address,
            Bmc_fqnn: ificBmc.BMC?.fqnn,
            Bmc_ipaddress: ificBmc.BMC?.ip_address,
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
            <Col size={6} style={{ textAlign: "center", fontWeight: "500" }}>
              IFIC
            </Col>
            <Col size={6} style={{ textAlign: "center", fontWeight: "500" }}>
              BMC
            </Col>
          </Row>
        </div>
        <hr />

        <div>
          <Row>
            <Col size={12}>
              <Fragment key={`nl_${Math.random()}`}>
                <MainTable
                  key={`ificBmcListTable_${Math.random()}`}
                  className="p-table--network-group p-table-expanding--light"
                  defaultSort="Ific_fqnn"
                  defaultSortDirection="ascending"
                  headers={IficBmcHeaders}
                  rows={generateRows(ificBmcData)}
                  sortable
                  emptyStateMsg="No Data available."
                />
              </Fragment>
            </Col>
          </Row>
        </div>
      </Fragment>
    </>
  );
};

export default IficBmcTable;
