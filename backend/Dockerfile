FROM python:3.9

# here use /app/backend, so later can distinguish from /app/frontend, etc. 
WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 11000

CMD ["python", "app.py"]