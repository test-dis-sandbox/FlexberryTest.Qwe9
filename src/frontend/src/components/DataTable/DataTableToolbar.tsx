import React, { useState } from 'react';
import {
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
  inputBaseClasses,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Search, FileDownloadOutlined, SettingsOutlined } from '@mui/icons-material';

import { useFormDisabled } from '../DisabledFormProvider';

interface DataTableToolbarProps {
  createButtonCaption?: string;
  createButtonDisabledTooltip?: string;
  createButtonDisabled?: boolean;
  removeButtonCaption?: string;
  selected?: boolean;
  countSelectedRows: number;
  onCreateButtonClick: () => void;
  onRemoveButtonClick: () => void;
  onSettingsClick?: () => void;
  onExportClick?: () => void;
  isExporting?: boolean;
  showExportButton?: boolean;
  showRemoveButton?: boolean;
  showCreateButton?: boolean;
  showSettingsButton?: boolean;
  onEditForm?: boolean;
  onGlobalFilterChange: (value: string) => void;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  createButtonCaption = 'Создать',
  createButtonDisabledTooltip,
  createButtonDisabled = false,
  removeButtonCaption = 'Удалить',
  selected,
  countSelectedRows = 0,
  onCreateButtonClick,
  onRemoveButtonClick,
  onSettingsClick,
  onExportClick,
  isExporting,
  showExportButton = true,
  showRemoveButton = true,
  showCreateButton = true,
  showSettingsButton = true,
  onEditForm = false,
  onGlobalFilterChange,
}) => {
  const showToolBarDivider = showSettingsButton && (showRemoveButton || showCreateButton || showExportButton);

  const [globalFilterText, setGlobalFilterText] = useState<string>('');
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      mb={1.25}
      mt={onEditForm ? 0 : 3.75}
    >
      <Stack
        sx={{ flexGrow: 1 }}
        spacing={2.5}
      >
        {!onEditForm && (
          <TextField
            value={globalFilterText}
            onChange={(e) => setGlobalFilterText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onGlobalFilterChange(globalFilterText);
              }
            }}
            placeholder="Поиск"
            sx={{
              maxWidth: '18rem',
              [`& .${inputBaseClasses.input}`]: {
                padding: '0.625rem',
              },
            }}
            slotProps={{
              input: {
                endAdornment: <Search />,
                onClick: () => {
                  onGlobalFilterChange(globalFilterText);
                },
              },
            }}
          />
        )}
        <Typography
          variant="subtitle1"
          sx={{ flexGrow: 1 }}
        >
          {selected && <>{countSelectedRows} объекта(ов) выбрано</>}
        </Typography>
      </Stack>

      <Stack
        spacing={2}
        direction="row"
        sx={{ alignSelf: 'flex-start' }}
      >
        {showCreateButton && (
          <Tooltip title={createButtonDisabled ? createButtonDisabledTooltip : 'Создать запись'}>
            <span>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onCreateButtonClick}
                disabled={createButtonDisabled || formDisabled}
              >
                {createButtonCaption}
              </Button>
            </span>
          </Tooltip>
        )}
        {showRemoveButton && (
          <Tooltip title={countSelectedRows === 0 ? 'Выберите строку(-ки) для удаления' : 'Удалить выделенные записи'}>
            <span>
              <Button
                variant="contained"
                startIcon={<Remove />}
                onClick={onRemoveButtonClick}
                disabled={countSelectedRows === 0 || formDisabled}
              >
                {removeButtonCaption}
              </Button>
            </span>
          </Tooltip>
        )}
        {showExportButton && (
          <Tooltip title="Экспорт данных">
            <span>
              <Button
                variant="contained"
                startIcon={
                  isExporting ? (
                    <CircularProgress
                      size={16}
                      color="inherit"
                    />
                  ) : (
                    <FileDownloadOutlined />
                  )
                }
                onClick={onExportClick}
                disabled={isExporting || !onExportClick}
              >
                Экспортировать
              </Button>
            </span>
          </Tooltip>
        )}
        {showSettingsButton && onSettingsClick && (
          <>
            {showToolBarDivider && (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
            )}
            <Tooltip title="Настройки">
              <IconButton
                color="primary"
                aria-label="settings"
                onClick={onSettingsClick}
              >
                <SettingsOutlined />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default DataTableToolbar;
