FROM python:3.11

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction

# Copy application code
COPY App/ ./App/

# Copy data folder
COPY data/ ./data/

# Create upload folder
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8000

# Set PYTHONPATH
ENV PYTHONPATH=/app/App

# Start FastAPI
CMD ["poetry", "run", "uvicorn", "App.main:app", "--host", "0.0.0.0", "--port", "8000"]
