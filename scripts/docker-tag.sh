#!/bin/bash
set -ev

echo "$DOCKER_PW" | docker login -u "$DOCKER_USER" --password-stdin

docker tag docker.io/cronym/fp-discord-bot:${TRAVIS_PULL_REQUEST} docker.io/cronym/fp-discord-bot:latest
docker push docker.io.cronym/fp-discord-bot:${TRAVIS_PULL_REQUEST}
docker push docker.io.cronym/fp-discord-bot:latest

if [[ -z "$TRAVIS_TAG" ]]; then
  docker tag docker.io/cronym/fp-discord-bot:${TRAVIS_PULL_REQUEST} docker.io/cronym/fp-discord-bot:${TRAVIS_TAG}
  docker push docker.io.cronym/fp-discord-bot:${TRAVIS_TAG}
fi
