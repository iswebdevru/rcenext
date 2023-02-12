from fastapi import FastAPI
from .models import db, testers

app = FastAPI()


@app.on_event('startup')
async def startup():
    await db.connect()


@app.on_event('shutdown')
async def shutdown():
    await db.disconnect()


@app.get('/testers')
async def test():
    query = testers.select()
    return await db.fetch_all(query)


@app.post('/testers')
async def create_tester():
    example = testers.insert().values(id=1, name="a")
    await db.execute(example)
