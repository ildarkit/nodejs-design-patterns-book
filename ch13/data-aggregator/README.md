# ex13.5

This solution implement a publish/reply pattern on top of AMQP.

## Run

As a pre-requisite to this exercise, you first need to [install RabbitMQ](http://www.rabbitmq.com/download.html) and have it running on its default port.

or run Docker
```shell script
docker run --rm -d --name rabbitmq -p 5672:5672 rabbitmq:4.0-management
```

Install dependencies:

```shell script
npm install
```

Then run each command in their own shell:

```shell script
npm run start:replier
npm run start:replier #or more
npm run start:publisher
```
