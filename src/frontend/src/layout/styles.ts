import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})<{ sidebarOpen: boolean }>(({ theme, sidebarOpen }) => ({
  marginTop: theme.mixins.toolbar.minHeight,
  marginLeft: sidebarOpen ? '240px' : '0',
  width: sidebarOpen ? 'calc(100% - 240px)' : '100%',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3, 3),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(3, 5),
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(3, 10),
  },
}));

export { MainContent };
