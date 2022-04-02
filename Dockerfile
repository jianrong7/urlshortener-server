FROM node:16.13.0

WORKDIR /usr/src/url-shortner-server

COPY package.json ./
RUN yarn install

COPY ./ ./
RUN yarn build

CMD ["/bin/bash"]