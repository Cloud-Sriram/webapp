sleep 30
sudo apt update
sudo apt install nodejs
sudo node -v
sudo apt install npm
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
node -v
npm -v

#npm ci

echo "MohanLog1"

sudo apt-get install mariadb-server unzip -y

sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl status mysql
sudo apt-get install expect

echo "Sriram"

sudo pwd

echo "Sriram"

sudo ls -ltrh

expect <<EOF
set timeout -1
spawn sudo mysql_secure_installation

expect "Enter current password for root (enter for none):"
send "\r"

expect "Set root password? [Y/n]"
send "n\r"

expect "Remove anonymous users? [Y/n]"
send "n\r"

expect "Disallow root login remotely? [Y/n]"
send "n\r"

expect "Remove test database and access to it? [Y/n]"
send "n\r"

expect "Reload privilege tables now? [Y/n]"
send "Y\r"

expect eof
EOF

# sudo mysql -u root -e "create user mohan identified by 'password'"
# sudo mysql -u root -e "create database test"
# sudo mysql -u root -e "grant all previliges on test.* to 'mohan'@'localhost' identified by 'password'"

sudo mysql -u root -e "create user 'sriram'@'localhost' identified by 'password'"
sudo mysql -u root -e "create database testing"
sudo mysql -u root -e "grant all privileges on testing.* to 'sriram'@'localhost' identified by 'password'"
#npm install --save
#npm fund

echo "list of databases"

sudo pwd

echo "below are current repo folders"

sudo ls -ltrh



cd ~/ && unzip webapp.zip

npm ci
npm install --save
npm fund