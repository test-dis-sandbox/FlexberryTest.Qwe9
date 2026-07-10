import * as React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

const CircularProgressCenter = () => (
  <Stack
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <CircularProgress sx={{ mb: 2 }} />
    <Typography
      sx={{ color: 'gray' }}
      variant="subtitle1"
      component="span"
    >
      Загрузка...
    </Typography>
  </Stack>
);

export default CircularProgressCenter;
