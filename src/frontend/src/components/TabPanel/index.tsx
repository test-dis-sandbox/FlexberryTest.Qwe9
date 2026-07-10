import { FC } from 'react';
import { Box } from '@mui/material';

interface ITabPanel {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<ITabPanel> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export default TabPanel;
