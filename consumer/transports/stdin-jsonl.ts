import readline from "node:readline";

import type { ConsumerHandlerFn, ConsumerMessage, MessageConsumer } from "@/consumer/types.js";

const JSON_LOG_INDENT = 2;
const EMPTY_LINE = "";

export class StdinJsonlConsumer implements MessageConsumer {
  private readonly rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      crlfDelay: Infinity
    });
  }

  async Start(handler: ConsumerHandlerFn): Promise<void> {
    let chain = Promise.resolve();

    this.rl.on("line", (line: string) => {
      chain = chain.then(async () => {
        await this.processLine(line, handler);
      });
    });

    await new Promise<void>((resolve, reject) => {
      this.rl.once("close", async () => {
        try {
          await chain;
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      this.rl.once("error", reject);
    });
  }

  async Stop(): Promise<void> {
    this.rl.close();
  }

  private async processLine(line: string, handler: ConsumerHandlerFn): Promise<void> {
    const raw = line.trim();
    if (raw === EMPTY_LINE) return;

    const message = this.parse(raw);
    await handler(message);
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

export function LogConsumerError(error: unknown): void {
  console.error(
    JSON.stringify(
      {
        type: "consumer.error",
        error: error instanceof Error ? error.message : "unknown error"
      },
      null,
      JSON_LOG_INDENT
    )
  );
}
