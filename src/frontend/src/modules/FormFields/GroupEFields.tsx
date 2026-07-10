'use client';

import { Grid, Paper, Typography } from '@mui/material';

import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllDepartment from '@/hooks/Department/useGetAllDepartment';
import useGetAllStudent from '@/hooks/Student/useGetAllStudent';
import { IDepartmentL } from '@/types/Department.types';
import { IStudentL } from '@/types/Student.types';
import { tEducationForm } from '@/enums/tEducationForm.types';
import { emptyGuid } from '@/utils/guidUtils';

interface GroupEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const GroupEFields = ({ isNew = false }: GroupEFieldsProps) => {
  const { data: department, isLoading: departmentIsLoading } = useGetAllDepartment<IDepartmentL>({
    viewName: 'DepartmentL',
  });

  const { data: leader, isLoading: leaderIsLoading } = useGetAllStudent<IStudentL>({
    viewName: 'StudentL',
  });

  const { data: assistant, isLoading: assistantIsLoading } = useGetAllStudent<IStudentL>({
    viewName: 'StudentL',
  });

  const isLoading = departmentIsLoading || leaderIsLoading || assistantIsLoading;

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
            <ControlTextField
              id="name"
              name="name"
              label="Название"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDatePicker
              name="enrollmentYear"
              label="Год поступления"
              required
              rules={{ required: 'Год поступления - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="form"
              label="Форма обучения"
              options={tEducationForm}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlCheckbox
              id="isMaster"
              name="isMaster"
              label="Магистратура"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="fullName"
              name="fullName"
              label="Полное название группы"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="departmentId"
              label="Кафедра"
              options={department}
              getOptionLabel={(opt) => opt.name?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Кафедра - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="leaderId"
              label="Староста"
              options={leader}
              getOptionLabel={(opt) => opt.fullName?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Староста - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="assistantId"
              label="Помощник старосты"
              options={assistant}
              getOptionLabel={(opt) => opt.fullName?.toString() ?? ''}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default GroupEFields;
