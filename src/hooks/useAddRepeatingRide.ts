import useSWR from "swr";
import { RepeatingRide } from "../types";

export const addRepeatingRide = (ride: RepeatingRide) =>
  fetch(`/api/repeating-ride/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ride),
  }).then((res) => res.json());

export const useAddRepeatingRide = (ride: RepeatingRide) => {
  const { data, error } = useSWR(`/api/repeating-ride/create`, () =>
    addRepeatingRide(ride)
  );

  return {
    ride: data,
    loading: !error && !data,
    error,
  };
};
