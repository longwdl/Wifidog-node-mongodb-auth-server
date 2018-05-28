# Base node image
FROM node:8.9
MAINTAINER duke <duke@nradiowifi.com>

# Change npm source
RUN npm config set registry https://registry.npm.taobao.org

# Set up work dir
RUN mkdir /app
WORKDIR /app

# Set ENV variables
ENV PORT=3000
EXPOSE $PORT

# Set up gems
ADD package.json /app/package.json
RUN npm install

# Finally, add the rest of our app's code
# (this is done at the end so that changes to
# our app's code don't bust Docker's cache)
ADD . /app

# Start the web app
ENTRYPOINT ["node"]
CMD ["server/server.js"]
