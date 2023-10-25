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
 
 
sudo pwd
 
 
 
 
 
 
 
sudo ls -ltrh
 
 
 
 
 
 
 
sudo pwd
 
 
 
echo "below are current repo folders"
 
 
 
sudo ls -ltrh
 
 
 
sudo mkdir /home/webappuser/webapp
 
 
 
sudo cp /home/admin/webapp.zip /home/webappuser/webapp/
 
 
 
ls -ltrah /home/webappuser/webapp/
 
 
 
cd /home/webappuser/webapp
 
 
 
#mkdir webapp
 
 
 
ls -ltrah
 
 
 
 
 
 
 
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