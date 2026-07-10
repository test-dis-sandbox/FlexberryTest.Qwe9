import { Box, IconButton, LinearProgress, LinearProgressProps, Tooltip, Typography } from '@mui/material';
import { Close, Download } from '@mui/icons-material';

import { useFormDisabled } from '@/components/DisabledFormProvider';

interface LinearProgressWithLabelProps extends LinearProgressProps {
  /** Значение прогресса. */
  value: number;
}

export const LinearProgressWithLabel = ({ value, ...props }: LinearProgressWithLabelProps) => {
  return (
    <>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </>
  );
};

interface InfoDisplayProps {
  /** Объект с информацией о файле. */
  file: WebFile;
  /** Флаг видимости тултипа. */
  open: boolean;

  /**
   * Если `true`, то компонент отключен.
   * @default false
   */
  disabled?: boolean;

  /** Обработчик скачивания файла. */
  onDownload: () => void;

  /** Обработчик очистки файла. */
  onClear: () => void;
}

export const FileInfoDisplay = ({ file, open, disabled = false, onDownload, onClear }: InfoDisplayProps) => {
  return (
    <>
      <Tooltip
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Просмотр доступен только для PDF файлов."
        slotProps={{
          popper: {
            disablePortal: true,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            wordBreak: 'break-all',
            fontFamily: 'Lato, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.name}
        </Typography>
      </Tooltip>
      <Box
        display="flex"
        alignItems="center"
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          title="Скачать"
          size="small"
        >
          <Download />
        </IconButton>
        {!disabled && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            title="Очистить"
            size="small"
          >
            <Close />
          </IconButton>
        )}
      </Box>
    </>
  );
};
