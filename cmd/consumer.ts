import { New as newConfig } from "@/config/main.js";
import { New as newConsumer } from "@/consumer/main.js";
import { New as newInfra } from "@/infra/main.js";
import { New as newService } from "@/service/main.js";

import { LogConsumerError } from "@/consumer/transports/stdin-jsonl.js";

async function main(): Promise<void> {
  const config = newConfig();
  const infra = newInfra(config);
  const service = newService(config, infra);
  const consumer = newConsumer(service, config);

  await consumer.Start();
}

main()
  .then(() => {
    console.log("email-consumer stopped");
  })
  .catch((error: unknown) => {
    LogConsumerError(error);
    process.exitCode = 1;
  });
