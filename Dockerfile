FROM alpine:3.11

# copy source files to container
COPY . botarcapi

# Use Aliyun repo
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && apk update && apk upgrade
# install nodejs and npm
RUN apk --update add nodejs npm

# initialize the node modules
# and compile the project
# Use CNPM repo
RUN cd /botarcapi \
  && npm i --registry=https://registry.npm.taobao.org \
  && npm i -g typescript \
  && tsc --build tsconfig.json

# start service
WORKDIR /botarcapi
CMD ["npm", "start"]
