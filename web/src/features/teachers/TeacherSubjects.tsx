import { useTeacherSubjects } from '@/shared/api';

export type TeacherSubjectProps = {
  url: string;
};

export function TeacherSubjects({ url }: TeacherSubjectProps) {
  const { data: subjects } = useTeacherSubjects(url);

  return (
    <div className="flex flex-wrap gap-2">
      {subjects
        ? subjects.map(subject => (
            <span className="px-2 py-1 bg-blue-100 rounded-md" key={subject.id}>
              {subject.name}
            </span>
          ))
        : null}
    </div>
  );
}
