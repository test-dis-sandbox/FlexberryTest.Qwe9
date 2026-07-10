'use client';

import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@mui/material';

interface DialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  captionAgree?: string;
  handleAgree: () => void;
  captionDisagree?: string;
  handleDisagree?: () => void;
  children?: ReactNode;
  closeOnAgree?: boolean;
  closeOnDisagree?: boolean;
  showDisagree?: boolean;
}

const ConfirmationDialog = ({
  open,
  setOpen,
  title = 'Предупреждение',
  description = 'Ваши изменения не сохранены, вы точно хотите выйти?',
  captionAgree = 'Да',
  handleAgree,
  captionDisagree = 'Отмена',
  handleDisagree,
  children,
  closeOnAgree = true,
  closeOnDisagree = true,
  showDisagree = true,
}: DialogProps) => {
  const handleSubmit = () => {
    if (handleAgree) {
      handleAgree();
    }
    if (closeOnAgree) {
      setOpen(false);
    }
  };

  const handleClose = () => {
    if (handleDisagree) {
      handleDisagree();
    }

    if (closeOnDisagree) {
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions sx={{ scrollbarGutter: 'stable' }}>
          <Button onClick={handleSubmit}>{captionAgree}</Button>
          {showDisagree && <Button onClick={handleClose}>{captionDisagree}</Button>}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
