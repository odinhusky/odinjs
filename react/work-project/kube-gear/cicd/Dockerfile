FROM nginx:1.19.1

COPY build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY webportal_replace_script.bash /usr/src/app/
CMD ["/bin/bash", "-c", "source /usr/src/app/webportal_replace_script.bash && nginx -g 'daemon off;'"]
