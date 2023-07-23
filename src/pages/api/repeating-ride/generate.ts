import { getNextMonth } from "@utils/dates";
import { NextApiRequest, NextApiResponse } from "next";
import {
  RideSet,
  makeRidesInPeriod,
  updateRRuleStartDate,
} from "@utils/repeatingRides";
import { RepeatingRideDb } from "src/types";
import { isAdmin } from "@api/auth/authHelpers";
import { prisma } from "../../../server/db/client";

// TODO: Update comments
/**
 * This API is designed to be hit by a scheduled workflow
 * in GitHub.  The cron schedule is for the first of each month
 * and the default is to generate all rides for the following month.
 * You can override that by passing a date in the POST body.
 */
type BodyProps = {
  date?: string;
  scheduleId?: string;
};

export const getRidesFromTemplates = async ({ scheduleId }: BodyProps) => {
  // If we have an id, find one match, else return all templates
  const templates: RepeatingRideDb[] = await prisma.repeatingRide.findMany({
    orderBy: { name: "asc" },
    where: { id: scheduleId },
  });

  if (!templates) {
    return [];
  }

  // For each template, get a list rides to create
  return templates.map((template) => makeRidesInPeriod(template));
};

export const createRides = async (rideSet: RideSet[]) => {
  // Map over each array of rides
  const resultPromises = rideSet.map(
    async ({ id, rides, schedule }: RideSet) => {
      if (rides.length === 0) {
        return { scheduleId: id, count: 0 };
      }

      // find the latest date to update template
      const lastDate = rides?.at(-1)?.date;
      const data = { schedule: updateRRuleStartDate(schedule, lastDate) };

      // Create all rides and update schedule start date
      // to be later than last ride; done as a transaction
      const [createdRides] = await prisma.$transaction([
        prisma.ride.createMany({ data: rides }),
        prisma.repeatingRide.update({
          data,
          where: { id },
        }),
      ]);

      return { scheduleId: id, ...createdRides };
    }
  );

  const results = await Promise.all(resultPromises);

  return results;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { date, scheduleId }: BodyProps = req.body;
      const { authorization } = req.headers;
      const isAuth = await isAdmin(req, res);
      const isValidApiRequest =
        authorization === `Bearer ${process.env.API_KEY}`;

      if (!(isAuth || isValidApiRequest)) {
        res.status(401).end("Not authorised");
      }

      const targetMonth = date || getNextMonth();
      const rides = await getRidesFromTemplates({ scheduleId });
      const results = await createRides(rides);

      res.status(200).json({
        success: true,
        targetMonth,
        scheduleId,
        results,
      });
    } catch (err) {
      if (err instanceof Error) {
        res
          .status(500)
          .json({ success: false, statusCode: 500, message: err.message });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

/**
 * Test with the following curl command:

   curl --request POST \
     --url 'http://localhost:3000/api/repeating-ride/generate' \
     --header 'Authorization: Bearer {API_KEY}'
 */
