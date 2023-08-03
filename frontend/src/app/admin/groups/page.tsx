import { Title } from '@/shared/ui/Typography';
import {
  GroupCreateForm,
  GroupCreateFormOpenButton,
  GroupsTable,
} from '@/features/groups';
import { API_GROUPS, Group, Paginated, fetcher } from '@/shared/api';

export default async function Groups() {
  const firstPage = await fetcher<Paginated<Group>>(API_GROUPS);

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-6 pb-6">
        <Title>Группы</Title>
        <div>
          <GroupCreateFormOpenButton />
        </div>
      </div>
      <GroupCreateForm />
      <GroupsTable firstPage={firstPage} />
    </div>
  );
}

export const metadata = {
  title: 'Группы',
};
