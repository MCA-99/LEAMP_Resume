FROM php:8-fpm

# Install Prestashop requirements
RUN apt-get update \
    && apt-get install -y iputils-ping \
    && docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# PHP configuration
COPY php.ini /usr/local/etc/php/

# RUN chown -R www-data:www-data /var/www/html/

CMD ["php-fpm"]