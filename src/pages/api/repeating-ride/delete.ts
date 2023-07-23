// src/pages/api/add-rider-to-ride.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { removeOrCancelRides } from "@api/ride/cancel-or-delete";
import { prisma } from "../../../server/db/client";
import { isAdmin } from "../auth/authHelpers";

export const removeRepeatingRide = async (
  id: string,
  deleteAllRides?: boolean
) => {
  try {
    const result = await prisma.repeatingRide.delete({
      where: { id },
    });

    let rides;

    if (deleteAllRides) {
      rides = await removeOrCancelRides(id);
    }

    return { ...result, rides };
  } catch (err) {
    return { error: err };
  }
};

const deleteRide = async (req: NextApiRequest, res: NextApiResponse) => {
  const isAuth = await isAdmin(req, res);

  if (!isAuth) {
    return res.status(401).send({
      error: "Not authorised to use this API",
    });
  }

  try {
    const { id, deleteAllRides } = req.body;
    const success = await removeRepeatingRide(id, deleteAllRides);

    return res.status(200).json(success);
  } catch (err) {
    // Could send actual error!
    return res.status(401).send({
      error: err,
    });
  }
};

export default deleteRide;
