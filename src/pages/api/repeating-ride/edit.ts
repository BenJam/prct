// src/pages/api/add-rider-to-ride.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { isLoggedIn, getUserPreferences, isAdmin } from "../auth/authHelpers";
import { convertToKms, repeatingRideToDb } from "../../../../shared/utils";
import { Preferences, RepeatingRideDb } from "../../../types";

export const changeRepeatingRide = async (ride: RepeatingRideDb) => {
  const { id, ...data } = ride;
  try {
    const result = await prisma.repeatingRide.update({
      data,
      where: { id },
    });
    return result;
  } catch (err) {
    return { error: err };
  }
};

// Only a logged-in user can join a ride
const editRide = async (req: NextApiRequest, res: NextApiResponse) => {
  const isAuth = await isLoggedIn(req, res);

  if (!isAuth) {
    return res.status(401).send({
      error: "Only a leader can create a ride.",
    });
  }

  try {
    const ride = repeatingRideToDb(req.body);

    // Cast limit to number
    if (ride.limit) {
      ride.limit = +ride.limit;
    }

    const hasAdminRole = await isAdmin(req, res);

    if (hasAdminRole) {
      // Convert to kms if necessary
      const preferences = (await getUserPreferences(req, res)) as Preferences;

      if (ride.distance && preferences.units === "miles") {
        ride.distance = convertToKms(ride.distance);
      }

      const success = await changeRepeatingRide(ride);
      return res.status(200).json(success);
    }
    return res.status(401).send({
      error: "Not authorised to use this API",
    });
  } catch (err) {
    // Could send actual error!
    return res.status(401).send({
      error: err,
    });
  }
};

export default editRide;
