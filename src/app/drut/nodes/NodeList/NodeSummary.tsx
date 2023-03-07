import { Fragment } from "react";

import {
  Card,
  Col,
  Row,
  Spinner,
  Notification,
} from "@canonical/react-components";
import { NavLink } from "react-router-dom";

type Props = {
  onNodeDetail: any;
  isRefreshInProgress: boolean;
  isLoadingInProgress: boolean;
  selectedNode: any;
  notFoundError: any;
  onDismissError: () => void;
};

const NodeSummary = (props: Props): JSX.Element => {
  const networkData = (node: any) => {
    const sd: any = [];
    const internal: any = node?.NetworkSummary?.Internal || [];
    const external = node?.NetworkSummary?.External || [];

    sd.push(
      <Col size={7}>
        <Card key={`fnc${Math.random()}`}>
          <strong className="p-muted-heading">
            {node?.NetworkSummary?.Count || "NA"} Network Card
          </strong>
          <hr />
          <div className="drut-node-info-box-1">
            <table
              className="network-card-table"
              key={`Network_table${Math.random()}`}
            >
              <thead>
                <tr key={`network_table_header_${Math.random()}`}>
                  <th>Type</th>
                  <th>Name</th>
                  <th>MAC</th>
                  <th>Permanent MAC</th>
                  <th>{"Speed(Gbps)"}</th>
                </tr>
              </thead>
              <tbody>
                {internal.map((indt: any, index: number) => (
                  <tr key={`${indt}_${index}_${Math.random()}`}>
                    <td>{"Internal"}</td>
                    <td>{indt?.Name || "NA"}</td>
                    <td>{indt?.MACAddress || "NA"}</td>
                    <td>{indt?.PermanentMACAddress || "NA"}</td>
                    <td>{indt?.MaxSpeedGbps || "NA"}</td>
                  </tr>
                ))}
                {external.map((exdt: any, index: number) => (
                  <tr key={`${exdt}_${index}_${Math.random()}`}>
                    <td>{"External"}</td>
                    <td>{exdt?.Name || "NA"}</td>
                    <td>{exdt?.MACAddress || "NA"}</td>
                    <td>{exdt?.PermanentMACAddress || "-"}</td>
                    <td>{exdt?.MaxSpeedGbps || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
    );

    return sd;
  };

  const strorageData = (node: any) => {
    const sd: any = [];
    const internal: any = node?.StorageSummary?.Internal || [];
    const external = node?.StorageSummary?.External || [];

    sd.push(
      <Col size={5}>
        <Card key={`sc_${Math.random()}`}>
          <strong className="p-muted-heading">
            {node?.StorageSummary?.Count || "NA"} Storage{" "}
            {node?.StorageSummary?.TotalCapacityGigaBytes || "0"} GB
          </strong>
          <hr />
          <div className="drut-node-info-box-1">
            <table className="network-card-table">
              <thead>
                <tr key={`Network_table_${Math.random()}`}>
                  <th>Type</th>
                  <th>Media Type</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {internal.map((indt: any, index: number) => (
                  <tr key={`${indt}_${index}_${Math.random()}`}>
                    <td>{"Internal"}</td>
                    <td>{indt.MediaType}</td>
                    <td>{indt.CapacityGigaBytes} GB</td>
                  </tr>
                ))}
                {external.map((exdt: any, index: number) => (
                  <tr key={`${exdt}_${index}_${Math.random()}`}>
                    <td>{"External"}</td>
                    <td>{exdt.MediaType}</td>
                    <td>{exdt.CapacityGigaBytes} GB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
    );

    return sd;
  };

  const offloadData = (node: any) => {
    const sd: any = [];
    const internal: any = node?.OffloadSummary?.Internal || [];
    const external = node?.OffloadSummary?.External || [];

    sd.push(
      <Col size={7}>
        <Card key={`card_${Math.random()}`}>
          <strong className="p-muted-heading">
            {node?.OffloadSummary?.Count || "NA"} Offloads
          </strong>
          <hr />
          <div className="drut-node-info-box-1">
            <table className="network-card-table">
              <thead>
                <tr key={`network_table_header_${Math.random()}`}>
                  <th>Type</th>
                  <th style={{ minWidth: "300px", width: "300px" }}>
                    Device Model
                  </th>
                  <th>{"Speed (in Mhz)"}</th>
                  <th>Cores</th>
                  <th>Threads</th>
                </tr>
              </thead>
              <tbody>
                {internal.map((indt: any, index: number) => (
                  <tr key={`${indt}_${index}_${Math.random()}`}>
                    <td>{"Internal"}</td>
                    <td>{indt?.Model || "NA"}</td>
                    <td>{indt?.MaxSpeedMHz || "NA"}</td>
                    <td>{indt?.TotalCores || "NA"}</td>
                    <td>{indt?.TotalThreads || "NA"}</td>
                  </tr>
                ))}
                {external.map((exdt: any, index: number) => (
                  <tr key={`${exdt}_${index}_${Math.random()}`}>
                    <td>{"External"}</td>
                    <td>{exdt?.Model || "NA"}</td>
                    <td>{exdt?.MaxSpeedMHz || "NA"}</td>
                    <td>{exdt?.TotalCores || "NA"}</td>
                    <td>{exdt?.TotalThreads || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
    );

    return sd;
  };

  const generateNodeDetails = (node: any) => {
    const nodeInfo = [];
    const procesorInfo = [];
    const virtualInfo = [];
    if (node !== null && node !== undefined) {
      Object.keys(node).forEach((key) => {
        if (
          !(key === "Id") &&
          !(key === "MachineId") &&
          !(typeof node[key] === "object")
        ) {
          nodeInfo.push(
            <Col key={`n_${Math.random()}`} size={4}>
              <div className="drut-node-info-box-1">
                <strong className="p-muted-heading">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </strong>
                <br />
                {key === "MachineName" && node[key] ? (
                  <div>
                    <NavLink
                      key={`lsummary_${Math.random()}`}
                      to={`/machine/${node?.MachineId}/summary`}
                    >
                      {node?.MachineName || "NA"}
                    </NavLink>
                  </div>
                ) : (
                  <span>{node[key] || "NA"}</span>
                )}
              </div>
            </Col>
          );
        }
      });

      procesorInfo.push(
        <Col key={`p_${Math.random()}`} size={5}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Device Model</strong>
            <br />
            {node?.ProcessorSummary?.Model || "Model info not available!"}
          </div>
        </Col>
      );
      procesorInfo.push(
        <Col key={`p_${Math.random()}`} size={2}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Cores </strong>
            <br />
            {node?.ProcessorSummary?.TotalCores || "NA"}
          </div>
        </Col>
      );
      procesorInfo.push(
        <Col key={`p_${Math.random()}`} size={2}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Threads </strong>
            <br />
            {node?.ProcessorSummary?.TotalThreads || "NA"}
          </div>
        </Col>
      );
      procesorInfo.push(
        <Col key={`p_${Math.random()}`} size={3}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Memory </strong>
            <br />
            {node?.MemorySummary?.TotalSystemMemoryGiB || "NA"}&nbsp;GB
          </div>
        </Col>
      );
      nodeInfo.push(
        <Col key={`n_${Math.random()}`} size={4}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Health Status</strong>
            <br />
            {node?.Status?.Health || "NA"}
          </div>
        </Col>
      );
      nodeInfo.push(
        <Col key={`n_${Math.random()}`} size={4}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">State</strong>
            <br />
            {node?.Status?.State || "NA"}
          </div>
        </Col>
      );
      virtualInfo.push(
        <Col key={`v_${Math.random()}`} size={3}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Owner </strong>
            <br />
            Drut
          </div>
        </Col>
      );
      virtualInfo.push(
        <Col key={`v_${Math.random()}`} size={3}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Zone </strong>
            <br />
            Default
          </div>
        </Col>
      );
      virtualInfo.push(
        <Col key={`v_${Math.random()}`} size={3}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Resource pool </strong>
            <br />
            Default
          </div>
        </Col>
      );
      virtualInfo.push(
        <Col key={`v_${Math.random()}`} size={3}>
          <div className="drut-node-info-box-1">
            <strong className="p-muted-heading">Power Type </strong>
            <br />
            drutfabric
          </div>
        </Col>
      );
    } else {
      nodeInfo.push(null);
      procesorInfo.push(null);
      virtualInfo.push(null);
    }
    return (
      <Fragment key={`fm_${Math.random()}`}>
        <Row>
          <Col size={12}>
            <div style={{ border: "1px solid #d8dbe0" }}>
              <Row style={{ padding: "3px 10px" }}>{nodeInfo}</Row>
              <hr
                style={{ marginTop: "10px", borderTop: "1px solid #d8dbe0" }}
              />
              <Row style={{ padding: "3px 10px" }}>{virtualInfo}</Row>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col size={12}>
            <Card>
              <strong className="p-muted-heading">{"Processor Info"}</strong>
              <hr />
              <Row style={{ padding: "3px 10px" }}>{procesorInfo}</Row>
            </Card>
          </Col>
        </Row>
        <Row>
          {networkData(node)} {strorageData(node)} {offloadData(node)}
        </Row>
      </Fragment>
    );
  };

  return (
    <>
      {(props.isLoadingInProgress || props.isRefreshInProgress) && (
        <Notification inline severity="information">
          <Spinner
            text={props.isLoadingInProgress ? "Loading..." : "Refreshing..."}
          />
        </Notification>
      )}
      {props.notFoundError && (
        <Notification
          inline
          key={`notification_${Math.random()}`}
          onDismiss={props.onDismissError}
          severity="negative"
        >
          {props.notFoundError}
        </Notification>
      )}
      {!props.isLoadingInProgress &&
        !props.isRefreshInProgress &&
        !props.notFoundError && (
          <div style={{ marginBottom: "15px" }}>
            {generateNodeDetails(props.selectedNode)}
          </div>
        )}
    </>
  );
};

export default NodeSummary;
