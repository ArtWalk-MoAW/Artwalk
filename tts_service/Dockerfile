FROM python:3.11-slim

# System-Tools und Rust installieren (für sudachipy)
RUN apt-get update && \
    apt-get install -y gcc g++ curl build-essential espeak-ng && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    ln -s /root/.cargo/bin/rustc /usr/local/bin/rustc && \
    ln -s /root/.cargo/bin/cargo /usr/local/bin/cargo

# Install Poetry
RUN pip install --no-cache-dir poetry==1.8.2

# Poetry global verfügbar machen
ENV PATH="/root/.local/bin:$PATH"

# Arbeitsverzeichnis
WORKDIR /app

# Abhängigkeits-Dateien zuerst kopieren und installieren
COPY pyproject.toml poetry.lock ./

RUN pip install --upgrade pip && \
    poetry install --no-root

# Dann restlichen Code kopieren
COPY . .

# Starte das TTS-Service über Poetry
CMD ["poetry", "run", "python", "app/app.py"]
