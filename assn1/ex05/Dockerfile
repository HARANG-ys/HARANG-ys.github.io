FROM debian:stable AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libmicrohttpd-dev make ca-certificates && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY . /src
RUN make

FROM debian:stable-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmicrohttpd12 ca-certificates && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /src/server /app/server
EXPOSE 8080
CMD ["/app/server"]
