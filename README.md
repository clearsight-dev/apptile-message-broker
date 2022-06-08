# Apptile-server-boilerplate

Apptile-server-boilerplate a light weight express server to manage REST API using postgres datasource

##
Recommended npm and node versions
Node Version: v17.4.0
NPM Version: 8.3.1

## Installation

1. Install Project Dependecies
```bash
npm install
```

2. Configure database and other parameters here
```
cp .env.example .env
src/config
```

3. Run migrations
```
npx sequelize-cli db:migrate 
```



## Usage
Run web server (ie.  default server port 3000)
```
npm run start
```