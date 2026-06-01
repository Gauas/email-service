import type { Config } from "@/config/main.js";
import type { Service } from "@/service/main.js";

import type { ConsumerMessage, ConsumerMessageHandler, MessageConsumer } from "@/consumer/types.js";
import { BrokerConsumer } from "@/consumer/transports/broker.js";
import { StdinJsonlConsumer } from "@/consumer/transports/stdin-jsonl.js";
import { appError } from "@/service/helper.js";

type ConsumerHandler = (message: ConsumerMessage) => Promise<void>;

export class ConsumerKernel {
  private readonly handlers: Map<string, ConsumerHandler>;
  private readonly consumer: MessageConsumer;

  constructor(
    private readonly Service: Service,
    private readonly Config: Config
  ) {
    this.handlers = new Map<string, ConsumerHandler>([["email.send", this.handleEmailSend.bind(this)]]);
    this.consumer = this.newTransport();
  }

  async Start(): Promise<void> {
    await this.consumer.Start(this.route.bind(this));
  }

  private async route(message: ConsumerMessage): Promise<void> {
    const handler = this.handlers.get(message.type);

    if (!handler) {
      throw appError(400, `unsupported message type: ${message.type}`);
    }

    await handler(message);
  }

  private newTransport(): MessageConsumer {
    if (this.Config.MQUrl !== "") {
      return new BrokerConsumer(this.Config.MQUrl);
    }

    return new StdinJsonlConsumer();
  }

  private async handleEmailSend(message: ConsumerMessage): Promise<void> {
    await this.Service.SendEmail(
      { requestId: message.id },
      message.payload as ConsumerMessageHandler<"email.send">["payload"]
    );

    console.log(
      JSON.stringify({
        service: this.Config.ServiceName,
        type: "consumer.message.processed",
        message_id: message.id,
        message_type: message.type
      })
    );
  }
}

export function New(service: Service, config: Config): ConsumerKernel {
  return new ConsumerKernel(service, config);
}
