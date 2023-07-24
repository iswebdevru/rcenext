import { ErrorsMap } from '@/shared/api';
import { Notification } from './Notification';

export type NotificationErrorsMapProps = {
  errorsMap: ErrorsMap;
};

export function NotificationErrorsMap({
  errorsMap,
}: NotificationErrorsMapProps) {
  return (
    <Notification variant="danger">
      <Notification.Title>Ошибка в форме</Notification.Title>
      <Notification.Message>
        <dl>
          {Object.entries(errorsMap).map(([key, value]) => (
            <div key={key} className="flex gap-1">
              <dt className="flex-none font-semibold">{key}:</dt>
              <dd className="flex-auto">{value.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Notification.Message>
    </Notification>
  );
}
