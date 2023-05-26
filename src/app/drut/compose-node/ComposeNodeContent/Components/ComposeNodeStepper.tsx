import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import type { RBTypeResp } from "../../Models/ResourceBlock";
import classes from "../../composedNode.module.scss";

import ComposeNodeBlock from "./ComposeNodeBlock";
import StepperContent from "./StepperContent";

import type {
  RackByType,
  Zone,
} from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

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
}): JSX.Element => {
  const steps = [
    "Select Zone",
    "Select Compute Block",
    "Select Target Block(s)",
  ];

  const isStepOptional = (step: number) => step === 2;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  return (
    <div>
      {activeStep !== 0 && selectedIFICRack !== "" && (
        <div className={classes.node_details_box}>
          <ComposeNodeBlock
            enteredNodeName={enteredNodeName}
            selectedResourceBlocks={selectedResourceBlocks}
            setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
            selectedZone={selectedZoneName}
            onCancelCompostion={onCancelCompostion}
          />
        </div>
      )}
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
              stepIndex={activeStep + 1}
              zones={zones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              computeResourceBlocks={computeResourceBlocks}
              targetResourceBlocks={targetResourceBlocks}
              expandedResourceBlockRow={expandedResourceBlockRow}
              setExpandedResourceBlock={setExpandedResourceBlock}
              racks={racks}
              selectedIFICRack={selectedIFICRack}
              selectedTFICRack={selectedTFICRack}
              setSelectedIFICRack={setSelectedIFICRack}
              setSelectedTFICRack={setSelectedTFICRack}
              expandedResourceType={expandedResourceType}
              setExpandedResourceType={setExpandedResourceType}
              enteredNodeName={enteredNodeName}
              setEnteredNodeName={setEnteredNodeName}
              setSelectedResourceBlocks={setSelectedResourceBlocks}
              isMaxPortCountLimitReached={isMaxPortCountLimitReached}
              fetchingResourceBlocks={fetchingResourceBlocks}
              fqnn={fqnn}
              setFqnn={setFqnn}
            />
          </div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <div className={classes.text_button}>
              <Button
                variant="text"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </div>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep !== steps.length - 1 && (
              <div className={classes.contained_button}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isNextDisabled(activeStep)}
                >
                  Next
                </Button>
              </div>
            )}
          </Box>
        </React.Fragment>
      </Box>
    </div>
  );
};

export default ComposeNodeStepper;
