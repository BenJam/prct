import { Cancelled } from "../Cancelled";
import { Ride, User } from "../../types";
import { makeClickableUrl } from "../../../shared/utils";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
    {children}
  </div>
);

type Props = {
  ride: Ride;
};

export const RideInfo = ({ ride }: Props) => {
  const {
    name,
    group,
    time,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    speed,
    notes,
    cancelled,
    users,
  } = ride;

  const riderNotes = users
    ?.filter((u: User) => u.rideNotes)
    .map(({ name: riderName, rideNotes }) => ({ name: riderName, rideNotes }));

  return (
    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="relative flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            {time}
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            {name}
          </div>
        </Row>
        {group && (
          <Row>
            <div>Group</div>
            <div className="min-w-0">{group}</div>
          </Row>
        )}
        {meetPoint && (
          <Row>
            <div>Meet at</div>
            <div className="min-w-0">{meetPoint}</div>
          </Row>
        )}
        {destination && (
          <Row>
            <div>Destination</div>
            <div className="min-w-0">{destination}</div>
          </Row>
        )}
        {distance && (
          <Row>
            <div>Distance</div>
            <div>{distance}</div>
          </Row>
        )}
        {speed && (
          <Row>
            <div>Average Speed</div>
            <div>{speed}/h (est)</div>
          </Row>
        )}
        {leader && (
          <Row>
            <div>Leader</div>
            <div>{leader}</div>
          </Row>
        )}
        {route && (
          <Row>
            <a
              className="col-span-2 text-primary underline hover:text-primary-focus"
              href={route}
              target="_blank"
              rel="noreferrer"
            >
              Click to see route
            </a>
          </Row>
        )}
        <Cancelled cancelled={cancelled || false} position="bottom" />
      </div>

      {notes && (
        <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
          <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
            Notes
          </div>
          <Row>
            <div
              className="col-span-2 whitespace-pre-line"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: makeClickableUrl(notes) }}
            />
          </Row>
        </div>
      )}

      {(riderNotes || []).length > 0 && (
        <div className="flex w-full flex-col rounded bg-white py-2 shadow-md divide-y divide-neutral-100">
          <div className="px-2 pb-2 text-xl font-bold tracking-wide text-neutral-700">
            Messages
          </div>
          {riderNotes?.map((rider) => (
            <Row key={rider.name}>
              <div className="truncate">{rider.name}</div>
              <div className="whitespace-pre-line">{rider.rideNotes}</div>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};
