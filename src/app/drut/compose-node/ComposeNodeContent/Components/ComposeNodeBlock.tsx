import { Notification } from "@canonical/react-components";

import type { Member, RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

const ComposeNodeBlock = ({
  enteredNodeName,
  selectedResourceBlocks,
  setIsMaxPortCountLimitReached,
  selectedZone,
  error,
  setError,
}: {
  enteredNodeName: string;
  selectedResourceBlocks: RBTypeResp;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  selectedZone: string;
  error: string;
  setError: (value: string) => void;
}): JSX.Element => {
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
  const errorValue = error?.toString();

  return (
    <>
      <div className={classes.node_details_content}>
        <div className={classes.node_details_header}>
          <span>
            <strong>Node Name &#58; &nbsp;</strong>
          </span>
          <span>{enteredNodeName}</span>&nbsp;&nbsp;&nbsp;
          <span>
            <strong>Selected Zone &#58; &nbsp;</strong>
          </span>
          <span>{selectedZone}</span>
        </div>
        <div className={classes.node_details_data}>
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
            {errorValue && !errorValue?.includes("AbortError") && (
              <Notification
                onDismiss={() => setError("")}
                inline
                severity="negative"
              >
                {errorValue}
              </Notification>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeNodeBlock;
