#######################
#######  AMD64  #######
#######################
FROM node:lts-alpine

# installe un simple serveur http pour servir un contenu statique
RUN apk add --no-cache git
RUN npm install -g http-server

# définit le dossier 'app' comme dossier de travail
WORKDIR /app

# installe les dépendances du projet
ADD https://api.github.com/repos/Haingue/dartgame/git/refs/heads/master /version.json
RUN git clone -b master https://github.com/Haingue/DartGame.git /app
RUN npm install

# construit l'app pour la production en la minifiant
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]

#######################
#######  ARM64  #######
#######################
FROM arm64v8/node:lts-alpine

# installe un simple serveur http pour servir un contenu statique
RUN apk add --no-cache git
RUN npm install -g http-server

# définit le dossier 'app' comme dossier de travail
WORKDIR /app

# installe les dépendances du projet
ADD https://api.github.com/repos/Haingue/dartgame/git/refs/heads/master /version.json
RUN git clone -b master https://github.com/Haingue/DartGame.git /app
RUN npm install

# construit l'app pour la production en la minifiant
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]