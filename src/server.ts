import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import {} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { createEvent } from "./routes/create-event.route";
import { registerForEvent } from "./routes/register-for-event.route";
import { getEvent } from "./routes/get-event.route";
import { getAttendeeBadge } from "./routes/get-attendee-badge.route";

const app = fastify();
const port = 3333;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);

app.listen({ port: port }).then(() => {
  console.log(`HTTP Server Running at ${port} `);
});
