FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
ENV OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

RUN apt update -y
RUN apt-get install -y \
    apt-transport-https \
    wget \
    software-properties-common
RUN RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt update -y --fix-missing
RUN apt-get install -y \
    nodejs
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

RUN wget -c https://dl.google.com/go/go1.18.1.linux-amd64.tar.gz -O - | tar -xz -C /usr/local
RUN ln -s /usr/local/go/bin/go /usr/local/bin
RUN go install github.com/google/go-jsonnet/cmd/jsonnet@latest
RUN go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
RUN ln -s $(go env GOPATH)/bin/jsonnet /usr/local/bin
RUN ln -s $(go env GOPATH)/bin/jb /usr/local/bin
