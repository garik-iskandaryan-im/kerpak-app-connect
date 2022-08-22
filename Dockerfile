FROM node:16.14.2-alpine

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN apk add git

RUN apk --update add fontconfig ttf-dejavu && rm -rf /var/cache/apk/*

# magic command if you don't want to use ENV dynamic phantomjs version
RUN apk add --no-cache curl && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - &&\
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-2.1.1-linux-x86_64 && \
    apk del curl

RUN npm ci --silent
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 4000

## Launch the wait tool and then your application
# RUN npm prune --production
# CMD npm start
CMD ["npm","start"]
