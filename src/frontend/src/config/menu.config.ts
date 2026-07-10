import { ROUTES_CONFIG } from './routes.config';

export interface IMenuItem {
  title: string;
  path: string;
  icon?: string;
  children?: IMenuItem[];
}

export const MENU_CONFIG: IMenuItem[] = [
  {
    title: 'Главная',
    path: ROUTES_CONFIG.MAIN,
    icon: 'icon-point',
  },
  {
    title: 'Учебный процесс',
    path: '',
    children: [
      {
        title: 'Учителя',
        path: ROUTES_CONFIG.TEACHER_L,
        icon: 'icon-point',
      },
      {
        title: 'Учебные планы',
        path: ROUTES_CONFIG.STUDY_PLAN_L,
        icon: 'icon-point',
      },
      {
        title: 'Группа',
        path: '',
        children: [
          {
            title: 'Студенты',
            path: ROUTES_CONFIG.STUDENT_L,
            icon: 'icon-point',
          },
          {
            title: 'Группы',
            path: ROUTES_CONFIG.GROUP_L,
            icon: 'icon-point',
          },
        ],
      },
    ],
  },
  {
    title: 'Структура университета',
    path: '',
    children: [
      {
        title: 'Кафедры',
        path: ROUTES_CONFIG.DEPARTMENT_L,
        icon: 'icon-point',
      },
      {
        title: 'Факультеты',
        path: ROUTES_CONFIG.FACULTY_L,
        icon: 'icon-point',
      },
    ],
  },
  {
    title: 'Расписание',
    path: '',
    children: [
      {
        title: 'Расписания',
        path: ROUTES_CONFIG.SCHEDULE_L,
        icon: 'icon-point',
      },
    ],
  },
];
