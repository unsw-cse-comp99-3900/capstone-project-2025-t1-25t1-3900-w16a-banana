FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3001

ENV FLASK_APP=app.main
ENV FLASK_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the Flask server
CMD ["sh", "-c", "python -m flask run --host=$HOST --port=$PORT"]