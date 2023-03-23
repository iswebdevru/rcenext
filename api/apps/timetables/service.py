import datetime
from apps.timetables.models import TimetablePeriod


week_types = ['ЧИСЛ', 'ЗНАМ']
week_days = ['ПН',
             'ВТ',
             'СР',
             'ЧТ',
             'ПТ',
             'СБ',
             'ВС']

week_types_and_days_index_map = (
    ('ЗНАМ', 'ПН'), ('ЗНАМ', 'ВТ'), ('ЗНАМ', 'СР'),
    ('ЗНАМ', 'ЧТ'), ('ЗНАМ', 'ПТ'), ('ЗНАМ', 'СБ'),
    ('ЗНАМ', 'ВС'), ('ЧИСЛ', 'ПН'), ('ЧИСЛ', 'ВТ'),
    ('ЧИСЛ', 'СР'), ('ЧИСЛ', 'ЧТ'), ('ЧИСЛ', 'ПТ'),
    ('ЧИСЛ', 'СБ'), ('ЧИСЛ', 'ВС')
)

# День, от которого будет вычисляться тип недели (числитель/знаменатель)
base_timestamp = datetime.date(2000, 1, 3)

db_dates_map = {
    'ЗНАМ': {
        'ПН': datetime.date(2000, 1, 3),
        'ВТ': datetime.date(2000, 1, 4),
        'СР': datetime.date(2000, 1, 5),
        'ЧТ': datetime.date(2000, 1, 6),
        'ПТ': datetime.date(2000, 1, 7),
        'СБ': datetime.date(2000, 1, 8),
        'ВС': datetime.date(2000, 1, 9),
    },
    'ЧИСЛ': {
        'ПН': datetime.date(2000, 1, 10),
        'ВТ': datetime.date(2000, 1, 11),
        'СР': datetime.date(2000, 1, 12),
        'ЧТ': datetime.date(2000, 1, 13),
        'ПТ': datetime.date(2000, 1, 14),
        'СБ': datetime.date(2000, 1, 15),
        'ВС': datetime.date(2000, 1, 16),
    }
}


def convert_db_date(date: datetime.date):
    if date == datetime.date(2000, 1, 3):
        return ('ЗНАМ', 'ПН')
    elif date == datetime.date(2000, 1, 4):
        return ('ЗНАМ', 'ВТ')
    elif date == datetime.date(2000, 1, 5):
        return ('ЗНАМ', 'СР')
    elif date == datetime.date(2000, 1, 6):
        return ('ЗНАМ', 'ЧТ')
    elif date == datetime.date(2000, 1, 7):
        return ('ЗНАМ', 'ПТ')
    elif date == datetime.date(2000, 1, 8):
        return ('ЗНАМ', 'СБ')
    elif date == datetime.date(2000, 1, 9):
        return ('ЗНАМ', 'ВС')
    elif date == datetime.date(2000, 1, 10):
        return ('ЧИСЛ', 'ПН')
    elif date == datetime.date(2000, 1, 11):
        return ('ЧИСЛ', 'ВТ')
    elif date == datetime.date(2000, 1, 12):
        return ('ЧИСЛ', 'СР')
    elif date == datetime.date(2000, 1, 13):
        return ('ЧИСЛ', 'ЧТ')
    elif date == datetime.date(2000, 1, 14):
        return ('ЧИСЛ', 'ПТ')
    elif date == datetime.date(2000, 1, 15):
        return ('ЧИСЛ', 'СБ')
    elif date == datetime.date(2000, 1, 16):
        return ('ЧИСЛ', 'ВС')


def get_week_type_and_day(date: datetime.date):
    delta = date - base_timestamp
    index = int((delta.total_seconds() / 86400) % 14)
    return week_types_and_days_index_map[index]


def create_period(period_data, timetable):
    teachers = period_data.pop('teachers')
    period_record = TimetablePeriod.objects.create(
        **period_data, timetable=timetable
    )
    period_record.teachers.add(*teachers)


def create_periods(periods_data, timetable):
    for period_data in periods_data:
        create_period(period_data, timetable)
