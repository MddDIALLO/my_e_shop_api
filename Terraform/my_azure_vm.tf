variable "vm_username" {}
variable "vm_password" {}
variable "docker_username" {}
variable "docker_password" {}
variable "db_name" {}
variable "db_password" {}
variable "db_port" {}
variable "app_port" {}

data "template_file" "docker_login_script" {
  template = <<-EOT
    sudo docker login -u ${var.docker_username} -p ${var.docker_password}
  EOT
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "linux-dev-rg" {
    name        = "linuxDev"
    location    = "West Europe"
    tags        = {
        environment = "dev"
    }
}

resource "azurerm_virtual_network" "dev-vnet" {
  name                = "dev-network"
  resource_group_name = azurerm_resource_group.linux-dev-rg.name
  location            = azurerm_resource_group.linux-dev-rg.location
  address_space       = ["10.123.0.0/16"]

  tags = {
    environment = "dev"
  }
}

resource "azurerm_subnet" "dev-subnet" {
  name                 = "subnet1"
  resource_group_name  = azurerm_resource_group.linux-dev-rg.name
  virtual_network_name = azurerm_virtual_network.dev-vnet.name
  address_prefixes     = ["10.123.1.0/24"]
}

resource "azurerm_network_security_group" "dev-nsg" {
  name                = "dev-nsg"
  location            = azurerm_resource_group.linux-dev-rg.location
  resource_group_name = azurerm_resource_group.linux-dev-rg.name
  tags = {
    environment = "dev"
  }
}

resource "azurerm_network_security_rule" "dev-rule" {
  name                        = "dev-rule"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.linux-dev-rg.name
  network_security_group_name = azurerm_network_security_group.dev-nsg.name
}

resource "azurerm_subnet_network_security_group_association" "dev-nsga" {
  subnet_id                 = azurerm_subnet.dev-subnet.id
  network_security_group_id = azurerm_network_security_group.dev-nsg.id
}

resource "azurerm_public_ip" "dev-ip" {
  name                = "dev-ip"
  resource_group_name = azurerm_resource_group.linux-dev-rg.name
  location            = azurerm_resource_group.linux-dev-rg.location
  allocation_method   = "Dynamic"

  tags = {
    environment = "dev"
  }
}

resource "azurerm_network_interface" "dev-nic" {
  name                = "dev-nic"
  location            = azurerm_resource_group.linux-dev-rg.location
  resource_group_name = azurerm_resource_group.linux-dev-rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.dev-subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.dev-ip.id
  }
  tags = {
    environment = "dev"
  }
}

resource "azurerm_linux_virtual_machine" "dev-vm" {
  name                  = "dev-vm"
  resource_group_name   = azurerm_resource_group.linux-dev-rg.name
  location              = azurerm_resource_group.linux-dev-rg.location
  size                            = "Standard_F2"
  admin_username                  = "${var.vm_username}"
  admin_password                  = "${var.vm_password}"
  disable_password_authentication = false
  network_interface_ids = [azurerm_network_interface.dev-nic.id]

  admin_ssh_key {
    username   = var.vm_username
    public_key = file("~/.ssh/id_rsa.pub")
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  os_disk {
    storage_account_type = "Standard_LRS"
    caching              = "ReadWrite"
  }

  provisioner "remote-exec" {
    inline = [
    "sudo apt-get update",
    "sudo apt-get install -y nginx",
    "sudo systemctl start nginx",
    "sudo systemctl enable nginx",
    "sudo apt-get update",
    "sudo apt-get install docker.io -y",
    "sudo systemctl enable docker.service",
    "sudo systemctl start docker.service",
    "sudo usermod -aG docker $USER",
    "sudo apt-get install -y docker-compose",
    "sudo mkdir -p ~/my-api",
    "sudo chown -R mdiandev:mdiandev ~/my-api"
  ]

    connection {
      type        = "ssh"
      host        = self.public_ip_address
      user        = "${var.vm_username}"
      private_key = file("~/.ssh/id_rsa")
    }
  }


  provisioner "file" {
    source      = ".env"
    destination = "/home/${var.vm_username}/my-api/.env"
    connection {
      type        = "ssh"
      host        = self.public_ip_address
      user        = var.vm_username
      private_key = file("~/.ssh/id_rsa")
    }
  }

  provisioner "file" {
    source      = "init.sql"
    destination = "/home/${var.vm_username}/my-api/init.sql"
    connection {
      type        = "ssh"
      host        = self.public_ip_address
      user        = var.vm_username
      private_key = file("~/.ssh/id_rsa")
    }
  }

  provisioner "file" {
    source      = "docker-compose.yml"
    destination = "/home/${var.vm_username}/my-api/docker-compose.yml"
    connection {
      type        = "ssh"
      host        = self.public_ip_address
      user        = var.vm_username
      private_key = file("~/.ssh/id_rsa")
    }
  }

  provisioner "remote-exec" {
    inline = [
    "cd ~/my-api",
    "${data.template_file.docker_login_script.rendered}",
    "docker-compose up -d"
  ]

    connection {
      type        = "ssh"
      host        = self.public_ip_address
      user        = var.vm_username
      private_key = file("~/.ssh/id_rsa")
    }
  }
}
