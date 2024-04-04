import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import {} from "@prisma/client";
import { createEvent } from "./routes/create-event.route";
import { registerForEvent } from "./routes/register-for-event.route";
import { getEvent } from "./routes/get-event.route";
import { getAttendeeBadge } from "./routes/get-attendee-badge.route";
import { checkIn } from "./routes/check-in.route";
import { getEventAttendees } from "./routes/get-event-attendess.route";

const app = fastify();
const port = 3333;

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["applications/json"],
    info: {
      title: "pass.in",
      description:
        "Especificações de API para a aplicação pass.in desenvolvida com propósidos educacionais.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, { routePrefix: "/docs" });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);

app.register(getEventAttendees);
app.register(getAttendeeBadge);

app.register(checkIn);

app.listen({ port: port, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP Server Running at ${port} `);
});
