import { GlobalStyles } from '@mui/material';

export const TableStyles = () => {
  return (
    <GlobalStyles
      styles={{
        ['.p-datatable .p-datatable-tbody > tr > td:has(> span.p-highlight-empty)']: {
          backgroundColor: '#e57373', // error.light из стандартной палитры Material-UI
        },
      }}
    />
  );
};
