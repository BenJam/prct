import Link from "next/link";
import { formatRideBadge, getNow, isReady } from "../../../shared/utils";
import { RideV2 } from "../../types";
import { RoundBadge, Badge } from "../Badge";

type Props = {
  day: number;
  date: string;
  past?: boolean;
  rides?: RideV2[];
  classes?: string;
};

const getBadgeStyle = (
  past: boolean | undefined,
  hasUnreadyRides: boolean | undefined
): string => {
  if (past) {
    return "past";
  }
  return hasUnreadyRides ? "unready" : "ready";
};

// TODO: fix last-child borders
export const Day = ({ day, date, rides = [], classes, past }: Props) => {
  const today = getNow();
  const isToday = today.startsWith(date);
  const hasUnreadyRides = rides.filter((r) => !isReady(r)).length > 0;

  const cellStyle = isToday
    ? "bg-indigo-100 text-black hover:bg-blue-50 hover:text-neutral-900"
    : "hover:bg-blue-50 hover:text-neutral-900 cursor-pointer";

  const wrapperClasses =
    classes ||
    `lg:text-md h-[calc((100vh_-_48px)_/_6)] w-full mb-0 justify-self-center border-b-[1px] border-r-[1px] border-neutral-100 p-1 text-sm last:border-b-0 last:border-r-0 lg:h-[calc(100vh_/_7)] cursor-pointer overflow-hidden ${cellStyle}`;

  const Content = (
    <div className={wrapperClasses}>
      {day}

      <div className="flex justify-center py-2 sm:hidden lg:grid-cols-3 lg:gap-2">
        {rides && rides.length > 0 && (
          <RoundBadge
            text={rides.length}
            style={getBadgeStyle(past, hasUnreadyRides)}
          />
        )}
      </div>

      <div className="invisible sm:visible flex flex-wrap gap-1">
        {rides &&
          rides.map((ride) => (
            <div key={ride.id} className="truncate">
              {isReady(ride) ? (
                <Badge
                  text={formatRideBadge(ride)}
                  style={getBadgeStyle(past, false)}
                  small
                />
              ) : (
                <Badge
                  text={formatRideBadge(ride)}
                  style={getBadgeStyle(past, true)}
                  small
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );

  // Disable link for 'outside' days
  return <Link href={`/ride/planner/${date}`}>{Content}</Link>;
};

export const OutsideDay = (props: Props) => (
  <Day
    {...props}
    classes="lg:text-md h-[calc((100vh_-_48px)_/_6)]  w-full justify-self-center bg-neutral-50 p-1 text-sm text-neutral-400 lg:h-[calc(100vh_/_7)] cursor-pointer"
    past
  />
);
