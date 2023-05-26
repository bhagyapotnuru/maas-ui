import { useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom-v5-compat";

import type { Member, RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import { postData } from "app/drut/config";

const ComposeNodeBlock = ({
  enteredNodeName,
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  selectedZone,
  onCancelCompostion,
}: {
  enteredNodeName: string;
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  selectedZone: string;
  onCancelCompostion: () => void;
}): JSX.Element => {
  const [error, setError] = useState("");
  const [composing, setComposing] = useState(false);
  const navigate = useNavigate();
  const onClickCompose = async () => {
    try {
      setError("");
      setComposing(true);
      const resourceBlocks: string[] = Object.values(
        selectedResourceBlocks
      ).flatMap((members: Member[]) => members.flatMap((member) => member.Id));
      const payLoad: { Name: string; ResourceBlocks: string[] } = {
        Name: enteredNodeName,
        ResourceBlocks: resourceBlocks,
      };
      const promise = await postData("dfab/nodes/", payLoad);
      if (promise.status === 200) {
        navigate("/drut-cdi/nodes");
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Failed to Compose a Node.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setComposing(false);
    }
  };

  const targetRBs: string[] = Object.keys(selectedResourceBlocks).filter(
    (key: string) => key !== "Compute"
  );
  const isComputeBlockSelected: boolean =
    selectedResourceBlocks && selectedResourceBlocks["Compute"]?.length > 0;
  const selectedTargetRBsCount = targetRBs.reduce(
    (acc, val) => acc + selectedResourceBlocks[val].length,
    0
  );
  const totalIFICDownStreamPorts =
    selectedResourceBlocks["Compute"]?.[0]?.FabricInfo[0]?.DownstreamPorts || 0;
  setIsMaxPortCountLimitReached(
    selectedTargetRBsCount >= totalIFICDownStreamPorts
  );
  return (
    <>
      <div className={classes.node_details_content}>
        <div className={classes.node_details_header}>Node Details &#58;</div>
        <div className={classes.node_details_data}>
          <div>
            <span>
              <strong>Node Name &#58; &nbsp;</strong>
            </span>
            <span>{enteredNodeName}</span>
          </div>
          <div>
            <span>
              <strong>Selected Zone &#58; &nbsp;</strong>
            </span>
            <span>{selectedZone}</span>
          </div>
          <div>
            <span>
              <strong>Selected Compute Block &#58; &nbsp;</strong>
              {isComputeBlockSelected && (
                <span>
                  <strong>
                    {`[`}&nbsp;Total Ports &#58; &nbsp;{" "}
                    {totalIFICDownStreamPorts}
                    &#44; &nbsp; Available &#58; &nbsp;
                    {totalIFICDownStreamPorts - selectedTargetRBsCount}
                    &#44; &nbsp; Selected &#58; &nbsp;
                    {selectedTargetRBsCount} &nbsp;
                    {`]`}
                  </strong>
                </span>
              )}
              {isComputeBlockSelected ? (
                <div className={classes.node_details_resource_block}>
                  {selectedResourceBlocks["Compute"].map(
                    (computeBlock: Member) => {
                      return (
                        <div
                          className={
                            classes.node_details_resource_block_main_content
                          }
                        >
                          <div
                            className={
                              classes.node_details_resource_block_child_content
                            }
                          >
                            <div>
                              {computeBlock?.Manager?.ManagerNodeName || "-"}
                              &nbsp;
                              {"("}
                              {computeBlock?.Manager?.RackName || "-"}
                              {")"}&nbsp;&#x2010;&nbsp;{computeBlock.Name}
                              &#44;&nbsp;
                            </div>
                            <div>
                              <span>Device Count&#58;&nbsp;</span>
                              <span>{computeBlock.Count}&#44;&nbsp;</span>
                            </div>
                            <div>
                              <span>Status &#58; &nbsp;</span>
                              <span>
                                {computeBlock.Status.Health} &#10098;{" "}
                                {computeBlock.Status.State} &#10099;
                              </span>
                            </div>
                          </div>
                          <div>
                            {computeBlock.info.map((info: string) => (
                              <div>{info}</div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <span>No Compute Block Selected.</span>
              )}
            </span>
          </div>
          <div>
            <span>
              <strong>Selected Target Block(s) &#58; &nbsp;</strong>
              {selectedTargetRBsCount > 0 ? (
                <div>
                  {targetRBs
                    .flatMap((key: string) => {
                      return (
                        <>
                          {selectedResourceBlocks[key]?.length > 0 && (
                            <div
                              className={classes.node_details_target_block_box}
                            >
                              <div>
                                <strong>{key}</strong>
                              </div>
                              <div
                                className={`${
                                  classes.node_details_target_block
                                } ${
                                  selectedResourceBlocks[key].length > 2
                                    ? classes.space_between
                                    : classes.start
                                }`}
                              >
                                {selectedResourceBlocks[key].map(
                                  (targetRb: Member) => (
                                    <div
                                      className={
                                        classes.node_details_target_block_content
                                      }
                                    >
                                      <div
                                        className={
                                          classes.node_details_target_block_details
                                        }
                                      >
                                        <div>
                                          {targetRb?.Manager?.ManagerNodeName ||
                                            "-"}
                                          &nbsp;
                                          {"("}
                                          {targetRb?.Manager?.RackName || "-"}
                                          {")"}&nbsp;&#x2010;&nbsp;
                                          {targetRb.Name}
                                          &#44;&nbsp;
                                        </div>
                                        <div
                                          className={classes.rb_device_details}
                                        >
                                          <div>
                                            <span>Device Count&#58;&nbsp;</span>
                                            <span>
                                              {targetRb.Count}&#44;&nbsp;
                                            </span>
                                          </div>
                                          <div>
                                            <span>Status&#58;&nbsp;</span>
                                            <span>
                                              {targetRb.Status.Health} &#10098;
                                              {targetRb.Status.State} &#10099;
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        {targetRb.info.map((info: string) => (
                                          <div>{info}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })
                    .reduce(
                      (acc: JSX.Element[], curr: JSX.Element) =>
                        acc.concat(curr),
                      []
                    )}
                </div>
              ) : (
                <span>No Target Resource Block(s) selected.</span>
              )}
            </span>
          </div>
        </div>
        <div className={`${classes.compose_button}`}>
          <div>
            {error && error.length > 0 && (
              <Notification
                inline
                key={`notification_${Math.random()}`}
                onDismiss={() => setError("")}
                severity="negative"
                style={{ margin: 0 }}
              >
                {error}
              </Notification>
            )}
          </div>
          <div className={classes.compose_node_button}>
            <div className={`${classes.text_button}`}>
              <Button
                color="inherit"
                disabled={!isComputeBlockSelected || composing}
                onClick={(e) => {
                  e.preventDefault();
                  onCancelCompostion();
                }}
                sx={{ mr: 1 }}
                variant="text"
              >
                Cancel
              </Button>
            </div>

            <div className={`${classes.contained_button}`}>
              <Button
                color="inherit"
                disabled={!isComputeBlockSelected || composing}
                onClick={(e) => {
                  e.preventDefault();
                  onClickCompose();
                }}
                sx={{ mr: 1 }}
                variant="contained"
              >
                {composing && (
                  <Spinner
                    color="white"
                    key={`managerListSpinner_${Math.random()}`}
                  />
                )}
                <span>
                  {composing ? `Composing Node...` : `Compose System`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeNodeBlock;
