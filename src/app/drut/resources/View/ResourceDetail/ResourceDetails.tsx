import { useState, useEffect } from "react";

import {
  Col,
  Row,
  Card,
  Accordion,
  Tabs,
  Spinner,
} from "@canonical/react-components";
import { JSONTree } from "react-json-tree";
import { NavLink } from "react-router-dom";

import { genObjAccord, arrayObjectArray } from "../../../parser";

interface Props {
  id: string;
  data: any;
  loading: boolean;
  close?: boolean;
  isMachinesPage?: boolean;
}
const ResourceDetails = ({
  id,
  data,
  loading,
  close,
  isMachinesPage,
}: Props): JSX.Element => {
  const [deviceInformationOpen, setDeviceInformationOpen] = useState<
    string | undefined
  >(undefined);
  const [fabricInformationOpen, setFabricInformation] = useState<
    string | undefined
  >(undefined);
  const [fID, setFID] = useState("");
  useEffect(() => {
    if (close) {
      setDeviceInformationOpen(undefined);
      setFabricInformation(undefined);
      data = {};
    }
  }, [close]);
  const getFabricData = (data: any) => {
    if (data && data.FabricInfo) {
      return data.FabricInfo;
    }
    return { FabricInfo: null };
  };

  const getDataFormat = (fid: any) => {
    setFID(fid);
  };

  const detailedTab = (id: any, data: any) => {
    return (
      <Card style={{ marginTop: "20px" }}>
        <Tabs
          links={[
            {
              active: id === "table" ? true : false,
              id: "table",
              label: "Summary",
              onClick: () => getDataFormat("table"),
            },
            {
              active: id !== "table" ? true : false,
              id: "json",
              label: "Full JSON",
              onClick: () => getDataFormat("json"),
            },
          ]}
        />
        {id === "table" ? (
          tableData(data)
        ) : (
          <div className="drut-details-json">{getJSONData(data)}</div>
        )}
      </Card>
    );
  };

  const getJSONData = (data: any) => {
    return (
      <JSONTree
        data={data}
        key={"jsonModal"}
        keyPath={[]}
        shouldExpandNodeInitially={() => true}
        theme={{
          scheme: "monokai",
          author: "Indu",
          base00: "#000000",
        }}
      />
    );
  };

  const tableData = (data: any) => {
    return (
      !loading && (
        <Col size={12}>
          {!loading && (
            <>
              <strong className="p-muted-heading">Device Information</strong>
              <hr />
              {genObjAccord(data) ? (
                <Accordion
                  className=""
                  expanded={deviceInformationOpen}
                  externallyControlled={true}
                  onExpandedChange={(id: any, title: string) => {
                    console.log(id);
                    setDeviceInformationOpen(title);
                  }}
                  sections={genObjAccord(data)}
                />
              ) : (
                <p>Device data not available.</p>
              )}
              <strong className="p-muted-heading">Fabric Information</strong>
              <hr />
              {arrayObjectArray(getFabricData(data), "FabricInfo").length ? (
                <Accordion
                  className=""
                  expanded={fabricInformationOpen}
                  externallyControlled={true}
                  onExpandedChange={(id: any, title: string) => {
                    console.log(id);
                    setFabricInformation(title);
                  }}
                  sections={arrayObjectArray(
                    getFabricData(data),
                    "Switch Port"
                  )}
                />
              ) : (
                <p>Fabric data not available!</p>
              )}
            </>
          )}
        </Col>
      )
    );
  };

  useEffect(() => {
    getDataFormat("table");
  }, []);

  return (
    <>
      {loading && <Spinner text="Loading..." />}
      {id !== "" && !loading ? (
        <Card
          style={{
            border: "0px",
            padding: "0px 0px 0px 0px",
            marginBottom: "0px",
          }}
        >
          <Row>
            <Col size={6}>
              <strong className="p-muted-heading">Resource Block Name</strong>
              <br />
              <span className="u-no-margin--bottom">{data?.Name}</span>
            </Col>
            <Col size={6}>
              <strong className="p-muted-heading">Resource Block ID</strong>
              <br />
              <span className="u-no-margin--bottom">{data?.Id}</span>
            </Col>
            <Col size={6}>
              <strong className="p-muted-heading">Composition</strong>
              <br />
              <span className="u-no-margin--bottom">
                {data?.CompositionStatus?.CompositionState || "NA"}
              </span>
            </Col>
            <Col size={6}>
              <strong className="p-muted-heading">Health [State]</strong>
              <br />
              <span className="u-no-margin--bottom">
                {data?.Status?.Health} [{data?.Status?.State}]
              </span>
            </Col>
            <Col size={6}>
              <strong className="p-muted-heading">Node</strong>
              <br />
              <span className="u-no-margin--bottom">
                {data?.NodeId ? (
                  <>
                    {isMachinesPage ? (
                      <NavLink
                        key={data?.NodeId}
                        title={data?.NodeName}
                        to={`/drut-cdi/nodes/${data?.NodeId}`}
                      >
                        {data?.NodeName || data?.NodeId}
                      </NavLink>
                    ) : (
                      <span> {data?.NodeName || data?.NodeId}</span>
                    )}
                  </>
                ) : (
                  "NA"
                )}
              </span>
            </Col>
            <Col size={6}>
              <strong className="p-muted-heading">Machine</strong>
              <br />
              <span className="u-no-margin--bottom">
                {data?.MachineId ? (
                  <>
                    <NavLink
                      key={data?.MachineId}
                      title={data?.MachineName}
                      to={`/machine/${data?.MachineId}/summary`}
                    >
                      {data?.MachineName || data?.MachineId}
                    </NavLink>
                  </>
                ) : (
                  "Not registered."
                )}
              </span>
            </Col>
          </Row>
        </Card>
      ) : null}
      <Row>
        {id !== "" && !loading ? (
          <>{detailedTab(fID, data)}</>
        ) : (
          <div className="drut-rddetails-exp"> {tableData(data)} </div>
        )}
      </Row>
    </>
  );
};

export default ResourceDetails;
