variable "ami_name" {
  type    = string
  default = "test123"
}
variable "region" {
  type    = string
  default = "us-east-1"
}
variable "ssh_username" {
  type    = string
  default = "admin"
}
variable "instance_type" {
  type    = string
  default = "t2.micro"
}
variable "owners" {
  type    = string
  default = "136693071363"
}
variable "ami_users" {
  type    = string
  default = "917417408728"
}



packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}



source "amazon-ebs" "debian" {
  ami_name        = "csye6225_V1_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type   = "${var.instance_type}"
  region          = "${var.region}"
  ssh_username    = "${var.ssh_username}"
  ami_description = "AMI for Webapp"
  source_ami_filter {
    filters = {
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["${var.owners}"]
  }
  ami_users = ["${var.ami_users}"]



}


build {
  name = "custom-build-name"
  sources = [
    "source.amazon-ebs.debian"
  ]



  provisioner "shell" {

    inline = [

      "sudo apt update",
      "sudo apt install -y mariadb-server",
      "sudo systemctl start mariadb",
      "sudo systemctl enable mariadb",
      "sudo mysql -u root <<EOF",
      "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';",
      "FLUSH PRIVILEGES;",
      "EOF",
      "sudo apt update",
      "sudo apt install -y nodejs npm",
    ]
  }



}