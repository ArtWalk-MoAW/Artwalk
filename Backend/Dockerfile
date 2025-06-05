FROM python:3.11

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files first
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction

# Copy application code
COPY App/ ./App/

# Create upload folder inside the container (optional, safer)
RUN mkdir -p /App/uploads

# Expose port
EXPOSE 8000

# Start command
CMD ["poetry", "run", "uvicorn", "App.main:app", "--host", "0.0.0.0", "--port", "8000"]
