FROM python:3.9

FROM python:3.9

# Set working directory
WORKDIR /app/backend

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code into the container
COPY . .

# Initialize the database so the docker container always starts with a clean state
RUN python utils/init_db.py

# Expose Flask app port
EXPOSE 11000

# Start the Flask app
CMD ["python", "app.py"]