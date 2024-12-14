import amqp from 'amqplib';

export class AMQPReply {
  constructor(replyQueueName, exchange, host) {
    this.host = host;
    this.exchange = exchange;
    this.replyQueueName = replyQueueName;
  }

  async initialize() {
    const connection = await amqp.connect(this.host);
    this.channel = await connection.createChannel();

    await this.channel.assertQueue(
      this.replyQueueName,
      { durable: false }
    );

    await this.channel.assertExchange(
      this.exchange,
      'fanout',
      { durable: false }
    );

    const { queue } = await this.channel.assertQueue(
      '',
      { exclusive: true }
    );
    this.requestQueue = queue;
    await this.channel.bindQueue(
      this.requestQueue,
      this.exchange,
      ''
    );
  }

  handleRequest(handler) {
    this.channel.consume(this.requestQueue, async (msg) => {
      const content = JSON.parse(msg.content.toString());
      const replyData = await handler(content);
      this.channel.sendToQueue(
        this.replyQueueName,
        Buffer.from(JSON.stringify(replyData))
      );
      this.channel.ack(msg);
    })
  }
}
