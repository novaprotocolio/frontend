FROM node:11.10.0 AS builder
COPY . /app
WORKDIR /app
RUN cd /app/sdk/sdk-charts && yarn install
RUN cd /app/sdk/sdk-wallet && yarn install
RUN yarn install
RUN NODE_PATH=./sdk/ yarn build
# RUN yarn global add pm2
# RUN pm2 serve /app/build --port 8043

FROM wlchn/gostatic:latest
ENV CONFIG_FILE_PATH /srv/http
COPY --from=builder /app/build /srv/http
COPY ./env.sh /env.sh
ENTRYPOINT ["sh", "/env.sh"]
CMD ["/goStatic"]