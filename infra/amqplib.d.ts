declare module "amqplib" {
  import type { Buffer } from "node:buffer";

  export type ConsumeMessage = {
    content: Buffer;
  };

  export type Channel = {
    assertQueue(queue: string, options: { durable: boolean }): Promise<unknown>;
    prefetch(count: number): Promise<unknown>;
    consume(queue: string, handler: (message: ConsumeMessage | null) => void | Promise<void>): Promise<unknown>;
    ack(message: ConsumeMessage): void;
    nack(message: ConsumeMessage, allUpTo?: boolean, requeue?: boolean): void;
    close(): Promise<void>;
  };

  export type ChannelModel = {
    createChannel(): Promise<Channel>;
    once(event: "close", handler: () => void): ChannelModel;
    once(event: "error", handler: (error: Error) => void): ChannelModel;
    close(): Promise<void>;
  };

  const amqp: {
    connect(url: string): Promise<ChannelModel>;
  };

  export default amqp;
}
