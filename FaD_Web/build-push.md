// Way to push the build to any serve

a) gulp build to build a dist file

b) dis file is created can check it using ls command in linux 

3) zip the folder zip  -r dist.zip dist.

4) scp  dist.zip root@10.18.10.167:/root/.

5) login to server using ssh root@10.18.10.167  

6)go to web-server folder and delete existing files sudo rm -r dist 
 sudo rm -r dist.zip

7) mv dist.zip to web-server folder

mv ./../dist.zip ./


unzip it


1.pm2 list to check the active services running on pm2

2) pm2 stop http-server to stop the old http-server

3) pm2 start http-server to start the web service 