'use client';

import { Grid, Paper, Typography } from '@mui/material';

import ControlTextField from '@/components/TextField';

interface StudentBrigadesEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const StudentBrigadesEFields = ({ isNew = false }: StudentBrigadesEFieldsProps) => {
  return (
    <>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Grid
          container
          spacing={1.5}
          alignItems="flex-end"
        >
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="participants"
              name="participants"
              label="Участники"
              required
              rules={{ required: 'Участники - обязательное поле.' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default StudentBrigadesEFields;
