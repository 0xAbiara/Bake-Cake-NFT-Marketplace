FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    tar \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download and extract rindexer binary
RUN curl -L -o rindexer.tar.gz https://github.com/joshstevens19/rindexer/releases/download/v0.29.0/rindexer_linux-amd64.tar.gz && \
    tar -xzf rindexer.tar.gz && \
    ls -la && \
    find . -name "*rindexer*" -type f && \
    chmod +x ./rindexer_cli && \
    mv ./rindexer_cli /usr/local/bin/rindexer && \
    rm rindexer.tar.gz

# Verify installation
RUN which rindexer && rindexer --version

# Copy project files
COPY . .

# Expose port
EXPOSE 3001

# Start rindexer
CMD ["rindexer", "start", "all"]