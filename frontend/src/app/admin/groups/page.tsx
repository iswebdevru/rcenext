import { Title } from '@/shared/ui/Typography';
import {
  GroupCreateForm,
  GroupCreateFormOpenButton,
  GroupsTable,
  getGroupsSearchParams,
} from '@/features/groups';
import { API_GROUPS, Group, Paginated, fetcher } from '@/shared/api';
import { NextPageWithSearchParams } from '@/shared/packages/next';

export default async function Groups({
  searchParams,
}: NextPageWithSearchParams) {
  const query = getGroupsSearchParams(searchParams);

  const firstPage = await fetcher<Paginated<Group>>(`${API_GROUPS}?${query}`);

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-6 pb-4">
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
