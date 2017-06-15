# cf-radiator-server
This is the backend server which acts as a proxy which connects to different foundation servers. 

### Getting started

The cf-radiator-server is stateless, and acts as an proxy exposing different REST endpoints 
1. /api/auth/login
2. /api/auth/refreshToken
3. /api/foundationInfo
4. /api/apps
5. /api/apps/:guid/health
6. /api/apps/:guid


To start the project
```
npm install
npm start
```
