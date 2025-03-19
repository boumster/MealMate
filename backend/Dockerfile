# Use the official Python image as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements file into the container
COPY requirements.txt .

# Copy the SSL certificate into the container
COPY DigiCertGlobalRootCA.crt.pem /etc/ssl/certs/

# Install the dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose the port that the FastAPI app will run on
EXPOSE 8000

# Command to run on container start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]