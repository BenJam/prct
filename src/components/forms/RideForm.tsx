/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEventHandler, useState } from "react";
import {
  UseFormRegister,
  FieldErrorsImpl,
  UseFormReturn,
} from "react-hook-form";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { RIDER_LIMIT_OPTIONS } from "../../constants";
import { getNow } from "../../../shared/utils";
import { Preferences, RideFormValues } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { RepeatingRideForm } from "./RepeatingRideForm";

const today = getNow().split("T")[0] || "";

type RideFormProps = {
  defaultValues: RideFormValues;
  register: UseFormRegister<RideFormValues>;
  errors: Partial<FieldErrorsImpl<RideFormValues>>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleSchedule?: FormEventHandler<HTMLFormElement>;
  waiting: boolean;
  preferences: Preferences;
  isAdmin: boolean;
  watch: UseFormReturn<RideFormValues>["watch"];
  setValue: UseFormReturn<RideFormValues>["setValue"];
  isRepeating?: boolean;
};

export const RideForm = ({
  defaultValues,
  register,
  errors,
  handleSubmit,
  handleSchedule,
  waiting,
  preferences,
  isAdmin,
  watch,
  setValue,
  isRepeating = false,
}: RideFormProps) => {
  const isNewRide = !defaultValues.id;
  const [repeats, setRepeats] = useState<boolean>(isRepeating);
  const showRepeatingSwitch = isAdmin && (isNewRide || isRepeating);

  const switchClass = clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full",
    repeats ? "bg-green-600" : "bg-gray-200"
  );
  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    repeats ? "translate-x-6" : "translate-x-1"
  );
  const handleRepeatsChange = () => setRepeats(!repeats);

  return (
    <form
      className="form-control relative grid w-full grid-cols-1 gap-4 p-2"
      onSubmit={repeats ? handleSchedule : handleSubmit}
    >
      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="name" className="flex flex-col gap-1">
          Ride name *
          <input
            id="name"
            type="text"
            className="input"
            defaultValue={defaultValues.name}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="font-normal text-red-500">
              Ride name is required
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="group" className="flex flex-col gap-1">
            Group name
            <input
              id="group"
              type="text"
              className="input"
              defaultValue={defaultValues.group}
              {...register("group")}
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="limit" className="flex flex-col gap-1">
            Rider limit
            <select
              id="limit"
              className="input"
              defaultValue={defaultValues.limit}
              {...register("limit")}
            >
              <option value="-1">No limit</option>
              {RIDER_LIMIT_OPTIONS.map((val: number) => (
                <option key={`limit-${val}`} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="date" className="flex flex-col gap-1">
            Date *
            <input
              id="date"
              type="date"
              min={today}
              className="input"
              defaultValue={defaultValues.date}
              {...register("date", {
                required: true,
              })}
            />
            {errors.date && (
              <span className="font-normal text-red-500">
                Ride date is required
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="time" className="flex flex-col gap-1">
            Start time *
            <input
              id="time"
              type="time"
              className="input"
              defaultValue={defaultValues.time}
              {...register("time", { required: true })}
            />
            {errors.time && (
              <span className="font-normal text-red-500">
                Start time is required
              </span>
            )}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="meetPoint" className="flex flex-col gap-1">
          Meeting point
          <input
            id="meetPoint"
            type="text"
            className="input"
            defaultValue={defaultValues.meetPoint}
            {...register("meetPoint")}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="distance" className="flex flex-col">
          Distance ({preferences.units}) *
          <input
            id="distance"
            type="number"
            className="input"
            defaultValue={defaultValues.distance}
            {...register("distance", {
              required: {
                value: true,
                message: "You must set a distance",
              },
              min: {
                value: 2,
                message: "Distance must be greater than 1km",
              },
            })}
          />
          {errors.distance && (
            <span className="font-normal text-red-500">
              {errors.distance.message}
            </span>
          )}
        </label>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="destination" className="flex flex-col">
          Destination
          <input
            id="destination"
            type="text"
            className="input"
            defaultValue={defaultValues.destination}
            {...register("destination")}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="route" className="flex flex-col">
          Route Link
          <input
            id="route"
            type="text"
            className="input"
            defaultValue={defaultValues.route}
            {...register("route")}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="leader" className="flex flex-col">
          Leader
          <input
            id="leader"
            type="text"
            className="input"
            defaultValue={defaultValues.leader}
            {...register("leader")}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="notes" className="flex flex-col">
          Notes
          <textarea
            id="notes"
            className="textarea"
            rows={4}
            defaultValue={defaultValues.notes}
            {...register("notes")}
          />
        </label>
      </div>

      {showRepeatingSwitch && (
        <>
          <div className="flex flex-row">
            <div className="pr-8">This ride repeats</div>
            <Switch
              checked={repeats}
              onChange={handleRepeatsChange}
              className={switchClass}
            >
              <span className="sr-only">Enable notifications</span>
              <span className={toggleClass} />
            </Switch>
          </div>
          <RepeatingRideForm
            defaultValues={defaultValues}
            register={register}
            errors={errors}
            repeats={repeats}
            watch={watch}
            setValue={setValue}
            isRepeating={isRepeating}
          />
        </>
      )}

      <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
        <Button primary loading={waiting} type="submit">
          <div>Save</div>
        </Button>
        <CancelButton />
      </div>
    </form>
  );
};
