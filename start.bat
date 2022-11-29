@Echo off
cd .\Server\
START node .\server.js

cd ..\client\gameplatform
START npm start
EXIT