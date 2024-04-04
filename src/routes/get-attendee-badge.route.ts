import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "../Errors/bad-request.error";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Gets the event badge for an attendee.",
        tags: ["attendees"],
        params: z.object({ attendeeId: z.coerce.number() }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventId: z.string().uuid(),
              eventTitle: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: { select: { id: true, title: true } },
        },
        where: { id: attendeeId },
      });

      if (attendee === null) {
        throw new BadRequest("Attendee not found");
      }

      const baseUrl = `${request.protocol}://${request.hostname}`;
      const checkInUrl = new URL(`/attendee/${attendeeId}/check-in`, baseUrl);

      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventId: attendee.event.id,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString(),
        },
      });
    }
  );
}
