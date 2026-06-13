import { Init as initConfig } from "@/config/init.js";
import { Init as initConsumer } from "@/consumer/init.js";
import { Init as initController } from "@/controller/init.js";
import { Init as initInfra } from "@/infra/init.js";
import { Init as initKernel } from "@/kernel/init.js";
import { Init as initMiddleware } from "@/middlewares/init.js";
import { Init as initService } from "@/service/init.js";

const config = initConfig();
const infra = initInfra(config);

const service = initService(config, infra);

const controller = initController(service);
const middleware = initMiddleware(config);

initKernel(controller, middleware, config).Start();

if (config.MQUrl !== "") {
  initConsumer(service, config).Start().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

console.log("email-service started");
