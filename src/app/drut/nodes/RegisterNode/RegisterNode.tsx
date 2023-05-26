import { useEffect, useState, useLayoutEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
//import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddMachineFormFields from "./AddMachineFormFields";
import FormCard from "./FormCard";
// import FormikForm from "app/base/components/FormikForm";
import FormikForm from "./FormikForm";

import { useAddMessage, useWindowTitle } from "app/base/hooks/index";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import machineURLs from "app/machines/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as generalActions } from "app/store/general";
import {
  architectures as architecturesSelectors,
  defaultMinHweKernel as defaultMinHweKernelSelectors,
  hweKernels as hweKernelsSelectors,
  powerTypes as powerTypesSelectors,
} from "app/store/general/selectors";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

interface Props {
  data: any;
  onRegisterNodeAction: any;
}

export const RegisterMachineForm: any = ({
  data,
  onRegisterNodeAction,
}: Props) => {
  const dispatch = useDispatch();
  //const history = useHistory();

  const architectures = useSelector(architecturesSelectors.get);
  const architecturesLoaded = useSelector(architecturesSelectors.loaded);
  const defaultMinHweKernel = useSelector(defaultMinHweKernelSelectors.get);
  const defaultMinHweKernelLoaded = useSelector(
    defaultMinHweKernelSelectors.loaded
  );
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const hweKernelsLoaded = useSelector(hweKernelsSelectors.loaded);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const machineErrors = useSelector(machineSelectors.errors);
  const powerTypes: any = useSelector(powerTypesSelectors.get);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [powerType, setPowerType] = useState(null);
  const [resetOnSave, setResetOnSave] = useState(false);
  const [savingMachine, setSavingMachine]: [any, any] = useState(null);
  // aditionalMacs
  const [aditionalMacs, setAditionalMacs] = useState([]);

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (machineSaved && resetOnSave) {
      setResetOnSave(false);
    }
  }, [machineSaved, resetOnSave]);

  useWindowTitle("Register Node");

  useAddMessage(
    machineSaved,
    machineActions.cleanup,
    `${savingMachine} added successfully.`,
    () => setSavingMachine(false)
  );

  const initialPowerParameters = useInitialPowerParameters(powerTypes);
  const AddMachineSchema = Yup.object().shape({
    architecture: Yup.string().required("Architecture required"),
    domain: Yup.string().required("Domain required"),
    extra_macs: Yup.array().of(
      Yup.string().matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    ),
    hostname: Yup.string(),
    min_hwe_kernel: Yup.string(),
    pool: Yup.string().required("Resource pool required"),
    power_parameters: Yup.object().shape(
      generatePowerParametersSchema(powerType)
    ),
    power_type: Yup.string().required("Power type required"),
    pxe_mac: Yup.string()
      .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
      .when("power_type", {
        is: (power_type: any) => power_type !== "ipmi",
        then: Yup.string().required("At least one MAC address required"),
      }),
    zone: Yup.string().required("Zone required"),
  });
  const allLoaded =
    architecturesLoaded &&
    defaultMinHweKernelLoaded &&
    domainsLoaded &&
    hweKernelsLoaded &&
    powerTypesLoaded &&
    resourcePoolsLoaded &&
    zonesLoaded;

  initialPowerParameters.power_user = data.user;
  initialPowerParameters.power_pass = data.pass;
  initialPowerParameters.node_id = data.details.id;
  initialPowerParameters.power_address = data.rfu;
  initialPowerParameters.power_protocol = data.protocol;

  useLayoutEffect(() => {
    const amt = JSON.parse(JSON.stringify(data.details.mac));
    amt.shift();
    if (amt.length) {
      setAditionalMacs(amt);
    }
  }, [data]);

  return (
    <>
      {!allLoaded ? (
        <Spinner text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add machine">
          <FormikForm
            cleanup={machineActions.cleanup}
            errors={machineErrors}
            initialValues={{
              architecture: (architectures.length && architectures[0]) || "",
              domain: (domains.length && domains[0].name) || "",
              extra_macs: data.details.mac,
              hostname: data.details.name,
              min_hwe_kernel: defaultMinHweKernel || "",
              pool: (resourcePools.length && resourcePools[0].name) || "",
              power_parameters: initialPowerParameters,
              composed_node_id: data.details.id,
              nodename: data.details.name,
              power_type: "default",
              pxe_mac: data.details.mac[0],
              zone: (zones.length && zones[0].name) || "",
            }}
            onCancel={() =>
              // history.push({ pathname: machineURLs.machines.index })
              onRegisterNodeAction("CLOSE")
            }
            onSaveAnalytics={{
              action: resetOnSave ? "Save and add another" : "Save",
              category: "Machine",
              label: "Register Node",
            }}
            onSubmit={(values: any) => {
              const params = {
                architecture: values.architecture,
                domain: domains.find((domain) => domain.name === values.domain),
                extra_macs: values.extra_macs.filter(Boolean),
                hostname: values.hostname,
                min_hwe_kernel: values.min_hwe_kernel,
                node_id: values.composed_node_id,
                nodename: data.details.name,
                pool: resourcePools.find((pool) => pool.name === values.pool),
                power_parameters: formatPowerParameters(
                  powerType,
                  values.power_parameters
                ),
                power_type: values.power_type || "",
                pxe_mac: values.pxe_mac,
                zone: zones.find((zone) => zone.name === values.zone),
              };
              console.log("Payload ", params);
              dispatch(machineActions.create(params));
              window.scrollTo(0, 0);

              setSavingMachine(values.hostname || "Machine");
            }}
            onValuesChanged={(values) => {
              const powerType = powerTypes.find(
                (type: any) => type.name === values.power_type
              );
              setPowerType(powerType);
            }}
            resetOnSave={resetOnSave}
            saving={machineSaving}
            saved={machineSaved}
            savedRedirect={resetOnSave ? undefined : machineURLs.machines.index}
            secondarySubmit={(_, { submitForm }) => {
              setResetOnSave(true);
              submitForm();
            }}
            // secondarySubmitLabel="Save and add another"
            submitLabel="Save machine"
            validationSchema={AddMachineSchema}
          >
            <AddMachineFormFields saved={machineSaved} macs={aditionalMacs} />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default RegisterMachineForm;
