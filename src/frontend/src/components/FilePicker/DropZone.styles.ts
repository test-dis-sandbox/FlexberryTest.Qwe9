import { Box, styled } from '@mui/material';

const DropZone = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'background-color 0.3s ease',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Lato, sans-serif',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export { DropZone };
