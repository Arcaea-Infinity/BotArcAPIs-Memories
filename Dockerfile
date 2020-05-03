FROM alpine:3.11

# copy source files to container
COPY . botarcapi

# install nodejs and npm
RUN apk --update add nodejs npm

# initialize the node modules
# and compile the project
RUN cd /botarcapi \
  && npm i \
  && npm i -g typescript \
  && tsc --build tsconfig.json

# start service
WORKDIR /botarcapi
CMD ["npm", "start"]
