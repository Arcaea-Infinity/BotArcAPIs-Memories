FROM alpine:3.11

# copy source files to container
COPY . botarcapi

# install nodejs and npm
RUN apk --update add nodejs npm

# initialize the node modules
RUN cd /botarcapi && npm i

# start service
WORKDIR /botarcapi
CMD ["npm", "start"]
