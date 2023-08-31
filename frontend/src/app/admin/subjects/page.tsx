import { Title } from '@/shared/ui/Typography';
import { NextPageWithSearchParams } from '@/shared/packages/next';
import { API_SUBJECTS, Paginated, Subject, fetcher } from '@/shared/api';
import {
  SubjectCreateForm,
  SubjectCreateFormOpenButton,
  SubjectsTable,
  getSubjectsSearchParams,
} from '@/features/subjects';

export default async function Subjects({
  searchParams,
}: NextPageWithSearchParams) {
  const query = getSubjectsSearchParams(searchParams);

  const firstPage = await fetcher<Paginated<Subject>>(
    `${API_SUBJECTS}?${query}`,
  );

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-6 pb-4">
        <Title>Предметы</Title>
        <div>
          <SubjectCreateFormOpenButton />
        </div>
      </div>
      <SubjectCreateForm />
      <SubjectsTable firstPage={firstPage} />
    </div>
  );
}

export const metadata = {
  title: 'Предметы',
};

export const dynamic = 'force-dynamic';
