FROM python:3.11

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files (jetzt korrekt aus dem Root)
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction

# Copy all application code
COPY App/ ./App/

# Create upload folder inside the container
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8000

# Set PYTHONPATH for the full App folder
ENV PYTHONPATH=/app/App

# Start application
CMD ["poetry", "run", "uvicorn", "App.main:app", "--host", "0.0.0.0", "--port", "8000"]
