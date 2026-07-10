'use client';

import { Grid, Paper, Typography } from '@mui/material';

import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllTeacher from '@/hooks/Teacher/useGetAllTeacher';
import useGetAllStudyPlan from '@/hooks/StudyPlan/useGetAllStudyPlan';
import useGetAllGroup from '@/hooks/Group/useGetAllGroup';
import { ITeacherL } from '@/types/Teacher.types';
import { IStudyPlanL } from '@/types/StudyPlan.types';
import { IGroupL } from '@/types/Group.types';
import { tStudentStatus } from '@/enums/tStudentStatus.types';
import { emptyGuid } from '@/utils/guidUtils';

interface StudentEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const StudentEFields = ({ isNew = false }: StudentEFieldsProps) => {
  const { data: teacher, isLoading: teacherIsLoading } = useGetAllTeacher<ITeacherL>({
    viewName: 'TeacherL',
  });

  const { data: plan, isLoading: planIsLoading } = useGetAllStudyPlan<IStudyPlanL>({
    viewName: 'StudyPlanL',
  });

  const { data: group, isLoading: groupIsLoading } = useGetAllGroup<IGroupL>({
    viewName: 'GroupL',
  });

  const isLoading = teacherIsLoading || planIsLoading || groupIsLoading;

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
              name="enrollmentDate"
              label="Дата зачисления"
              required
              rules={{ required: 'Дата зачисления - обязательное поле.' }}
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
              id="isBudget"
              name="isBudget"
              label="Бюджетная основа"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="status"
              label="Статус"
              options={tStudentStatus}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="studentId"
              name="studentId"
              label="Номер зачётной книжки"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="teacherId"
              label="Преподаватель"
              options={teacher}
              getOptionLabel={(opt) => opt.fullName?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Преподаватель - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="planId"
              label="Учебный план"
              options={plan}
              getOptionLabel={(opt) => opt.specialization?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Учебный план - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="groupId"
              label="Группа"
              options={group}
              getOptionLabel={(opt) => opt.name?.toString() ?? ''}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default StudentEFields;
