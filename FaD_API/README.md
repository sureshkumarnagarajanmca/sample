Backend API Server of FindADoctor
 to start server = node Application.js or forever start ApplicationServer.js
 to start in prodution  = NODE_ENV=production forever start ApplicationServer.js
 to start in QA = NODE_ENV=test forever start ApplicationServer.js
 to start in amazon = NODE_ENV=amazon forever start ApplicationServer.js
 it starts the server on 3004 port

Dependencies
    Install node dependency modules for all environments
    development
     start mongo server in local and ES server on local default ports
    production
     start mongo server in 10.0.90.12 and ES server on 10.0.90.14 default ports
    QA
     start mongo server in 10.0.90.23 and ES server on 10.0.90.24 default ports
    amazon
     start mongo server in 52.220.88.65 and ES server on 52.220.88.65 default ports




To start the mongo db.

    Enter command mongodb --dbpath /var/lib/mongo/


    retsart the node.js server .

    forver list will give you all the running process.
    kill the running node.js server using the processid -  forever stop ant the process id.
    then start the server in production mode.
 
