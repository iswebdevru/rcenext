from sqlalchemy import create_engine, Table, MetaData, Column, Integer, String
import databases

DATABASE_URL = 'postgresql://postgres:postgres@localhost:6667'

sqlalchemy_engine = create_engine(DATABASE_URL)

sqlalchemy_metadata = MetaData()

testers = Table('testers', sqlalchemy_metadata,
                Column('id', Integer, primary_key=True),
                Column('name', String(255)))

sqlalchemy_metadata.create_all(sqlalchemy_engine)
db = databases.Database(DATABASE_URL)
