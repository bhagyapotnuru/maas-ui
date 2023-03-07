import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { Link as RouterLink, useParams } from "react-router-dom";

import MonitorConfigurationForm from "../MonitorConfigurationForm/MonitorConfigurationForm";
import classess from "../monitor.module.css";
import monitorUrls from "../url";

const MonitorConfigurationAction = (): JSX.Element => {
  const parms: any = useParams();
  return (
    <Section
      className="u-no-padding--bottom"
      header={
        <SectionHeader
          buttons={[
            <Button
              className={classess.toggle_btn}
              component={RouterLink}
              startIcon={<ArrowBackIcon />}
              to={monitorUrls.monitorDashboardList.index}
              variant="contained"
            >
              Back
            </Button>,
          ]}
          title={parms.id ? `Edit Configuration` : `Add New Configuration`}
        />
      }
      key="monitorConfigHeader"
    >
      <MonitorConfigurationForm parmsId={parms.id}></MonitorConfigurationForm>
    </Section>
  );
};

export default MonitorConfigurationAction;
