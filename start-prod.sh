#!/bin/bash

# *** STEP 1: CHECK FOR DEPENDENCIES ***

# Check if Docker is installed, if not proceed to install it
if [ -x "$(command -v docker)" ]; then
    echo "✔ ··· Docker is installed"
else
    echo "✘ ··· Docker is not installed... proceed to install it"
    # Update the apt package index and install packages to allow apt to use a repository over HTTPS:
    sudo apt-get update
    sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

    # Add Docker’s official GPG key:
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Use the following command to set up the stable repository. (x86_64/amd64)
    echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io

    # Verify that Docker Engine is installed correctly
    docker -v
fi

# Check if Docker-Compose is installed, if not proceed to install it
if [ -x "$(command -v docker-compose)" ]; then
    echo "✔ ··· Docker-Compose is installed"
else
    echo "✘ ··· Docker-Compose is not installed... proceed to install it"
    # Run this command to download the current stable release of Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    # Apply executable permissions to the binary
    sudo chmod +x /usr/local/bin/docker-compose

    # Create a symbolic link to /usr/bin
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    # Verify that Docker-Compose is installed correctly
    docker-compose --version
fi

# *** STEP 2: START PROJECT ***

# Restore permissions to database
sudo chown -R 999:999 db/
echo "✔ ··· Starting project"
docker-compose -f docker-compose.prod.yml up -d