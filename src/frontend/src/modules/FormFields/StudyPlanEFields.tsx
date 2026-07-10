'use client';

import { Grid, Paper, Typography } from '@mui/material';

import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlTextField from '@/components/TextField';

interface StudyPlanEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const StudyPlanEFields = ({ isNew = false }: StudyPlanEFieldsProps) => {
  return (
    <>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Grid
          container
          spacing={1.5}
          alignItems="flex-end"
        >
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDatePicker
              name="creationDate"
              label="Дата создания"
              required
              rules={{ required: 'Дата создания - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlCheckbox
              id="hasPractice"
              name="hasPractice"
              label="Наличие практики"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="specialization"
              name="specialization"
              label="Специализация"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="totalHours"
              name="totalHours"
              label="Количество часов"
              required
              rules={{ required: 'Количество часов - обязательное поле.' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default StudyPlanEFields;
