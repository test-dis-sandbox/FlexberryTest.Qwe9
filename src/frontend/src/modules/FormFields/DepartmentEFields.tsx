'use client';

import { Grid, Paper, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlDataTableEditor, { ControlColumnEditor, OptionsEnum } from '@/components/DataTableEditor';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlFilePicker from '@/components/FilePicker';
import ControlTextField from '@/components/TextField';
import useGetAllFaculty from '@/hooks/Faculty/useGetAllFaculty';
import useGetAllStudent from '@/hooks/Student/useGetAllStudent';
import { IDepartmentE } from '@/types/Department.types';
import { IFacultyL } from '@/types/Faculty.types';
import { IStudentL } from '@/types/Student.types';
import { IGroupD as IGroupGroupD } from '@/types/Group.types';
import { tDirection } from '@/enums/tDirection.types';
import { tEducationForm } from '@/enums/tEducationForm.types';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

interface DepartmentEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const DepartmentEFields = ({ isNew = false }: DepartmentEFieldsProps) => {
  const { data: faculty, isLoading: facultyIsLoading } = useGetAllFaculty<IFacultyL>({
    viewName: 'FacultyL',
  });

  const { data: leader, isLoading: leaderIsLoading } = useGetAllStudent<IStudentL>({
    viewName: 'StudentL',
  });

  const { data: assistant, isLoading: assistantIsLoading } = useGetAllStudent<IStudentL>({
    viewName: 'StudentL',
  });

  const { control: departmentEControl, getValues } = useFormContext<IDepartmentE>();

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: departmentEControl,
    name: 'group',
  });

  const groupColumns: ControlColumnEditor<IGroupGroupD, OptionsEnum, IStudentL>[] = [
    {
      field: 'name',
      title: 'Название',
      editor: 'text',
    },
    {
      field: 'fullName',
      title: 'Полное название группы',
      editor: 'text',
      readonly: true,
    },
    {
      field: 'form',
      title: 'Форма обучения',
      editor: 'dropdown',
      options: tEducationForm,
    },
    {
      field: 'isMaster',
      title: 'Магистратура',
      editor: 'checkbox',
    },
    {
      field: 'enrollmentYear',
      title: 'Год поступления',
      editor: 'date',
      required: true,
      rules: { required: 'Год поступления - обязательное поле.' },
    },
    {
      field: 'leaderId',
      title: 'Староста',
      editor: 'dropdown',
      options: leader,
      getOptionLabel: (opt) => (opt as IStudentL).fullName?.toString() ?? '',
      required: true,
      rules: {
        validate: (record) => {
          if (!record || record === emptyGuid) {
            return 'Староста - обязательное поле.';
          }
        },
      },
    },
    {
      field: 'assistantId',
      title: 'Помощник старосты',
      editor: 'dropdown',
      options: assistant,
      getOptionLabel: (opt) => (opt as IStudentL).fullName?.toString() ?? '',
    },
  ];

  const isLoading = facultyIsLoading || leaderIsLoading || assistantIsLoading;

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
              name="foundationDate"
              label="Дата основания"
              required
              rules={{ required: 'Дата основания - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlCheckbox
              id="hasAdditionalEducation"
              name="hasAdditionalEducation"
              label="Наличие дополнительного образования"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="specialization"
              label="Специализация"
              options={tDirection}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlFilePicker name="document" />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="facultyId"
              label="Факультет"
              options={faculty}
              getOptionLabel={(opt) => opt.name?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Факультет - обязательное поле.' }}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          Группа
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={groupFields}
              name="group"
              columns={groupColumns}
              onCreate={() => {
                appendGroup({
                  id: createUuid(),
                  name: '',
                  fullName: '',
                  form: tEducationForm.Correspondence,
                  isMaster: false,
                  enrollmentYear: new Date(),
                  leaderId: emptyGuid,
                  leaderFullName: '',
                  assistantId: null,
                  assistantFullName: '',
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => groupFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeGroup(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default DepartmentEFields;
