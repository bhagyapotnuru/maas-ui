import { Button } from "@mui/material";

import classess from "./DeleteConfirmationModal.module.css";

const DeleteConfirmationModal = ({
  title,
  message,
  onConfirm,
  onClickBackDrop,
  onClickCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onClickBackDrop: () => void;
  onClickCancel: () => void;
}): JSX.Element => {
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
            <h2>{title}</h2>
          </header>
          <div
            className={classess.content}
            onClick={(e) => e.stopPropagation()}
          >
            <p>{message}</p>
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
                e.preventDefault();
                e.stopPropagation();
                onConfirm();
              }}
              variant="contained"
            >
              Confirm
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
