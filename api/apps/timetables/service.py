import datetime


week_types = ['ЧИСЛ', 'ЗНАМ']
week_days = ['ПН',
             'ВТ',
             'СР',
             'ЧТ',
             'ПТ',
             'СБ',
             'ВС']

day_info_index_map = (
    ('ЗНАМ', 'ПН'), ('ЗНАМ', 'ВТ'), ('ЗНАМ', 'СР'),
    ('ЗНАМ', 'ЧТ'), ('ЗНАМ', 'ПТ'), ('ЗНАМ', 'СБ'),
    ('ЗНАМ', 'ВС'), ('ЧИСЛ', 'ПН'), ('ЧИСЛ', 'ВТ'),
    ('ЧИСЛ', 'СР'), ('ЧИСЛ', 'ЧТ'), ('ЧИСЛ', 'ПТ'),
    ('ЧИСЛ', 'СБ'), ('ЧИСЛ', 'ВС')
)

# День, от которого будет вычисляться тип недели (числитель/знаменатель)
base_timestamp = datetime.date(2000, 1, 3)

main_dates_map = {
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


def get_day_info(date: datetime.date):
    delta = date - base_timestamp
    index = int((delta.total_seconds() / 86400) % 14)
    return day_info_index_map[index]
