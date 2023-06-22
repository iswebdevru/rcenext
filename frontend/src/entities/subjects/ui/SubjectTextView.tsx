import useSWR from 'swr';
import { Hyperlink, Subject, fetcher } from '@/shared/api';

export type SubjectTextViewProps = {
  url: Hyperlink;
};

export function SubjectTextView({ url }: SubjectTextViewProps) {
  const { data } = useSWR<Subject>(url, fetcher);
  return <>{data?.name}</>;
}
