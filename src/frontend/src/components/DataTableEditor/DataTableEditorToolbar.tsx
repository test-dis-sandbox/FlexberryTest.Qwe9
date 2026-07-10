import * as React from 'react';
import { Button, Stack, Typography, Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

import { useFormDisabled } from '../DisabledFormProvider';

interface DataTableEditorToolbarProps {
  countSelectedRows: number;
  onCreateButtonClick: () => void;
  onDeleteButtonClick: () => void;
  hideCreateButton?: boolean;
  hideDeleteButton?: boolean;
}

const DataTableEditorToolbar: React.FC<DataTableEditorToolbarProps> = ({
  countSelectedRows,
  onCreateButtonClick,
  onDeleteButtonClick,
  hideCreateButton,
  hideDeleteButton,
}) => {
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      mb={2.5}
    >
      <Typography
        variant="subtitle1"
        sx={{ flexGrow: 1 }}
      >
        {countSelectedRows} объекта(ов) выбрано
      </Typography>
      <Stack
        spacing={2}
        direction="row"
      >
        {hideCreateButton ? null : (
          <Tooltip title="Добавить запись">
            <span>
              <Button
                disabled={formDisabled}
                variant="contained"
                startIcon={<Add />}
                onClick={onCreateButtonClick}
              >
                Создать
              </Button>
            </span>
          </Tooltip>
        )}
        {hideDeleteButton ? null : (
          <Tooltip title={countSelectedRows === 0 ? 'Выберите строку(-ки) для удаления' : 'Удалить выделенные записи'}>
            <span>
              <Button
                variant="contained"
                startIcon={<Remove />}
                disabled={countSelectedRows === 0 || formDisabled}
                onClick={onDeleteButtonClick}
              >
                Удалить
              </Button>
            </span>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default DataTableEditorToolbar;
