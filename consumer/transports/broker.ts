import amqp, { type ConsumeMessage } from "amqplib";

import type { ConsumerHandlerFn, ConsumerMessage, MessageConsumer } from "@/consumer/types.js";

const EMPTY_LINE = "";
const DEFAULT_QUEUE = "email.send";
const DEFAULT_PREFETCH = 10;

export class BrokerConsumer implements MessageConsumer {
  private connection: amqp.ChannelModel | null;
  private channel: amqp.Channel | null;

  constructor(private readonly url: string) {
    this.connection = null;
    this.channel = null;
  }

  async Start(handler: ConsumerHandlerFn): Promise<void> {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(DEFAULT_QUEUE, { durable: true });
    await this.channel.prefetch(DEFAULT_PREFETCH);

    await this.channel.consume(DEFAULT_QUEUE, async (msg: ConsumeMessage | null) => {
      if (!msg || !this.channel) return;

      try {
        const message = this.parse(msg.content.toString("utf8"));
        await handler(message);
        this.channel.ack(msg);
      } catch (error) {
        this.channel.nack(msg, false, false);
        throw error;
      }
    });

    await new Promise<void>((resolve, reject) => {
      if (!this.connection) return resolve();
      this.connection.once("close", () => resolve());
      this.connection.once("error", reject);
    });
  }

  async Stop(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }

    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  private parse(raw: string): ConsumerMessage {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const now = Date.now().toString();

    return {
      id: typeof parsed.id === "string" && parsed.id !== EMPTY_LINE ? parsed.id : now,
      type: typeof parsed.type === "string" ? parsed.type : EMPTY_LINE,
      payload: parsed.payload
    };
  }
}
