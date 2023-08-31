import { NextPageWithSearchParams } from '@/shared/packages/next';
import { Title } from '@/shared/ui/Typography';
import { API_TEACHERS, Paginated, Teacher, fetcher } from '@/shared/api';
import {
  TeacherCreateForm,
  TeacherOpenCreateFormButton,
  TeachersTable,
  getTeachersSearchParams,
} from '@/features/teachers';

export default async function Page({ searchParams }: NextPageWithSearchParams) {
  const search = getTeachersSearchParams(searchParams);

  const firstPage = await fetcher<Paginated<Teacher>>(
    `${API_TEACHERS}?${search}`,
  );

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-3 pb-4">
        <Title>Преподаватели</Title>
        <div>
          <TeacherOpenCreateFormButton />
        </div>
      </div>
      <TeacherCreateForm />
      <TeachersTable firstPage={firstPage} />
    </div>
  );
}

export const metadata = {
  title: 'Преподаватели',
};

export const dynamic = 'force-dynamic';
