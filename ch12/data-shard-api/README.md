# ex12.2

Solving Exercise 12.2 with a dynamic load balancer in Node.js, using Consul as the service discovery mechanism.

## Dependencies

Install all the necessary dependencies with:

```bash
npm install
```

You will also need to install consul following the [instructions for your system](https://nodejsdp.link/consul-install), or by running:

```bash
sudo apt-get install consul # on debian / ubuntu based systems
# or
brew install consul # on mac with brew installed
```


## Run

Run consul with:

```bash
npm run start:consul
```

Once this is started, you can access consul web ui at http://localhost:8500/.

To run some applications:

```bash
npm run start:apps
```

To run the load balancer:

```bash
npm run start:loadBalancer
```

Now you can finally access the application at http://localhost:8080.

Try http://localhost:8080/api/people/byFirstName/a to access the different apps.


To run a benchmark:

```bash
npm run benchmark
```

You can stop consul with ctrl+c in the terminal where consul is running.

To stop all the Node.js services use:

```bash
npm run stop
```
