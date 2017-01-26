# Dynamic Load Balancing
To see this code in action, you must do the following. This builds the node which we will be scaling and load balancing.

`cd dynamic_node`

`npm i`

`docker build -t dynamic_node .`

Then we must build and start the management interface and load balancer.

`cd ..`

`npm i`

`docker-compose up --build`

The management interface then runs on `localhost:3000`, whereas the load balanced application runs on `localhost:8080`.
