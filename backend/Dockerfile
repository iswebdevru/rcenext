FROM python:3.10-alpine

# fix postgresql library installation
RUN apk add postgresql-dev

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "sh", "./startup.sh" ]
