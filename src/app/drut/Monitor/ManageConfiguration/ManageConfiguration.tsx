import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { postData } from "app/drut/config";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import classess from "./ManageConfiguration.module.css";

const getConfigListTable = (
  allConfigurations: MonitorConfiguration[],
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleClick: (
    event: React.MouseEvent<unknown>,
    changedConfig: MonitorConfiguration
  ) => void
) => {
  const isIndeterminate: boolean = allConfigurations.some(
    (config: MonitorConfiguration) => config.display
  );
  const isFullyChecked: boolean = allConfigurations.every(
    (config: MonitorConfiguration) => config.display
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 0, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "50vh" }}>
          <Table stickyHeader sx={{ mb: 0 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isFullyChecked}
                    color="primary"
                    indeterminate={isIndeterminate && !isFullyChecked}
                    inputProps={{
                      "aria-label": "select all configurations",
                    }}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell align="left">Cluster Type</TableCell>
                <TableCell align="left">Widget Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allConfigurations.map(
                (config: MonitorConfiguration, index: number) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      aria-checked={config.display}
                      hover
                      key={config.id}
                      onClick={(event) => handleClick(event, config)}
                      role="checkbox"
                      selected={config.display}
                      tabIndex={-1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={config.display}
                          color="primary"
                          inputProps={{
                            "aria-labelledby": config.header,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        padding="none"
                        scope="row"
                      >
                        {config.cluster_type}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        padding="none"
                        scope="row"
                      >
                        {config.header}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

const ManageConfiguration = ({
  onConfirm,
  onClickBackDrop,
  onClickCancel,
  configurations,
}: {
  onConfirm: (updatedData: MonitorConfiguration[]) => void;
  onClickBackDrop: () => void;
  onClickCancel: () => void;
  configurations: MonitorConfiguration[];
}): JSX.Element => {
  const [allConfigurations, setSelected] = useState(configurations);
  const handleClick = (
    event: React.MouseEvent<unknown>,
    changedConfig: MonitorConfiguration
  ) => {
    console.log(event);
    setSelected((prevConfig: MonitorConfiguration[]) => {
      const selectedConfig: MonitorConfiguration | undefined = prevConfig.find(
        (config) => config.id === changedConfig.id
      );
      if (selectedConfig) {
        selectedConfig.display = !changedConfig.display;
      }
      return [...prevConfig];
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected((prevConfig: MonitorConfiguration[]) => {
      prevConfig.forEach(
        (config: MonitorConfiguration) =>
          (config.display = event.target.checked)
      );
      return [...prevConfig];
    });
  };

  const onSaveHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    saveConfigurations();
  };

  const saveConfigurations = async () => {
    const clusters: { id: number; display: boolean; minimize?: boolean }[] =
      allConfigurations.map((config) => {
        return {
          id: config.id,
          display: config.display,
          minimize: !config.display ? false : config.minimize,
          pinned: config.pinned,
        };
      });
    const payLoad: {
      Clusters: { id: number; display: boolean; minimize?: boolean }[];
    } = {
      Clusters: clusters,
    };
    const response = await postData("dfab/clusters/?op=set_display", payLoad);
    const allClusters = await response.json();
    onConfirm(allClusters);
  };

  return (
    <div>
      <div
        className={classess.backdrop}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClickBackDrop();
        }}
      >
        <div className={classess.modal} onClick={(e) => e.stopPropagation()}>
          <header
            className={classess.header}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{`Display Configurations`}</h2>
          </header>
          <div
            className={classess.content}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ height: "100%", width: "100%" }}
            >
              {getConfigListTable(
                allConfigurations,
                handleSelectAllClick,
                handleClick
              )}
            </div>
          </div>
          <footer
            className={classess.actions}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className={classess.default_btn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClickCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              className={classess.primary_btn}
              onClick={(e) => {
                onSaveHandler(e);
              }}
              variant="contained"
            >
              Save
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ManageConfiguration;
