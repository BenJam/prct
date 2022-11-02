import Link from "next/link";
import { Button } from "./Button";
import { BackButton } from "./Button/BackButton";
import { JoinButton } from "./Button/JoinButton";
import { Badge } from "./Badge";
import { useLocalStorage } from "../hooks";
import { User, Ride, AnonymousUser } from "../types";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4">
    {children}
  </div>
);

const Heading = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-center bg-blue-900 p-2 font-bold uppercase tracking-wide text-white sm:rounded">
    {children}
  </div>
);

type Props = {
  ride: Ride;
  user?: User;
  role?: string;
};

export const RideDetails = ({ ride, user, role }: Props) => {
  const [anonRider] = useLocalStorage<AnonymousUser>("bcc-user", {});
  const {
    id,
    name,
    group,
    day,
    time,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    speed,
    notes,
    users,
  } = ride;

  const hasRiders = users && users?.length > 0;
  const isGoingAnonymously =
    anonRider?.id && users?.map((u: User) => u.id).includes(anonRider?.id);
  const isGoing =
    users && user ? users?.map((u: User) => u.id).includes(user?.id) : false;
  const isLeader = ["ADMIN", "LEADER"].includes(role || "");

  return (
    <div className="flex w-full flex-col gap-2">
      <Heading>
        <div>{day}</div>
      </Heading>

      <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
        <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
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
              <div>{group}</div>
            </Row>
          )}
          {meetPoint && (
            <Row>
              <div>Meeting point</div>
              <div>{meetPoint}</div>
            </Row>
          )}
          {destination && (
            <Row>
              <div>Destination</div>
              <div>{destination}</div>
            </Row>
          )}
          {distance && (
            <Row>
              <div>Distance</div>
              <div>{distance} km</div>
            </Row>
          )}
          {speed && (
            <Row>
              <div>Average Speed</div>
              <div>{speed} km/h (est)</div>
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
                className="col-span-2 text-blue-700 underline hover:text-blue-800"
                href={route}
                target="_blank"
                rel="noreferrer"
              >
                Click to see route
              </a>
            </Row>
          )}
        </div>
        {notes && (
          <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
            <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
              Notes
            </div>
            <Row>
              <div className="col-span-2 whitespace-pre-line">{notes}</div>
            </Row>
          </div>
        )}
      </div>

      <Heading>
        <div className="flex items-center gap-4">
          Going
          <Badge text={users?.length} />
        </div>
      </Heading>

      <div className="flex w-full px-2 sm:px-0">
        {hasRiders && (
          <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
            {user ? (
              users?.map(
                ({ id: userId, name: userName, mobile, emergency }) => (
                  <div
                    className="flex w-full flex-row items-center justify-between px-2 font-medium md:grid md:grid-cols-[220px_1fr] md:justify-start md:gap-4"
                    key={userId}
                  >
                    <div>{userName}</div>
                    <div className="flex flex-col items-end md:flex-row md:justify-between">
                      <div className="flex items-center gap-2">
                        {mobile && <i className="fa-solid fa-phone" />}
                        <span>{mobile}</span>
                      </div>
                      {isLeader && (
                        <div className="flex items-center gap-2 text-red-700">
                          {emergency && <i className="fa-solid fa-phone" />}
                          <span>{emergency}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col gap-2 px-2">
                {isGoingAnonymously && (
                  <div className="text-red-700">You are going</div>
                )}
                <div>Please log in to see rider details</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex h-4 flex-row justify-between px-2 pt-8 sm:px-0">
        <BackButton />
        {user && (
          <JoinButton
            className="flex w-28 items-center justify-center rounded p-5"
            going={isGoing}
            ariaLabel={`Join ${name} ride`}
            rideId={id}
            userId={user?.id}
          />
        )}
        {!user && !isGoingAnonymously && (
          <Link href={`/ride/${id}/join`}>
            <div className="flex h-10">
              <Button variant="join">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-plus" />
                  Join
                </div>
              </Button>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
