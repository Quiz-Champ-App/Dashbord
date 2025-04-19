import { ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // You can change this icon

interface AlertProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title?: string;
  message?: string;
  icon?: ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  open,
  handleClose,
  handleConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  icon = <WarningAmberIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'error.main',
          fontSize: '1.2rem',
        }}
      >
        {icon}
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: 'text.secondary', fontSize: '1rem' }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Alert;
