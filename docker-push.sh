#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t ci-ui .
docker images
docker tag ci-ui "$DOCKER_USERNAME"/ci-ui
docker push "$DOCKER_USERNAME"/ci-ui
