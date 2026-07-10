import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: 'http://localhost:6500',
  },
  async rewrites() {
    return [
      {
        source: '/department-l',
        destination: '/DepartmentL',
      },
      {
        source: '/department-l/:id',
        destination: '/DepartmentL/:id',
      },
      {
        source: '/department-l/new',
        destination: '/DepartmentL/new',
      },
      {
        source: '/faculty-l',
        destination: '/FacultyL',
      },
      {
        source: '/faculty-l/:id',
        destination: '/FacultyL/:id',
      },
      {
        source: '/faculty-l/new',
        destination: '/FacultyL/new',
      },
      {
        source: '/group-l',
        destination: '/GroupL',
      },
      {
        source: '/group-l/:id',
        destination: '/GroupL/:id',
      },
      {
        source: '/group-l/new',
        destination: '/GroupL/new',
      },
      {
        source: '/schedule-l',
        destination: '/ScheduleL',
      },
      {
        source: '/schedule-l/:id',
        destination: '/ScheduleL/:id',
      },
      {
        source: '/schedule-l/new',
        destination: '/ScheduleL/new',
      },
      {
        source: '/student-l',
        destination: '/StudentL',
      },
      {
        source: '/student-l/:id',
        destination: '/StudentL/:id',
      },
      {
        source: '/student-l/new',
        destination: '/StudentL/new',
      },
      {
        source: '/study-plan-l',
        destination: '/StudyPlanL',
      },
      {
        source: '/study-plan-l/:id',
        destination: '/StudyPlanL/:id',
      },
      {
        source: '/study-plan-l/new',
        destination: '/StudyPlanL/new',
      },
      {
        source: '/teacher-l',
        destination: '/TeacherL',
      },
      {
        source: '/teacher-l/:id',
        destination: '/TeacherL/:id',
      },
      {
        source: '/teacher-l/new',
        destination: '/TeacherL/new',
      },
    ];
  },
};

export default nextConfig;
