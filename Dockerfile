FROM alpine:3.11

# copy source files to container
COPY . botarcapi

# install nodejs and npm
RUN apk --update add nodejs npm

# initialize the packages
RUN cd /botarcapi && npm i

# start service
WORKDIR /botarcapi
CMD ["npm", "start"]
