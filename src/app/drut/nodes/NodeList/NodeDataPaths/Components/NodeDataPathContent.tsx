import { useContext, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import classes from "../NodeDataPath.module.scss";
import NodeDataPathContext from "../Store/NodeDataPath-Context";
import type { NodeDataPathType } from "../Store/NodeDataPathType";

import NodeDataPathContentTable from "./NodeDataPathContentTable";

import {
  Accordion1 as Accordion,
  AccordionDetails,
  DataPathAccordionSummary as AccordionSummary,
} from "app/drut/components/accordion";

const NodeDataPathContent = (): JSX.Element => {
  const context: NodeDataPathType = useContext(NodeDataPathContext);

  const [expandedIfics, setExpandedIfics] = useState([] as string[]);
  const [expandedTfics, setExpandedTfics] = useState([] as string[]);

  useEffect(() => {
    setExpandedIfics(context.dataPaths.map((d) => d.InitiatorResourceBlock.Id));
    setExpandedTfics(
      context.dataPaths.flatMap((d) =>
        d.TargetResourceBlocks.map(
          (t) => `${d.InitiatorResourceBlock.Id}_${t.Id}`
        )
      )
    );
  }, [context.dataPaths]);

  const onIFicChange = (id: string) => {
    setExpandedIfics((fics: string[]) => [...getUpdatedData(fics, id)]);
  };

  const getUpdatedData = (fics: string[], id: string) => {
    if (fics.includes(id)) {
      fics.splice(
        fics.findIndex((f) => f === id),
        1
      );
    } else {
      fics.push(id);
    }
    return fics;
  };

  const onTFicChange = (id: string) => {
    setExpandedTfics((fics: string[]) => [...getUpdatedData(fics, id)]);
  };

  const DataPathsContentDom = () => {
    return (
      <div>
        {context.dataPaths.map((d) => (
          <div key={d.Id + Math.random()}>
            <Accordion
              expanded={expandedIfics.includes(d.InitiatorResourceBlock.Id)}
              onChange={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                onIFicChange(d.InitiatorResourceBlock.Id);
              }}
            >
              <AccordionSummary>
                <Typography>
                  <div className={classes.initiator_block}>
                    <div className={classes.intiator_block_details}>
                      {!context.nodeId && (
                        <div>
                          <b>Node Name: </b>{" "}
                          <NavLink to={`/drut-cdi/nodes/${d.Id}`}>
                            {d.Name}{" "}
                          </NavLink>
                        </div>
                      )}
                      <div>
                        <b>Initiator Resource Block:</b>{" "}
                        {d.InitiatorResourceBlock.Name}
                      </div>
                    </div>
                    {!context.nodeId && (
                      <div className={classes.intiator_block_details}>
                        <div>
                          <b>Target Blocks: </b>{" "}
                          {d.TargetResourceBlocks.length || 0}
                        </div>
                        <div>
                          <b>Data Paths: </b>{" "}
                          {d.TargetResourceBlocks.reduce(
                            (acc, curr) =>
                              acc + curr.TargetEndpoints.length || 0,
                            0
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {d.TargetResourceBlocks.map((t) => (
                  <Accordion
                    expanded={expandedTfics.includes(
                      `${d.InitiatorResourceBlock.Id}_${t.Id}`
                    )}
                    onChange={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTFicChange(`${d.InitiatorResourceBlock.Id}_${t.Id}`);
                    }}
                  >
                    <AccordionSummary>
                      <div className={classes.target_block_optical_power}>
                        <Typography>
                          <b>Target Resource Block:</b> {t.Name}
                        </Typography>
                        <div className={classes.btn}>
                          <Button
                            size="small"
                            variant="outlined"
                            aria-label="power-icon-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              context.setCurrentDataPath({
                                dataPath: d,
                                targetRB: t,
                              });
                            }}
                          >
                            Optical Power Values
                          </Button>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <NodeDataPathContentTable
                        dataPath={d}
                        targetResourceBlock={t}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <DataPathsContentDom />
    </>
  );
};

export default NodeDataPathContent;
