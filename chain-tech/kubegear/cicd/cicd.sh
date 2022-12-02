#!/bin/sh

# build source code
docker run -it \
  -e REACT_APP_REST_SERVER_URI=http://192.168.0.102:9186  \
  -e REACT_APP_JAVA_REST_SERVER_URI=http://192.168.0.102:9183 \
  -e REACT_APP_PROMETHEUS_URI=http://192.168.0.102:30100 \
  -e REACT_APP_GRAFANA_URI=http://192.168.0.102:3000  \
  -e REACT_APP_K8S_DASHBOARD_URI=http://192.168.0.102:9090  \
  -e REACT_APP_K8S_API_SERVER_URI=http://192.168.0.102:8080  \
  -e REACT_APP_HARBOR_URI=http://192.168.0.159/harbor  \
  -e REACT_APP_DATA_LABELING=http://192.168.0.130:18080 \
  -e REACT_APP_PRODUCT_NAME=thisisproductname \
  -e REACT_APP_PRODUCT_VERSION=thisisproductversion \
  -e REACT_APP_COMPANY_NAME=thisiscompanyname \
  -e REACT_APP_COPYRIGHT_YEAR=thisiscopyrightyear \
  -e REACT_APP_EXPORTER_PORT=9100  \
  -e REACT_APP_PROM_SCRAPE_TIME=300s  \
  -e REACT_APP_WEBPORTAL_PLUGINS="[{\"uri\": \"/scripts/plugins/marketplace.bundle.js\", \"id\": null, \"title\": \"Marketplace\"}]"  \
  -e REACT_APP_WEBPORTAL_VERSION=v1.7.1  \
  -v /home/nick/kube-gear:/usr/src/app \
  --rm \
  -w /usr/src/app \
  node:12.18.2 /bin/bash -c "npm i && npm run build && cd cicd && source build_webportal_replace_script.bash"

# build docker image
cp -r ../build .
docker rmi -f 105552010/webportal:nginx1.19
docker build -t 105552010/webportal:nginx1.19 .
rm -rf build webportal_replace_script.bash
docker push 105552010/webportal:nginx1.19