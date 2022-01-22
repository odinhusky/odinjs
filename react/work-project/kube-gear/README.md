## KubeGear

### `env`

```
  copy .env.example to .env
```


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Docker command example (Work in process...)
```
  docker run -it -p 9453:80  \
  -e REACT_APP_LAUNCHER_WEBSERVICE_URI=http://192.168.0.247:9086  \
  -e REACT_APP_REST_SERVER_URI=http://192.168.0.247:9186  \
  -e REACT_APP_JAVA_REST_SERVER_URI=http://192.168.0.247:9183 \
  -e REACT_APP_PROMETHEUS_URI=http://192.168.0.247  \
  -e REACT_APP_GRAFANA_URI=http://192.168.0.247:3000  \
  -e REACT_APP_YARN_WEB_PORTAL_URI=http://192.168.0.247:8088  \
  -e REACT_APP_K8S_DASHBOARD_URI=http://192.168.0.247:9090  \
  -e REACT_APP_K8S_API_SERVER_URI=http://192.168.0.247:8080  \
  -e REACT_APP_HARBOR_URI=http://193.168.0.159/harbor  \
  -e REACT_APP_EXPORTER_PORT=9100  \
  -e REACT_APP_PROM_SCRAPE_TIME=300s  \
  -e REACT_APP_WEBPORTAL_PLUGINS="[{\"uri\": \"/scripts/plugins/marketplace.bundle.js\", \"id\": null, \"title\": \"Marketplace\"}]"  \
  -e REACT_APP_WEBPORTAL_VERSION=v0.12.8  \
  -v YOUR_PROJECT_PATH/build:/usr/share/nginx/html  \
  -v YOUR_PROJECT_PATH/build/nginx.conf:/etc/nginx/conf.d/default.conf \
  --name KubeGearF2E DOCKER_REPO_NAME bash
```