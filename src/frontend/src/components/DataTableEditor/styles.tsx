import { GlobalStyles, SxProps, Theme } from '@mui/material';
import { green } from '@mui/material/colors';

const trStyles: SxProps<Theme> = {
  '&.p-highlight-added:not(.p-highlight) > td': { backgroundColor: green[100] },
};

export const TableStyles = () => {
  return (
    <GlobalStyles
      styles={{
        '.p-datatable .p-datatable-tbody > tr': trStyles,
      }}
    />
  );
};
