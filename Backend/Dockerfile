FROM python:3.11

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files first
COPY App/classify_image/pyproject.toml App/classify_image/poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction

# Copy application code
COPY App/ ./App/

# Create upload folder inside the container (optional, safer)
RUN mkdir -p /App/uploads

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app/App/classify_image/src


# Start command
CMD ["poetry", "run", "uvicorn", "App.main:app", "--host", "0.0.0.0", "--port", "8000"]
