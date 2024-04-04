import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { number, string, z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "gets all attendees for an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: string(),
                email: string().email(),
                createdAt: z.date(),
                checkedIn: z.date().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;

      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: { select: { createdAt: true } },
        },
        // where: query ? { eventId, name: { contains: query } } : { eventId },
        where: query
          ? {
              eventId,
              OR: [
                { name: { contains: query } },
                { email: { contains: query } },
              ],
            }
          : { eventId },

        take: 10,
        skip: pageIndex * 10,
        orderBy: { createdAt: "desc" },
      });

      return reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedIn: attendee.checkIn?.createdAt ?? null,
          };
        }),
      });
    }
  );
}
