import React, { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { COLOURS } from "../../../base/constants";

import DataPathOrderDetailsTable from "./DataPathOrderDetailsTable";
import classess from "./NodeList.module.css";

import { fetchData } from "app/drut/config";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

type Props = {
  nodeId: string;
};

const DataPathOrderDetails = (props: Props): JSX.Element => {
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

  const Accordion = styled((props: any) => (
    <MuiAccordion
      disableGutters={true}
      elevation={0}
      square={false}
      {...props}
    />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    marginBottom: "0.5%",
    fontWeight: "600",
    padding: "0",
  }));

  const AccordionSummary = styled((props: any) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? COLOURS.ACCORDIAN_BG_TRUE
        : COLOURS.ACCORDIAN_BG_FALSE,
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiTypography-root": {
      width: "100%",
      paddingTop: 0,
      fontWeight: 300,
      maxWidth: "none",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  useEffect(() => {
    fetchDataPathOrders();
    return () => {
      abortController.abort();
    };
  }, []);

  const fetchDataPathOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchData(
        `dfab/nodes/${props.nodeId}/?op=get_target_end_point_order_list`,
        false,
        abortController.signal
      );
      const dataPathOrderResponse = await response.json();
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
    } catch (e) {
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

  return <React.Fragment>{renderData}</React.Fragment>;
};
export default DataPathOrderDetails;
