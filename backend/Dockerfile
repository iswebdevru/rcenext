FROM python:3.10.6

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod a+x ./startup.sh
ENTRYPOINT [ "./startup.sh" ]
