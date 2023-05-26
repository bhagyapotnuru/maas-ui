import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import { Link as RouterLink, useParams } from "react-router-dom";

import MonitorConfigurationForm from "../MonitorConfigurationForm/MonitorConfigurationForm";
import classess from "../monitor.module.scss";
import monitorUrls from "../url";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";

const MonitorConfigurationAction = (): JSX.Element => {
  const parms: any = useParams();
  return (
    <Section
      key="monitorConfigHeader"
      className="u-no-padding--bottom"
      header={
        <SectionHeader
          title={parms.id ? `Edit Configuration` : `Add New Configuration`}
          buttons={[
            <Button
              className={classess.toggle_btn}
              variant="contained"
              startIcon={<ArrowBackIcon />}
              component={RouterLink}
              to={monitorUrls.monitorDashboardList.index}
            >
              Back
            </Button>,
          ]}
        />
      }
    >
      <MonitorConfigurationForm parmsId={parms.id}></MonitorConfigurationForm>
    </Section>
  );
};

export default MonitorConfigurationAction;
