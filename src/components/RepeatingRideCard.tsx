import { useRouter } from "next/router";
import { useState } from "react";
import { RepeatingRide } from "../types";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  ride: RepeatingRide;
};

export const RepeatingRideCard: React.FC<Props> = ({ ride }: Props) => {
  const [isSwiping, setSwiping] = useState(false);
  const router = useRouter();
  const { id, name, group, destination, distance } = ride;

  const details = destination
    ? `${destination} - ${distance || ""} km`
    : `${distance || ""} km`;

  const onPress = () => router.push(`/repeating-rides/${id}`);

  if (!id) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="md:mx-autotext-neutral-500 box-border flex items-center w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress();
        }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        if (e.cancelable) e.preventDefault();
        if (!isSwiping) {
          onPress();
        }
        setSwiping(false);
      }}
    >
      <div className="flex-col lg:flex-row flex-1 p-2 gap-1 truncate">
        <div className="align-middle font-bold uppercase tracking-wide">
          {name} {group ? `- ${group}` : ""}{" "}
        </div>
        <div className="truncate">{details}</div>
      </div>
    </div>
  );
};
