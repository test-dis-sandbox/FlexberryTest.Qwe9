import { styled } from '@mui/material/styles';
import { Drawer } from '@mui/material';
const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
  },
  '& .MuiDrawer-paper': {
    border: 'none',
    boxShadow: '0px 2px 2px 0px rgba(157, 172, 207, 0.20)',
    boxSizing: 'border-box',
    width: drawerWidth,
    top: theme.mixins.toolbar.minHeight,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    scrollbarGutter: 'stable',
  },
  '& .MuiButtonBase-root': {
    padding: '3px 10px',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
  },
}));

export { StyledDrawer };
