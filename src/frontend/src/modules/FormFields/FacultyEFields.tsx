'use client';

import { Grid, Paper, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlDataTableEditor, { ControlColumnEditor, OptionsEnum } from '@/components/DataTableEditor';
import ControlCheckbox from '@/components/Checkbox';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import { IFacultyE } from '@/types/Faculty.types';
import { IDepartmentD as IDepartmentDepartmentD } from '@/types/Department.types';
import { IStudentBrigadesD as IStudentBrigadesStudentBrigadesD } from '@/types/StudentBrigades.types';
import { tFacultyType } from '@/enums/tFacultyType.types';
import { tDirection } from '@/enums/tDirection.types';
import { createUuid } from '@/utils/guidUtils';

interface FacultyEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const FacultyEFields = ({ isNew = false }: FacultyEFieldsProps) => {
  const { control: facultyEControl, getValues } = useFormContext<IFacultyE>();

  const {
    fields: departmentFields,
    append: appendDepartment,
    remove: removeDepartment,
  } = useFieldArray({
    control: facultyEControl,
    name: 'department',
  });

  const {
    fields: studentBrigadesFields,
    append: appendStudentBrigades,
    remove: removeStudentBrigades,
  } = useFieldArray({
    control: facultyEControl,
    name: 'studentBrigades',
  });

  const departmentColumns: ControlColumnEditor<IDepartmentDepartmentD, OptionsEnum, { id: NonEmptyString }>[] = [
    {
      field: 'name',
      title: 'Название',
      editor: 'text',
    },
    {
      field: 'specialization',
      title: 'Специализация',
      editor: 'dropdown',
      options: tDirection,
    },
    {
      field: 'hasAdditionalEducation',
      title: 'Наличие дополнительного образования',
      editor: 'checkbox',
    },
    {
      field: 'foundationDate',
      title: 'Дата основания',
      editor: 'date',
      required: true,
      rules: { required: 'Дата основания - обязательное поле.' },
    },
    {
      field: 'document',
      title: 'Устав кафедры',
      editor: 'file',
    },
  ];

  const studentBrigadesColumns: ControlColumnEditor<
    IStudentBrigadesStudentBrigadesD,
    OptionsEnum,
    { id: NonEmptyString }
  >[] = [
    {
      field: 'participants',
      title: 'Участники',
      editor: 'number',
      required: true,
      rules: { required: 'Участники - обязательное поле.' },
    },
  ];

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
              required
              rules={{ required: 'Название - обязательное поле.' }}
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
              id="hasMilitaryDepartment"
              name="hasMilitaryDepartment"
              label="Наличие военной кафедры"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="type"
              label="Профиль факультета"
              options={tFacultyType}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          Кафедра
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={departmentFields}
              name="department"
              columns={departmentColumns}
              onCreate={() => {
                appendDepartment({
                  id: createUuid(),
                  name: '',
                  specialization: tDirection.ComputerScience,
                  hasAdditionalEducation: false,
                  foundationDate: new Date(),
                  document: null,
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => departmentFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeDepartment(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          СтудОтряды
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={studentBrigadesFields}
              name="studentBrigades"
              columns={studentBrigadesColumns}
              onCreate={() => {
                appendStudentBrigades({
                  id: createUuid(),
                  participants: 0,
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => studentBrigadesFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeStudentBrigades(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FacultyEFields;
