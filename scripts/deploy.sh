#!/usr/bin/env bash

curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
mkdir ~/.kube

cat <<EOF > ~/.kube/config
---
apiVersion: v1
kind: Config
users:
  - name: fp-discord-bot
    user:
      token: ""
clusters:
  - cluster:
      server: ""
      certificate-authority-data: ""
    name: vps-fp-discord-bot
preferences: {}
contexts:
  - name: bot
    context:
      cluster: vps-fp-discord-bot
      user: fp-discord-bot
current-context: bot
EOF

kubectl config set clusters.vps-fp-discord-bot.certificate-authority-data "$KUBE_CLUSTER_CA"
kubectl config set clusters.vps-fp-discord-bot.server "$KUBE_HOST"
kubectl config set users.fp-discord-bot.token "$KUBE_SVC_ACCT_TOKEN"

# kubectl set image deployment/fp-discord-bot fp-discord-bot=docker.io/cronym/fp-discord-bot:"${TRAVIS_TAG}"
kubectl set image deployment/fp-discord-bot "fp-discord-bot=docker.io/cronym/fp-discord-bot:${TRAVIS_TAG}"
kubectl set env deployments/fp-discord-bot "BOT_VERSION=${TRAVIS_TAG}"
