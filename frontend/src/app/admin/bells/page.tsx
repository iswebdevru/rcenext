import { BellsForm, BellsScheduleEditFilters } from '@/features/bells';

export default function Bells() {
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div>
          <BellsScheduleEditFilters />
        </div>
        <div className="flex-auto">
          <BellsForm />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Звонки',
};

export const dynamic = 'force-dynamic';
