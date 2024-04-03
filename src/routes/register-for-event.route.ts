import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: { 201: z.object({ attendeeId: z.number() }) },
      },
    },
    
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: { eventId_email: { email, eventId } },
      });

      if (attendeeFromEmail !== null) {
        throw new Error("This email is alwready registered on this event.");
      }

      const [event, ammountOfAttendeesForEvent]=await Promise.all([
        prisma.event.findUnique({ where: { id: eventId } }),
        prisma.attendee.count({ where: { eventId } }),
      ]);

      console.log(event?.maximumAttendees, ammountOfAttendeesForEvent)

      if (
        event?.maximumAttendees &&
        ammountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        throw new Error(
          "Maximum number os attendees for this events was reached."
        );
      }

      const attendee = await prisma.attendee.create({
        data: { name, email, eventId },
      });

      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}
