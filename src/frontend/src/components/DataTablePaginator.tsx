import React from 'react';
import {
  PaginatorChangeEvent,
  PaginatorPrevPageLinkOptions,
  PaginatorRowsPerPageDropdownOptions,
} from 'primereact/paginator';
import { FormControl, Select, MenuItem } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';

export const CurrentPageReportTemplate = '{first}-{last} из {totalRecords}';

export const rowsPerPageOptionsDefault = [5, 10, 20];

export const DataTablePaginator = (rowsPerPageOptions: number[]) => {
  return {
    layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
    PrevPageLink: (options: PaginatorPrevPageLinkOptions) => (
      <button
        type="button"
        className={options.className}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <KeyboardArrowLeft />
      </button>
    ),
    NextPageLink: (options: PaginatorPrevPageLinkOptions) => (
      <button
        type="button"
        className={options.className}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <KeyboardArrowRight />
      </button>
    ),
    RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
      return (
        <FormControl
          size="small"
          sx={{ ml: '5px' }}
        >
          <Select
            value={options.value}
            // TODO: Так приводить типы не рекомендуется, исправить при возможности.
            onChange={(e) => options.onChange({ ...e.target } as unknown as PaginatorChangeEvent)}
            sx={{
              mr: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
              '& .MuiSelect-select': { padding: '0' },
              '& .MuiOutlinedInput-notchedOutline': { borderWidth: '0' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '0' },
              '& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input': {
                paddingRight: 3,
              },
            }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem
                key={opt}
                value={opt}
              >
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    },
  };
};
