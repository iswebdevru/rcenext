import { fetcher, Subject } from '@/shared/api';
import useSWR from 'swr';

export type TeacherSubjectProps = {
  url: string;
};

export function TeacherSubject({ url }: TeacherSubjectProps) {
  const { data } = useSWR<Subject>(url, fetcher);
  return (
    <div className="px-2 py-1 bg-blue-100 rounded-md">
      {data?.name ?? '...'}
    </div>
  );
}
