// src/pages/api/rides.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { RepeatingRide } from "src/types";
import { prisma } from "../../../server/db/client";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { isAdmin } from "../auth/authHelpers";
import { repeatingRideFromDb } from "../../../../shared/utils";

export const listRepeatingRides = async (): Promise<RepeatingRide[]> => {
  const rideRecords = await prisma.repeatingRide.findMany({
    orderBy: { name: "asc" },
  });

  if (!rideRecords) {
    return [];
  }

  // Remove createdAt key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return rideRecords.map(({ createdAt, ...ride }) => repeatingRideFromDb(ride));
};

const getRepeatingRides = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authorised" });
  }

  const hasAdminRole = await isAdmin(req, res);

  if (hasAdminRole) {
    const userData = await listRepeatingRides();
    return res.status(200).json(userData);
  }
  return res.status(401).send({
    error: "Not authorised to use this API",
  });
};

export default getRepeatingRides;
