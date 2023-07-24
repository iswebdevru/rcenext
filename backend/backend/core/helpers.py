from datetime import datetime
from .models import WeekDay


def get_weekday(date: datetime.date):
    return [
        WeekDay.MONDAY,
        WeekDay.TUESDAY,
        WeekDay.WEDNESDAY,
        WeekDay.THURSDAY,
        WeekDay.FRIDAY,
        WeekDay.SATURDAY,
        WeekDay.SUNDAY,
    ][datetime.weekday(date)]
