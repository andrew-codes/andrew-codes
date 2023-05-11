corepack enable
corepack prepare yarn@stable --activate
yarn set version stable

curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="/home/codespace/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"