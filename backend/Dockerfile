FROM python:3.11-slim

# Prevent Python from writing .pyc files and ensure logs appear immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model
COPY app/ ./app/
COPY models/ ./models/

# Hugging Face Spaces default port
EXPOSE 7860

# Create a non-root user with UID 1000 (standard for HF Spaces)
RUN useradd -m -u 1000 appuser
USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
