# Use a lightweight version of Python
FROM python:3.12-alpine

# Install build dependencies for cffi and psutil
RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev \
    linux-headers

# Set the working directory in the container
WORKDIR /backend

# Copy the current directory contents into the container at /backend
COPY . /backend

# Install dependencies from requirements.txt, avoid cache to minimize the image size
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the outside of this container
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app_runner.py
ENV FLASK_ENV=development

# Command to run the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]
