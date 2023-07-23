import useSWR from "swr";

export const generateRides = (scheduleId: string) =>
  fetch(`/api/repeating-ride/generate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scheduleId }),
  }).then((res) => res.json());

export const useGenerateRides = (scheduleId: string) => {
  const { data, error } = useSWR(`/api/repeating-ride/generate`, () =>
    generateRides(scheduleId)
  );

  return {
    ride: data,
    loading: !error && !data,
    error,
  };
};
