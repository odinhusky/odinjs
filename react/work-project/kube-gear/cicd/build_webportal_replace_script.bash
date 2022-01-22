echo "#!/bin/bash" > webportal_replace_script.bash

for e in 'REACT_APP_REST_SERVER_URI REST_SERVER_URI' \
         'REACT_APP_PROMETHEUS_URI PROMETHEUS_URI' \
         'REACT_APP_GRAFANA_URI GRAFANA_URI' \
         'REACT_APP_HARBOR_URI HARBOR_URI' \
         'REACT_APP_JAVA_REST_SERVER_URI JAVA_REST_SERVER_URL' \
         'REACT_APP_K8S_DASHBOARD_URI K8S_DASHBOARD_URI' \
         'REACT_APP_K8S_API_SERVER_URI K8S_API_SERVER_URI' \
         'REACT_APP_DATA_LABELING DATA_LABELING_URI' \
         'REACT_APP_PRODUCT_NAME PRODUCT_NAME' \
         'REACT_APP_PRODUCT_VERSION PRODUCT_VERSION' \
         'REACT_APP_COMPANY_NAME COMPANY_NAME' \
         'REACT_APP_COPYRIGHT_YEAR COPYRIGHT_YEAR';
  do
    declare -a a=($e)
    echo "sed -i \"s@${!a[0]}@\$${a[1]}@g\" /usr/share/nginx/html/static/js/main*" >> webportal_replace_script.bash
    echo "sed -i \"s@${!a[0]}@\$${a[1]}@g\" /usr/share/nginx/html/index.html" >> webportal_replace_script.bash
  done
