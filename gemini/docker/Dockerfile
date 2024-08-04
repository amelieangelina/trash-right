FROM python:3.12.3-slim

WORKDIR /gemini

COPY docker/requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt
COPY . /tmp/
RUN pip install -q -U google-generativeai

COPY . .

EXPOSE 4000

CMD [ "flask", "run", "--host=0.0.0.0", "--port=4000"]