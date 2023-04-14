FROM node:lts-bullseye
ENV DEBIAN_FRONTEND=noninteractive
ENV OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

RUN wget -c https://dl.google.com/go/go1.18.1.linux-amd64.tar.gz -O - | tar -xz -C /usr/local
RUN ln -s /usr/local/go/bin/go /usr/local/bin
RUN go install github.com/google/go-jsonnet/cmd/jsonnet@latest
RUN go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
RUN ln -s $(go env GOPATH)/bin/jsonnet /usr/local/bin
RUN ln -s $(go env GOPATH)/bin/jb /usr/local/bin

RUN apt update -y --fix-missing
RUN apt-get remove \
    docker \
    docker-engine \
    docker.io \
    containerd \
    runc
RUN apt-get install -y \
    apt-transport-https \
    wget \
    software-properties-common \
    python3 \
    make \
    python3-pip \
    ca-certificates \
    curl \
    gnupg
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update -y
RUN apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin