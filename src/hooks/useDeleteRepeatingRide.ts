import useSWR from "swr";

export const deleteRepeatingRide = async (
  id: string,
  deleteAllRides?: boolean
) => {
  const results = await fetch(`/api/repeating-ride/delete`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, deleteAllRides }),
  }).then((res) => res.json());
  return results;
};

export const useDeleteRepeatingRide = (
  id: string,
  deleteAllRides?: boolean
) => {
  const { data, error } = useSWR(`/api/repeating-ride/delete`, () =>
    deleteRepeatingRide(id, deleteAllRides)
  );

  return {
    ride: data,
    loading: !error && !data,
    error,
  };
};
