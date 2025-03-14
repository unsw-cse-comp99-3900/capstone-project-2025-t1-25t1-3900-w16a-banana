FROM python:3.9

# here use /app/backend, so later can distinguish from /app/frontend, etc. 
WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 11000

COPY entrypoint.sh app/backend/entrypoint.sh
RUN chmod +x app/backend/entrypoint.sh

ENTRYPOINT ["app/backend/entrypoint.sh"]