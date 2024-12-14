import amqp from 'amqplib';

export class AMQPPublish {
  constructor (replyQueueName, exchange, host) {
    this.host = host;
    this.exchange = exchange;
    this.replyQueueName= replyQueueName;
    this.requestResolver = null;
  }

  async consume(cb) {
    this.connection = await amqp.connect(this.host);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(
      this.replyQueueName,
      { durable: false }
    );

    await this.channel.assertExchange(
      this.exchange,
      'fanout',
      { durable: false }
    );

    this.channel.consume(this.replyQueueName, msg => {
      if (this.timeoutResolve) this.timeoutResolve();
      cb(JSON.parse(msg.content.toString()));
    }, { noAck: true });
  }

  publish(message) {
    return new Promise((resolve, reject) => {
      const replyTimeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      this.timeoutResolve = () => {
        clearTimeout(replyTimeout);
        this.timeoutResolve = null;
        resolve();
      };

      this.channel.publish(this.exchange, '',
        Buffer.from(JSON.stringify(message))
      );
    });
  }

  destroy () {
    this.channel.close();
    this.connection.close();
  }
}
