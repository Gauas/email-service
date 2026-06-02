import { New as newConfig } from "@/config/main.js";
import { New as newController } from "@/controller/main.js";
import { New as newInfra } from "@/infra/main.js";
import { New as newKernel } from "@/kernel/main.js";
import { New as newMiddleware } from "@/middlewares/main.js";
import { New as newService } from "@/service/main.js";

const config = newConfig();
const infra = newInfra(config);
const service = newService(config, infra);
const controller = newController(service);
const middleware = newMiddleware(config);

newKernel(controller, middleware, config).Start();

console.log("email-service started");
