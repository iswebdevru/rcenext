import useSWR from 'swr';
import { Hyperlink, Subject } from '@/shared/api';

export type SubjectTextViewProps = {
  url: Hyperlink;
};

export function SubjectTextView({ url }: SubjectTextViewProps) {
  const { data } = useSWR<Subject>(url);
  return <>{data?.name}</>;
}
