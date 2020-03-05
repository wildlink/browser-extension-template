#!/bin/bash
set -e
ENV="development"

# build the image from Dockerfile
docker build -f build/live/Dockerfile -t browser-extension-template .

# run the container from image
docker run --name=browser-extension-template -e NODE_ENV=$ENV browser-extension-template

# copy from the exited container
docker cp browser-extension-template:/app/build-$ENV.zip .

# remove the container
docker rm browser-extension-template
