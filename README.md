
![Logo](https://tech.osteel.me/images/2020/03/04/docker-part-1-01.jpg)


# LEAMP-Resume
This project seeks to easily create a web application capable of processing requests quickly and efficiently using Docker.

## What’s a LEAMP stack?
LEMP refers to a collection of open-source software that is commonly used together to serve web applications. The term LEMP is an acronym that represents the configuration of a Linux operating system with an nginx (pronounced engine-x, hence the E in the acronym) web server, with site data stored in a MySQL database and dynamic content processed by PHP.

LEAMP is the same but with Angular addition.


![Logo](https://ahex.co/wp-content/uploads/2017/11/Ahex-LEMP-1.png)

## Features
- Nginx 1.21
- Angular 13.2.6
- Node 12.22.5
- Php 8-fpm (includes mysqli extension)
- Mysql 8.0.28
- PhpMyadmin 5.1.1-apache
- Includes easy start (Check if you have all the requirements to start the project. in case it does not install them automatically.)


## Deployment
### Before starting !
You have to configure the following files to get it to work properly:

- .env.example (rename and configure)

### Start project
#### Development environment
Start project

```bash
sh start-dev.sh
```
Stop project

```bash
sh stop-dev.sh
```

Go to localhost in your preferred browser.

#### Production environment
Start project

```bash
sh start-prod.sh
```
Stop project

```bash
sh stop-prod.sh
```

Go to localhost:4200 in your preferred browser.

## Documentation
- [Docker](https://docs.docker.com/)
- [Nginx](http://nginx.org/en/docs/)
- [Angular](https://angular.io/docs)
- [Node](https://nodejs.org/es/docs/) 
- [Php](https://www.php.net/docs.php)
- [Mysql](https://dev.mysql.com/doc/)
- [PhpMyadmin](https://www.phpmyadmin.net/docs/)

## Badges
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![PhpMyAdmin](https://img.shields.io/badge/phpmyadmin-orange?style=for-the-badge&logo=mysql&logoColor=white)


## Authors
- [@MCA-99](https://www.github.com/MCA-99)