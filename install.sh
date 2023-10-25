sleep 30
 
sudo apt update
 
sudo apt install nodejs
 
sudo node -v
 
sudo apt install npm
 
sudo apt install curl zip unzip -y
 
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
 
sudo apt install nodejs
 
node -v
 
npm -v
 
 
 
sudo lsb_release -a
 
 
 
sudo useradd -m -p $(openssl passwd -1 password) webappuser
 
 
 
sudo cat /etc/passwd
 
 
 
 
 
#npm ci
 
 
 
 
 
#sudo apt-get install mariadb-server unzip -y
 
 
 
#sudo systemctl start mysql
 
#sudo systemctl enable mysql
 
#sudo systemctl status mysql
 
#sudo apt-get install expect
 
 
 
sudo pwd
 
 
 
 
 
 
 
sudo ls -ltrh
 
 
 
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
 
# # sudo mysql -u root -e "grant all previliges on test.* to 'mohan'@'localhost' identified by 'password'"
 
 
 
# sudo mysql -u root -e "create user 'mohan'@'localhost' identified by 'password'"
 
# sudo mysql -u root -e "create database test"
 
# sudo mysql -u root -e "grant all privileges on test.* to 'mohan'@'localhost' identified by 'password'"
 
# #npm install --save
 
# #npm fund
 
 
 
# echo "list of databases"
 
 
 
sudo pwd
 
 
 
echo "below are current repo folders"
 
 
 
sudo ls -ltrh
 
 
 
sudo mkdir /home/webappuser/webapp
 
 
 
sudo cp /home/admin/webapp.zip /home/webappuser/webapp/
 
 
 
ls -ltrah /home/webappuser/webapp/
 
 
 
cd /home/webappuser/webapp
 
 
 
#mkdir webapp
 
 
 
ls -ltrah
 
 
 
#cp webapp.zip webapp/
 
 
 
#cd webapp/
 
 
 
pwd
 
 
 
sudo unzip /home/webappuser/webapp/webapp.zip
 
 
 
sudo ls -ltrah /home/webappuser/webapp
 
 
 
sudo npm ci
 
 
 
sudo npm install --save
 
 
 
sudo npm fund
 
 
 
 
 
ls -ltrah
 
 
 
#cat ~/webapp/.env
 
 
 
cd /home/admin/
 
 
 
#sudo chown -R webapp:webapp webapp
 
 
 
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
 
 
 
sudo systemctl daemon-reload
 
 
 
sudo systemctl enable webapp
 
 
 
sudo systemctl start webapp
 
 
 
sudo echo $?
 
 
 
sleep 20
 
 
 
sudo systemctl status webapp
 
 
 
sudo echo $?