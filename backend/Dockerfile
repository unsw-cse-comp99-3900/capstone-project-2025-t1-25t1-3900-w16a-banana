FROM python:3.9

FROM python:3.9

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code into the container
COPY . .

# Expose Flask app port
EXPOSE 11000

# Use Python script as entrypoint
ENTRYPOINT ["python", "entrypoint.py"]