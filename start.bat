@Echo off
cd .\Server\
START node .\server.js

cd ..\Client\
START npm start
EXIT