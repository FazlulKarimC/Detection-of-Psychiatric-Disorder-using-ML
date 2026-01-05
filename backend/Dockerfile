FROM python:3.11-slim

# Prevent Python from writing .pyc files and ensure logs appear immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-root user with UID 1000 (required for HF Spaces)
# Must be created BEFORE copying files with --chown
RUN useradd -m -u 1000 user

# Install dependencies first (better layer caching)
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model with proper ownership
COPY --chown=user app/ ./app/
COPY --chown=user models/ ./models/

# Switch to non-root user
USER user

# Hugging Face Spaces default port
EXPOSE 7860

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/')" || exit 1

# Start the API server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]

