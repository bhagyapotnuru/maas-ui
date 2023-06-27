import React, { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import Typography from "@mui/material/Typography";

import DataPathOrderDetailsTable from "./DataPathOrderDetailsTable";
import classess from "./NodeList.module.css";

import { fetchDataPathOrdersByNodeId } from "app/drut/api";
import {
  Accordion1 as Accordion,
  AccordionDetails,
  AccordionSummary,
} from "app/drut/components/accordion";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  nodeId: string;
};

const DataPathOrderDetails = (props: Props): JSX.Element => {
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isStringResponse, setIsStringResponseReceived] = useState(false);
  const [dataPathOrderResponseMsg, setDataPathOrderResponseMsg] = useState("");
  const [groupedDataPathOrders, SetGroupDataPathOrders] = useState([] as any);
  const [parentExpanded, setParentExpanded] = React.useState("panel1");
  const [childExpanded, setChildExpanded] = React.useState("panel1");
  const abortController = new AbortController();

  const getDpOrderStatusIcon = (orderStatus: string) => {
    if (orderStatus === "COMPLETED") {
      return "p-icon--success";
    } else if (orderStatus === "IN_PROGRESS") {
      return "p-icon--status-in-progress";
    } else if (orderStatus === "FAILED") {
      return "p-icon--error";
    } else if (orderStatus === "PENDING") {
      return "p-icon--status-waiting";
    }
  };

  useEffect(() => {
    fetchDataPathOrders();
    return () => {
      abortController.abort();
    };
  }, []);

  const fetchDataPathOrders = async () => {
    try {
      setLoading(true);
      const dataPathOrderResponse = await fetchDataPathOrdersByNodeId(
        props.nodeId,
        abortController.signal
      );
      const isString = typeof dataPathOrderResponse === "string";
      setIsStringResponseReceived(isString);
      if (isString) {
        setDataPathOrderResponseMsg(dataPathOrderResponse);
      } else {
        const trasnformedDataPathOrderResponse = (
          dataPathOrderResponse || []
        ).reduce((acc: any, currVal: any) => {
          (acc[currVal.InitiatorEndpoint["@odata.id"]] =
            acc[currVal.InitiatorEndpoint["@odata.id"]] || []).push(currVal);
          return acc;
        }, {});
        SetGroupDataPathOrders(trasnformedDataPathOrderResponse);
        setParentExpanded(Object.keys(trasnformedDataPathOrderResponse)[0]);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleParentChange = (panel: any) => (event: any, newExpanded: any) => {
    setParentExpanded(newExpanded ? panel : false);
  };

  const handleChildChange = (panel: any) => (event: any, newExpanded: any) => {
    setChildExpanded(newExpanded ? panel : false);
  };

  const spinner = (
    <Notification inline severity="information">
      <Spinner text={"Loading..."} />
    </Notification>
  );

  const noDataPathOrderMessage = <span>{dataPathOrderResponseMsg}</span>;

  const dataPathOrdersDom = (
    <div>
      {(Object.keys(groupedDataPathOrders) || []).map(
        (key: any, index: any) => {
          return (
            <Accordion
              expanded={parentExpanded === key}
              onChange={handleParentChange(key)}
            >
              <AccordionSummary
                aria-controls={`${key}_${index}_content`}
                id={`${key}_${index}_header`}
              >
                <Typography>
                  <b>Initiator:</b>{" "}
                  {`${(key || "").replace(
                    "/redfish/v1/Fabrics/DFabric/Endpoints/",
                    ""
                  )}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {groupedDataPathOrders[key].map(
                  (dpo: any, childIndex: number) => {
                    return (
                      <Accordion
                        expanded={
                          childExpanded === dpo?.TargetEndpoint?.["@odata.id"]
                        }
                        onChange={handleChildChange(
                          dpo?.TargetEndpoint?.["@odata.id"]
                        )}
                      >
                        <AccordionSummary
                          aria-controls={`${dpo?.TargetEndpoint?.["@odata.id"]}_${childIndex}_content`}
                          id={`${dpo?.TargetEndpoint?.["@odata.id"]}_${childIndex}_header`}
                        >
                          <CustomizedTooltip
                            title={dpo?.DataPathOrderStatus}
                            style={{ "margin-right": "1%" }}
                          >
                            <i
                              className={getDpOrderStatusIcon(
                                dpo?.DataPathOrderStatus
                              )}
                            />
                          </CustomizedTooltip>
                          <Typography>
                            <div className={classess.datapath_orders_accordian}>
                              <div>
                                <b>Target:</b>{" "}
                                {`${(dpo?.TargetEndpoint?.[
                                  "@odata.id"
                                ]).replace(
                                  "/redfish/v1/Fabrics/DFabric/Endpoints/",
                                  ""
                                )}`}
                              </div>
                              <div>
                                <b>Data Path ID:</b> {`${dpo?.DataPathId}`}
                              </div>
                            </div>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <DataPathOrderDetailsTable
                            datapathOrders={dpo?.OrdersDetails}
                            key={`${index}_${childIndex}`}
                          ></DataPathOrderDetailsTable>
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                )}
              </AccordionDetails>
            </Accordion>
          );
        }
      )}
    </div>
  );

  const getElementToRender = () => {
    if (isLoading) {
      return spinner;
    }
    return isStringResponse ? noDataPathOrderMessage : dataPathOrdersDom;
  };

  const renderData = getElementToRender();
  const errorValue = error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
        </Notification>
      )}
      {renderData}
    </>
  );
};
export default DataPathOrderDetails;
