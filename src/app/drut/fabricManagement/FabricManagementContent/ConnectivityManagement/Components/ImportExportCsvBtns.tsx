import { Spinner } from "@canonical/react-components";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import classes from "../../../fabricManagement.module.scss";

import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const ImportExportCsvBtns = ({
  selectedZone,
  onImportFile,
  fileToImportPeerConnections,
  onClickCsvUpload,
  uploadingInProgress,
  onClickExportCsv,
  exportingInProgress,
}: {
  selectedZone: string;
  onImportFile: (files: FileList | null) => void;
  fileToImportPeerConnections: FileList | null;
  onClickCsvUpload: () => void;
  uploadingInProgress: boolean;
  onClickExportCsv: () => void;
  exportingInProgress: boolean;
}): JSX.Element => {
  return (
    <div className={classes.import_export_csv_buttons}>
      {uploadingInProgress ? (
        <Spinner text={`Uploading...`} key={`upload_${Math.random()}`} />
      ) : (
        <div>
          {!fileToImportPeerConnections || !fileToImportPeerConnections[0] ? (
            <Button
              variant="outlined"
              component="label"
              endIcon={<AttachFileIcon />}
            >
              Import CSV
              <input
                hidden
                accept=".txt, .csv"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onImportFile(e.target.files);
                }}
              />
            </Button>
          ) : (
            <div className={classes.uploaded_csv_content}>
              <div className={classes.uploaded_csv_content}>
                {fileToImportPeerConnections && fileToImportPeerConnections[0] && (
                  <CustomizedTooltip
                    title={fileToImportPeerConnections[0].name}
                    className={classes.csv_text_file}
                  >
                    <span>{fileToImportPeerConnections[0].name}</span>
                  </CustomizedTooltip>
                )}
                <div className={classes.csv_remove_icon}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      onImportFile(null);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </div>
              </div>
              <div className={classes.csv_upload_btn}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClickCsvUpload();
                  }}
                  variant="contained"
                  startIcon={<UploadFileIcon fontSize="small" />}
                >
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        {exportingInProgress ? (
          <Spinner text={`Exporting...`} key={`export_${Math.random()}`} />
        ) : (
          <CustomizedTooltip
            title={
              !selectedZone
                ? `Please select a zone to export the OXC connectivity information into CSV`
                : ""
            }
          >
            <div>
              <Button
                disabled={!selectedZone}
                variant="outlined"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClickExportCsv();
                }}
              >
                Export CSV
              </Button>
            </div>
          </CustomizedTooltip>
        )}
      </div>
    </div>
  );
};

export default ImportExportCsvBtns;
