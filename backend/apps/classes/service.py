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

def get_day_info(date: datetime.date):
    delta = date - base_timestamp
    index = int((delta.total_seconds() / 86400) % 14)
    return day_info_index_map[index]
