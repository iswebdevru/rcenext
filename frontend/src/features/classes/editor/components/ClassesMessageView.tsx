import { ClassesStoreAction } from '@/entities/classes';
import { Group } from '@/shared/api';

export type ClassesMessageViewProps = {
  message: string;
  group: Group;
  dispatch: (value: ClassesStoreAction) => void;
};

export function ClassesMessageView({
  message,
  dispatch,
  group,
}: ClassesMessageViewProps) {
  return (
    <div className="shrink-0 flex-grow border-t border-zinc-200 p-2 dark:border-zinc-700">
      <textarea
        className="h-full w-full resize-none"
        value={message}
        onChange={e => {
          dispatch({
            type: 'change-message',
            payload: {
              group: group.url,
              data: e.currentTarget.value,
            },
          });
        }}
        placeholder="Сообщение вместо расписания"
      />
    </div>
  );
}
