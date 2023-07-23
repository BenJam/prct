/* eslint-disable no-alert */
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "@api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { getRepeatingRide } from "@api/repeating-ride";
import { RepeatingRide } from "src/types";
import { BackButton, Button } from "@components/Button";
import { useState } from "react";
import { Confirm } from "@components/Confirm";
import { deleteRepeatingRide } from "src/hooks";
import {
  formatDate,
  formatTime,
  makeClickableUrl,
  serialiseUser,
} from "../../../../shared/utils";

type Props = {
  data: RepeatingRide;
};

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
    {children}
  </div>
);

const RepeatingRideDetails: NextPage<Props> = ({ data }: Props) => {
  const [showConfirmDelete, setShowDelete] = useState<boolean>(false);
  const [deleteAllRides, setDeleteAllRides] = useState<boolean>(true);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    id,
    name,
    group,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    speed,
    notes,
    limit,
    startDate,
    winterStartTime,
    endDate,
    textRule,
  } = data;
  const time = formatTime(startDate);

  const goToCopy = () => router.push(`./${id}/copy`);

  const toggleDeleteAllRides = () => setDeleteAllRides(!deleteAllRides);

  const handleDelete = async (cb: (flag: boolean) => void) => {
    if (id) {
      mutate("/api/ride", async () => {
        const results = await deleteRepeatingRide(id, deleteAllRides);

        if (results.id) {
          router.back();
          setShowDelete(false);
          cb(true);
        } else {
          cb(false);
        }
      });
    } else {
      cb(false);
    }
  };

  const showConfirm = () => setShowDelete(true);
  const hideConfirm = () => setShowDelete(false);

  return (
    <>
      <Head>
        <title>Repeating Ride Details</title>
        <meta
          name="description"
          content="Bath Cycling Club - Repeating Ride Details"
        />
      </Head>

      <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded mb-2">
        Repeating Ride Details
      </div>

      <div className="flex w-full flex-col gap-2 px-2 sm:px-0 mb-4">
        <div className="relative flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
          <Row>
            <div>Name</div>
            <div className="text-xl font-bold tracking-wide text-neutral-700 truncate">
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
          {limit && limit > -1 && (
            <Row>
              <div>Limit</div>
              <div>{limit}</div>
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

        <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
          <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
            Schedule
          </div>
          {textRule && (
            <Row>
              <div className="col-span-2 whitespace-pre-line">
                &quot;{textRule}&quot;
              </div>
            </Row>
          )}
          <Row>
            <div>Start time</div>
            <div>{time}</div>
          </Row>
          <Row>
            <div>Winter</div>
            <div>{winterStartTime}</div>
          </Row>
          <Row>
            <div>Next run</div>
            <div>{formatDate(startDate)}</div>
          </Row>
          {endDate && (
            <Row>
              <div>End date</div>
              <div>{formatDate(endDate)}</div>
            </Row>
          )}
        </div>
      </div>

      <div className="flex justify-between sm:justify-start w-full gap-4 px-2 sm:p-0">
        <BackButton />
        <Button accent onClick={goToCopy}>
          Copy
        </Button>
        <Button error onClick={showConfirm}>
          Delete
        </Button>
      </div>

      <Confirm
        open={showConfirmDelete}
        closeHandler={hideConfirm}
        heading="Are you sure you want to delete this repeating ride?"
        onYes={(callback) => handleDelete(callback)}
      >
        <div>
          <div className="form-control">
            <label htmlFor="cascade" className="label cursor-pointer">
              <span className="label-text">
                Also delete or cancel every future ride created from this
                schedule
              </span>
              <input
                id="cascade"
                type="radio"
                name="radio-cascade"
                checked={deleteAllRides}
                onChange={toggleDeleteAllRides}
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="no-cascade" className="label cursor-pointer">
              <span className="label-text">
                Only delete the schedule and keep all of the rides
              </span>
              <input
                id="no-cascade"
                type="radio"
                name="radio-cascade"
                checked={!deleteAllRides}
                onChange={toggleDeleteAllRides}
              />
            </label>
          </div>
        </div>
      </Confirm>
    </>
  );
};

export default RepeatingRideDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore session user complains
  const user = serialiseUser(session?.user);
  const role = user?.role;
  const isAuthorised = !!session && role === "ADMIN";

  if (!isAuthorised) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { query } = context;
  const data = await getRepeatingRide(query.id);

  if (!data) {
    return {
      redirect: {
        destination: "/repeating-rides",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};
