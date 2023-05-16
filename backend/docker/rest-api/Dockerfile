FROM python:3.10.6

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod a+x ./docker/rest-api/startup.sh
ENTRYPOINT [ "./docker/rest-api/startup.sh" ]
