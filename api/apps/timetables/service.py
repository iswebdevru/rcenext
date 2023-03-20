import datetime
from typing import Literal, Tuple

WeekType = Literal['ЧИСЛ', 'ЗНАМ']
WeekDay = Literal[
    'ПН',
    'ВТ',
    'СР',
    'ЧТ',
    'ПТ',
    'СБ',
    'ВС'
]

# День, от которого будет вычисляться тип недели (числитель/знаменатель)
base_timestamp = datetime.date(2000, 1, 3)

db_dates_map: dict[WeekType, dict[WeekDay, datetime.date]] = {
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


def convert_db_date(date: datetime.date) -> Tuple[WeekType, WeekDay]:
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
