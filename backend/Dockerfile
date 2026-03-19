FROM python:3.11-slim

WORKDIR /app

# Install only essential packages
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip --no-cache-dir

# Copy minimal requirements (just FastAPI and uvicorn)
RUN pip install --no-cache-dir fastapi==0.104.1 uvicorn[standard]==0.24.0

# Copy application
COPY app/ app/

# Environment
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

# Use minimal app
CMD ["uvicorn", "app.minimal_main:app", "--host", "0.0.0.0", "--port", "8080", "--log-level", "info"]
