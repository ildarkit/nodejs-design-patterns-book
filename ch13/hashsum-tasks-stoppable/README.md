# ex13.3

This solution of exercise 13.3 uses distribute tasks to a set of remote stoppable workers using RabbitMQ and AMQP.

## Run

As a pre-requisite to this exercise, you first need to [install RabbitMQ](http://www.rabbitmq.com/download.html)

or run Docker

```shell script
docker run --rm -d --name rabbitmq -p 5672:5672 rabbitmq:4.0-management
```

To try the sample, install the dependencies:

```shell script
npm install
```

Then run (each line in a separate terminal):

```shell script
npm run start:worker
npm run start:worker
npm run start:collector
npm run start:producer
```
