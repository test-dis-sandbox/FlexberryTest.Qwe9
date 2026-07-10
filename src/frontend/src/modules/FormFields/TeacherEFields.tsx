'use client';

import { Grid, Paper, Typography } from '@mui/material';

import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllStudyPlan from '@/hooks/StudyPlan/useGetAllStudyPlan';
import { IStudyPlanL } from '@/types/StudyPlan.types';
import { tAcademicDegree } from '@/enums/tAcademicDegree.types';

interface TeacherEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const TeacherEFields = ({ isNew = false }: TeacherEFieldsProps) => {
  const { data: studyPlan, isLoading: studyPlanIsLoading } = useGetAllStudyPlan<IStudyPlanL>({
    viewName: 'StudyPlanL',
  });

  const isLoading = studyPlanIsLoading;

  if (isLoading) {
    return (
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <CircularProgressCenter />
      </Paper>
    );
  }

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
              name="dateOfBirth"
              label="Дата рождения"
              required
              rules={{ required: 'Дата рождения - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="degree"
              label="Научная степень"
              options={tAcademicDegree}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="fullName"
              name="fullName"
              label="ФИО"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlCheckbox
              id="partTime"
              name="partTime"
              label="Совместитель"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="studyPlanId"
              label="Учебный план"
              options={studyPlan}
              getOptionLabel={(opt) => opt.specialization?.toString() ?? ''}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default TeacherEFields;
