corepack enable
corepack prepare yarn@3.6.0 --activate
yarn set version 3.6.0

curl -L https://fly.io/install.sh | sh

apt-get install -y \
    curl \
    make

curl -fsSL https://d2lang.com/install.sh | sh -s --
