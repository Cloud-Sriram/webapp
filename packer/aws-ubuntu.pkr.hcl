packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

 

variable "aws_access_key" {
  default = "AKIASRXH6KNXFMPKSPUP"
}
variable "aws_secret_key" {
  default = "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"
}

 
variable "aws_region" {
  type = string
  default = "us-east-1"
}

 

variable "source_ami" {
  type = string
  default = "ami-06db4d78cb1d3bbf9"
}

 

variable "ssh_username" {
  type = string
  default = "admin"
}

 

variable "subnet_id" {
    type = string
    default = "subnet-0d1ab2a046d851958"
}

 

variable "instance_type" {
  default = "t2.micro"
}

 

variable "ami_description" {
  default = "AMI for CSYE 6225"
}

 

variable "profile" {
  type    = string
  default = "dev"
}

 

 

source "amazon-ebs" "custom-ami" {
  profile    = "${var.profile}"
  access_key = var.aws_access_key
   secret_key = var.aws_secret_key
  region     = "${var.aws_region}"

  ami_name         = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type    ="${var.instance_type}" 
  source_ami       =  "${var.source_ami}"
  ssh_username     =  "${var.ssh_username}"
  ami_description  =  "${var.ami_description}"
  subnet_id        = "${var.subnet_id}"

 

  force_deregister = true
  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }

 

}

 

 

build {
  name = "custom-build-name"
  sources = [
    "source.amazon-ebs.custom-ami"
  ]

 

provisioner "shell"{

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