# sleep 30
# sudo apt update
# sudo apt install nodejs
# sudo node -v
# sudo apt install npm
# sudo apt install curl
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt install nodejs
# node -v
# npm -v
 
# #npm ci
 
# echo "Sriram"
 
# sudo apt-get install mariadb-server unzip -y
 
# sudo systemctl start mysql
# sudo systemctl enable mysql
# sudo systemctl status mysql
# sudo apt-get install expect
 
# echo "Sriram"
 
# sudo pwd
 
# echo "Sriram"
 
# sudo ls -ltrh
 
# expect <<EOF
# set timeout -1
# spawn sudo mysql_secure_installation
 
# expect "Enter current password for root (enter for none):"
# send "\r"
 
# expect "Set root password? [Y/n]"
# send "n\r"
 
# expect "Remove anonymous users? [Y/n]"
# send "n\r"
 
# expect "Disallow root login remotely? [Y/n]"
# send "n\r"
 
# expect "Remove test database and access to it? [Y/n]"
# send "n\r"
 
# expect "Reload privilege tables now? [Y/n]"
# send "Y\r"
 
# expect eof
# EOF
 
# # sudo mysql -u root -e "create user mohan identified by 'password'"
# # sudo mysql -u root -e "create database test"
# # sudo mysql -u root -e "grant all previliges on test.* to 'sriram'@'localhost' identified by 'password'"
 
# sudo mysql -u root -e "create user 'sriram'@'localhost' identified by 'password'"
# sudo mysql -u root -e "create database testing"
# sudo mysql -u root -e "grant all privileges on testing.* to 'sriram'@'localhost' identified by 'password'"
# #npm install --save
# #npm fund
 
# echo "list of databases"
 
# sudo pwd
 
# echo "below are current repo folders"
 
# sudo ls -ltrh
 
 
 
# cd ~/ && unzip webapp.zip
 
# npm ci
# npm install --save
# npm fund
 
sleep 30
sudo apt-get update
sudo apt-get install -y unzip curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
 
sudo useradd -m -p $(openssl passwd -1 password) webapp
 
# sudo mysql -u root -e "SHOW DATABASES";
 
sudo mkdir /home/webapp/webapp
 
sudo cp /home/admin/webapp.zip /home/webapp/webapp/
sudo ls -ltrah /home/webapp
sudo ls -ltrah /home/webapp/webapp/
cd /home/webapp/webapp/
sudo unzip /home/webapp/webapp/webapp.zip
 
sudo ls -ltrah /home/webapp/webapp
 
echo "check webapp.zip"
 
sudo ls -ltrah /home/webapp/
# rm -r .env
# cat <<EOL > .env
# DB_HOST=127.0.0.1
# DB_USER=admin
# DB_PASSWORD=password
# DB_DATABASE=test
# DB_DIALECT=mysql
# DB_POOL_MAX=5
# DB_POOL_MIN=0
# DB_POOL_ACQUIRE=30000
# DB_POOL_IDLE=10000
# EOL
# echo "The .env file has been created."
 
cd /home/webapp/
 
npm ci
 
npm install --save
 
npm fund
 
sudo ls -ltrah /home/webapp/webapp
 
# echo "DATABASE_HOST: mohan.c4tltzid5dl3.us-east-1.rds.amazonaws.com" >> ~/webapp/.env
 
# echo "DATABASE_USER: mohan" >> ~/webapp/.env
 
# echo "DATABASE_NAME: test" >> ~/webapp/.env
 
# echo "DATABASE_PASSWORD: password" >> ~/webapp/.env
 
# echo "PORT: 8087" >> ~/webapp/.env
 
ls -ltrah
 
#cat ~/webapp/.env
 
cd /home/webapp/
 
sudo chown -R webapp:webapp webapp
 
cd /home/admin
sudo ls -ltrah /home/webapp
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
 
sudo systemctl daemon-reload
 
sudo systemctl enable webapp
 
sudo systemctl start webapp
 
sudo echo $?
 
sleep 20
sudo systemctl status webapp
 
sudo echo $?
