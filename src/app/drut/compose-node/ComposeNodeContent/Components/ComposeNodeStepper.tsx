import React, { useState } from "react";

import { Spinner } from "@canonical/react-components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom-v5-compat";

import type { RBTypeResp, Member } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import StepperContent from "./StepperContent";

import { saveNodeComposition } from "app/drut/api";
import type {
  RackByType,
  ZoneObj as Zone,
} from "app/store/drut/managers/types";

const ComposeNodeStepper = ({
  zones,
  selectedZone,
  setSelectedZone,
  computeResourceBlocks,
  targetResourceBlocks,
  expandedResourceBlockRow,
  setExpandedResourceBlock,
  racks,
  selectedIFICRack,
  setSelectedIFICRack,
  selectedTFICRack,
  setSelectedTFICRack,
  expandedResourceType,
  setExpandedResourceType,
  enteredNodeName,
  setEnteredNodeName,
  selectedResourceBlocks,
  setSelectedResourceBlocks,
  isMaxPortCountLimitReached,
  setIsMaxPortCountLimitReached,
  selectedZoneName,
  setActiveStep,
  activeStep,
  fetchingResourceBlocks,
  fqnn,
  setFqnn,
  setTargetResourceBlocks,
  setResourceBlocksRefreshKey,
  resourceBlocksRefreshKey,
  setResourcesRefreshKey,
  resourcesRefreshKey,
}: {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  computeResourceBlocks: RBTypeResp;
  targetResourceBlocks: RBTypeResp;
  expandedResourceBlockRow: string;
  setExpandedResourceBlock: (value: string) => void;
  racks: RackByType;
  selectedIFICRack: string;
  setSelectedIFICRack: (value: string) => void;
  selectedTFICRack: string;
  setSelectedTFICRack: (value: string) => void;
  expandedResourceType: string;
  setExpandedResourceType: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
  selectedResourceBlocks: RBTypeResp;
  setSelectedResourceBlocks: (value: React.SetStateAction<RBTypeResp>) => void;
  isMaxPortCountLimitReached: boolean;
  setIsMaxPortCountLimitReached: (value: boolean) => void;
  selectedZoneName: string;
  setActiveStep: (value: React.SetStateAction<number>) => void;
  activeStep: number;
  fetchingResourceBlocks: boolean;
  fqnn: any;
  setFqnn: (value: any) => void;
  setTargetResourceBlocks: (value: RBTypeResp) => void;
  setResourceBlocksRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourceBlocksRefreshKey: boolean;
  setResourcesRefreshKey: (value: React.SetStateAction<boolean>) => void;
  resourcesRefreshKey: boolean;
}): JSX.Element => {
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState("");
  const steps = ["Zone", "Compute Block", "Target Block(s)", "Compose"];
  const navigate = useNavigate();

  const isStepOptional = (step: number) => step === 2;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleSkip = () => {
    setActiveStep(3);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextDisabled = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      return !selectedZone || !enteredNodeName;
    }
    if (stepIndex === 1) {
      const computeBlocks = selectedResourceBlocks["Compute"];
      return !computeBlocks || computeBlocks.length === 0;
    }
    return false;
  };

  const onCancelCompostion = () => {
    setActiveStep(0);
    setSelectedZone("");
    setSelectedIFICRack("");
    setSelectedTFICRack("");
    setExpandedResourceType("");
    setSelectedResourceBlocks({});
  };

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
      await saveNodeComposition(payLoad);
      navigate("/drut-cdi/nodes");
    } catch (e: any) {
      const defaultError = "Failed to Compose a Node.";
      setError(e ? e : defaultError);
    } finally {
      setComposing(false);
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          <div>
            <StepperContent
              computeResourceBlocks={computeResourceBlocks}
              enteredNodeName={enteredNodeName}
              error={error}
              expandedResourceBlockRow={expandedResourceBlockRow}
              expandedResourceType={expandedResourceType}
              fetchingResourceBlocks={fetchingResourceBlocks}
              fqnn={fqnn}
              isMaxPortCountLimitReached={isMaxPortCountLimitReached}
              racks={racks}
              resourceBlocksRefreshKey={resourceBlocksRefreshKey}
              resourcesRefreshKey={resourcesRefreshKey}
              selectedIFICRack={selectedIFICRack}
              selectedResourceBlocks={selectedResourceBlocks}
              selectedTFICRack={selectedTFICRack}
              selectedZone={selectedZone}
              setEnteredNodeName={setEnteredNodeName}
              setError={setError}
              setExpandedResourceBlock={setExpandedResourceBlock}
              setExpandedResourceType={setExpandedResourceType}
              setFqnn={setFqnn}
              setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
              setResourceBlocksRefreshKey={setResourceBlocksRefreshKey}
              setResourcesRefreshKey={setResourcesRefreshKey}
              setSelectedIFICRack={setSelectedIFICRack}
              setSelectedResourceBlocks={setSelectedResourceBlocks}
              setSelectedZone={setSelectedZone}
              setTargetResourceBlocks={setTargetResourceBlocks}
              stepIndex={activeStep + 1}
              targetResourceBlocks={targetResourceBlocks}
              zones={zones}
            />
          </div>
          <Box
            sx={{
              pt: 2,
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className={classes.text_button}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="text"
              >
                Back
              </Button>
            </div>
            <div className={classes.fic_block}>
              {activeStep === 1 && (
                <div className={classes.text_button}>
                  <Button
                    disabled={isNextDisabled(activeStep)}
                    onClick={handleSkip}
                    variant="text"
                  >
                    Skip To Compose
                  </Button>
                </div>
              )}
              {activeStep !== steps.length - 1 && (
                <div className={classes.contained_button}>
                  <Button
                    disabled={isNextDisabled(activeStep)}
                    onClick={handleNext}
                    variant="contained"
                  >
                    Next
                  </Button>
                </div>
              )}
              {activeStep === 3 && (
                <div className={`${classes.text_button}`}>
                  <Button
                    color="inherit"
                    disabled={composing}
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
              )}
              {activeStep === 3 && (
                <div className={`${classes.contained_button}`}>
                  <Button
                    color="inherit"
                    disabled={composing}
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
              )}
            </div>
          </Box>
        </React.Fragment>
      </Box>
    </div>
  );
};

export default ComposeNodeStepper;
