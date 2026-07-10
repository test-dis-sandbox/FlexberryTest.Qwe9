'use client';

import { Grid, Paper, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlDataTableEditor, { ControlColumnEditor, OptionsEnum } from '@/components/DataTableEditor';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlDatePicker from '@/components/DatePicker';
import ControlTextField from '@/components/TextField';
import useGetAllTeacher from '@/hooks/Teacher/useGetAllTeacher';
import useGetAllGroup from '@/hooks/Group/useGetAllGroup';
import { IScheduleE } from '@/types/Schedule.types';
import { ITeacherL } from '@/types/Teacher.types';
import { IGroupL } from '@/types/Group.types';
import { ILessonD as ILessonLessonD } from '@/types/Lesson.types';
import { IScheduleGroupD as IScheduleGroupScheduleGroupD } from '@/types/ScheduleGroup.types';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

interface ScheduleEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const ScheduleEFields = ({ isNew = false }: ScheduleEFieldsProps) => {
  const { data: teacher, isLoading: teacherIsLoading } = useGetAllTeacher<ITeacherL>({
    viewName: 'TeacherL',
  });

  const { data: group, isLoading: groupIsLoading } = useGetAllGroup<IGroupL>({
    viewName: 'GroupL',
  });

  const { control: scheduleEControl, getValues } = useFormContext<IScheduleE>();

  const {
    fields: lessonsFields,
    append: appendLessons,
    remove: removeLessons,
  } = useFieldArray({
    control: scheduleEControl,
    name: 'lessons',
  });

  const {
    fields: groupsFields,
    append: appendGroups,
    remove: removeGroups,
  } = useFieldArray({
    control: scheduleEControl,
    name: 'groups',
  });

  const lessonsColumns: ControlColumnEditor<ILessonLessonD, OptionsEnum, ITeacherL | IGroupL>[] = [
    {
      field: 'subject',
      title: 'Предмет',
      editor: 'text',
    },
    {
      field: 'startTime',
      title: 'Время начала',
      editor: 'date',
      required: true,
      rules: { required: 'Время начала - обязательное поле.' },
    },
    {
      field: 'endTime',
      title: 'Время окончания',
      editor: 'date',
      required: true,
      rules: { required: 'Время окончания - обязательное поле.' },
    },
    {
      field: 'comment',
      title: 'Комментарий',
      editor: 'text',
    },
    {
      field: 'teacherId',
      title: 'Преподаватель',
      editor: 'dropdown',
      options: teacher,
      getOptionLabel: (opt) => (opt as ITeacherL).fullName?.toString() ?? '',
      required: true,
      rules: {
        validate: (record) => {
          if (!record || record === emptyGuid) {
            return 'Преподаватель - обязательное поле.';
          }
        },
      },
    },
    {
      field: 'audienceId',
      title: 'Аудитория',
      editor: 'dropdown',
      options: [],
      getOptionLabel: (opt) => (opt as { id: NonEmptyString }).id?.toString() ?? '',
    },
  ];

  const groupsColumns: ControlColumnEditor<IScheduleGroupScheduleGroupD, OptionsEnum, ITeacherL | IGroupL>[] = [
    {
      field: 'groupId',
      title: 'Группа',
      editor: 'dropdown',
      options: group,
      getOptionLabel: (opt) => (opt as IGroupL).fullName?.toString() ?? '',
      required: true,
      rules: {
        validate: (record) => {
          if (!record || record === emptyGuid) {
            return 'Группа - обязательное поле.';
          }
        },
      },
    },
    {
      field: 'summary',
      title: 'Описание',
      editor: 'text',
    },
  ];

  const isLoading = teacherIsLoading || groupIsLoading;

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
              id="year"
              name="year"
              label="Год"
              required
              rules={{ required: 'Год - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="week"
              name="week"
              label="Неделя"
              required
              rules={{ required: 'Неделя - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="day"
              name="day"
              label="День"
              required
              rules={{ required: 'День - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDatePicker
              name="dateFrom"
              label="Дата"
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          Предметы
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={lessonsFields}
              name="lessons"
              columns={lessonsColumns}
              onCreate={() => {
                appendLessons({
                  id: createUuid(),
                  subject: '',
                  startTime: new Date(),
                  endTime: new Date(),
                  comment: '',
                  teacherId: emptyGuid,
                  audienceId: null,
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => lessonsFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeLessons(indexesToRemove);
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
          Группы
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={groupsFields}
              name="groups"
              columns={groupsColumns}
              onCreate={() => {
                appendGroups({
                  id: createUuid(),
                  scheduleId: getValues('id'),
                  groupId: emptyGuid,
                  groupFullName: '',
                  summary: '',
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => groupsFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeGroups(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ScheduleEFields;
