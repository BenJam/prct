import type { NextApiRequest, NextApiResponse } from "next";
import { RepeatingRide } from "src/types";
import { prisma } from "../../../server/db/client";
import { isAdmin } from "../auth/authHelpers";
import { repeatingRideFromDb } from "../../../../shared/utils";

export const getRepeatingRide = async (
  id: string | string[] | undefined
): Promise<RepeatingRide | null> => {
  const scheduleId = Array.isArray(id) ? id[0] : id;

  if (!scheduleId) {
    return null;
  }

  const ride = await prisma.repeatingRide.findUnique({
    where: {
      id: scheduleId,
    },
  });

  if (!ride) {
    return null;
  }

  // Remove createdAt key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, ...rest } = ride;

  return repeatingRideFromDb(rest);
};

const repeatingRide = async (req: NextApiRequest, res: NextApiResponse) => {
  const isAuth = await isAdmin(req, res);
  const { id } = req.query;

  if (!isAuth) {
    return res.status(401).json({ error: "Not authorised" });
  }

  const rideDetails = await getRepeatingRide(id);

  return res.status(200).json(rideDetails);
};

export default repeatingRide;
