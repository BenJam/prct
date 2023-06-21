import { useState } from "react";
import { Button, BackButton, JoinButton } from "../Button";
import { MessageIcon } from "../Icon";
import { Badge } from "../Badge";
import { User, Ride } from "../../types";
import { isJoinable } from "../../../shared/utils";
import { RideInfo } from "./RideInfo";
import { RidersGoing } from "./RidersGoing";
import { RideNotes } from "./RideNotes";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Heading = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
    {children}
  </div>
);

type Props = {
  ride: Ride;
  user?: User;
  role?: string;
  embedded?: boolean;
};

export const RideDetails = ({ ride, user, role, embedded }: Props) => {
  const [showNotesForm, setShowNotesForm] = useState<boolean>(false);
  const { id, name, date, day, cancelled, users } = ride;

  const hasRiders = users && users?.length > 0;
  const isGoing =
    users && user ? users?.map((u: User) => u.id).includes(user?.id) : false;
  const isLeader = ["ADMIN", "LEADER"].includes(role || "");
  const canJoin = isJoinable(date);
  const rideNotes =
    users && user && users?.find((u: User) => u.id === user.id)?.rideNotes;

  const openNotes = () => setShowNotesForm(true);
  const closeNotes = () => setShowNotesForm(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <Heading>
        <div>{day}</div>
      </Heading>

      <RideInfo ride={ride} />

      <Heading>
        <div className="flex items-center gap-4">
          Going
          <Badge text={users?.length} />
        </div>
      </Heading>

      {embedded ? (
        <div className="flex h-4 flex-row justify-between px-2 pt-2 sm:px-0">
          <BackButton url="/embed" />
        </div>
      ) : (
        <>
          <RidersGoing
            user={user}
            users={users}
            hasRiders={hasRiders}
            isLeader={isLeader}
          />

          <div className="flex h-4 flex-row justify-between px-2 pt-2 sm:px-0">
            <BackButton url={`/#${id}`} />

            {isGoing && !cancelled && (
              <Button accent onClick={openNotes}>
                <MessageIcon className="fill-white" />
                Message
              </Button>
            )}

            {user && canJoin && !cancelled && (
              <JoinButton
                going={isGoing}
                ariaLabel={`Join ${name} ride`}
                rideId={id}
                userId={user?.id}
              />
            )}
          </div>
        </>
      )}

      <RideNotes
        userId={user?.id}
        rideId={id}
        rideNotes={rideNotes}
        showNotesForm={showNotesForm}
        closeHandler={closeNotes}
      />
    </div>
  );
};
