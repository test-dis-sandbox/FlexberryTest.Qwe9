import React from 'react';
import Tooltip from '@mui/material/Tooltip';

import { formatDate } from '@/utils/dateUtils';

interface DateCellRendererProps {
  value: Date | string;
}

export const DateCellRenderer: React.FC<DateCellRendererProps> = ({ value }) => {
  const formatted = formatDate(value);

  return (
    <Tooltip title={formatted}>
      <span>{formatted}</span>
    </Tooltip>
  );
};
