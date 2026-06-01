import type { SendEmailRequest } from "@/dto/request/mail.js";

export type ConsumerEventMap = {
  "email.send": SendEmailRequest;
};

export type ConsumerMessageType = keyof ConsumerEventMap;

export type ConsumerMessageHandler<TType extends ConsumerMessageType> = {
  id: string;
  type: TType;
  payload: ConsumerEventMap[TType];
};

export type ConsumerMessage = {
  id: string;
  type: string;
  payload: unknown;
};

export type ConsumerHandlerFn = (message: ConsumerMessage) => Promise<void>;

export type MessageConsumer = {
  Start(handler: ConsumerHandlerFn): Promise<void>;
  Stop(): Promise<void>;
};
