import type { Config } from "@/config/init.js";
import type { Service } from "@/service/init.js";

import type { ConsumerMessage, MessageConsumer } from "@/consumer/types.js";
import type { SendEmailRequest } from "@/dto/request/mail.js";
import { BrokerConsumer } from "@/consumer/transports/broker.js";
import { appError } from "@/service/helper.js";

type ConsumerHandler = (message: ConsumerMessage) => Promise<void>;

export function Init(service: Service, config: Config): ConsumerKernel {
  return new ConsumerKernel(service, config);
}

export class ConsumerKernel {
  private readonly handlers: Map<string, ConsumerHandler>;
  private readonly consumer: MessageConsumer;

  constructor(private readonly service: Service, private readonly config: Config) {
    this.handlers = new Map<string, ConsumerHandler>([["email.send", this.handleEmailSend.bind(this)]]);

    this.consumer = this.initTransport();
  }

  async Start(): Promise<void> {
    await this.consumer.Start(this.route.bind(this));
  }

  private initTransport(): MessageConsumer {
    return new BrokerConsumer(this.config.MQUrl);
  }

  private async route(message: ConsumerMessage): Promise<void> {
    const handler = this.handlers.get(message.type);

    if (!handler) {
      throw appError(400, `unsupported message type: ${message.type}`);
    }

    await handler(message);
  }

  private async handleEmailSend(message: ConsumerMessage): Promise<void> {
    await this.service.SendEmail({ requestId: message.id }, toEmailRequest(message.payload));

    console.log(
      JSON.stringify({
        service: this.config.ServiceName,
        type: "consumer.message.processed",
        message_id: message.id,
        message_type: message.type
      })
    );
  }
}

function toEmailRequest(payload: unknown): SendEmailRequest {
  const req = payload as SendEmailRequest & { type?: string };

  if (req.type === "verification") {
    return {
      ...req,
      template: "verification"
    };
  }

  return req;
}
