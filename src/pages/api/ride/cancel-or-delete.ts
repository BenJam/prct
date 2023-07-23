/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// src/pages/api/add-rider-to-ride.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { isAdmin } from "../auth/authHelpers";
import { doCancelRide } from "./cancel";
import { removeRide } from "./delete";

export const removeOrCancelRides = async (scheduleId: string) => {
  let cancelled = 0;
  let deleted = 0;

  try {
    const ridesToRemove = await prisma.ride.findMany({
      where: { scheduleId },
      include: {
        users: {
          include: { user: true },
        },
      },
    });

    // If ride has users then cancel, else delete
    for (const ride of ridesToRemove) {
      if (ride.users?.length > 0) {
        await doCancelRide(ride.id);
        cancelled += 1;
      } else {
        await removeRide(ride.id);
        deleted += 1;
      }
    }

    return { cancelled, deleted, total: cancelled + deleted };
  } catch (err) {
    return { error: err };
  }
};

// Only a logged-in user can join a ride
const cancelOrDeleteRides = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const isAuth = await isAdmin(req, res);

  if (!isAuth) {
    return res.status(401).send({
      error: "Not authorised to use this API",
    });
  }

  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(500).send({
        error: "No schedule id supplied",
      });
    }

    const success = await removeOrCancelRides(scheduleId);

    return res.status(200).json(success);
  } catch (err) {
    // Could send actual error!
    return res.status(401).send({
      error: err,
    });
  }
};

export default cancelOrDeleteRides;
