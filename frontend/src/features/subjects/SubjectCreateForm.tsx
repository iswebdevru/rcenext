import { ApiError, apiSubjects, isErrorMap } from '@/shared/api';
import { TextField, Button } from '@/shared/ui/Controls';
import {
  useNotification,
  Notification,
  NotificationErrorsMap,
} from '@/shared/ui/Notification';
import { useForm } from 'react-hook-form';

export type SubjectCreateFormProps = {
  refresh: () => Promise<unknown>;
  onClose: () => void;
};

export type SubjectCreateFormData = {
  subject: string;
};

export function SubjectCreateForm({
  refresh,
  onClose,
}: SubjectCreateFormProps) {
  const { register, handleSubmit, reset } = useForm<SubjectCreateFormData>({
    mode: 'all',
  });
  const notify = useNotification();

  const onSave = async (data: SubjectCreateFormData) => {
    try {
      const subject = await apiSubjects.create({
        name: data.subject,
      });
      reset();
      notify(
        <Notification variant="success">
          <Notification.Title>Сохранено</Notification.Title>
          <Notification.Message>
            Предмет &quot;{subject.name}&quot; успешно сохранен.
          </Notification.Message>
        </Notification>,
      );
      return refresh();
    } catch (e) {
      if (e instanceof ApiError && isErrorMap(e.body)) {
        notify(<NotificationErrorsMap errorsMap={e.body} />);
      } else {
        notify(
          <Notification variant="danger">
            <Notification.Title>Ошибка</Notification.Title>
            <Notification.Message>
              Предмет не удалось сохранить.
            </Notification.Message>
          </Notification>,
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="max-w-lg rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-700">
        <TextField
          label="Предмет"
          placeholder="Название"
          autoComplete="off"
          type="text"
          {...register('subject', { required: true })}
        />
      </div>
      <div className="flex justify-end gap-4 p-4">
        <div>
          <Button type="button" onClick={onClose}>
            Отменить
          </Button>
        </div>
        <div>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </div>
    </form>
  );
}
