import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Error from "next/error";
import { getServerSession } from "next-auth";
import { authOptions } from "@api/auth/[...nextauth]";
import { useRouter } from "next/router";
import Link from "next/link";
import { env } from "../../../env/client.mjs";
import { useRides } from "../../../hooks";
import {
  BackButton,
  Button,
  RideGroup,
  RideGroupSkeleton,
  PlusIcon,
} from "../../../components";
import {
  groupRides,
  formatDate,
  flattenQuery,
  getNow,
  serialiseUser,
} from "../../../../shared/utils";

const { NEXT_PUBLIC_CLUB_SHORT_NAME, NEXT_PUBLIC_CLUB_LONG_NAME } = env;

type Props = {
  isLeader: boolean;
};

const Rides: NextPage<Props> = ({ isLeader }: Props) => {
  const router = useRouter();
  const {
    query: { date },
  } = router;
  const dateString = `${flattenQuery(date)}T01:00:00.000Z`;
  const isInFuture = dateString > getNow();

  // Fetch rides for given date
  const { data, loading, error } = useRides(date, date);

  // Skeleton while loading
  if (loading) {
    return (
      <>
        <Head>
          <title>
            {NEXT_PUBLIC_CLUB_SHORT_NAME} Rides on {date}
          </title>
          <meta
            name="description"
            content={`${NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`}
          />
        </Head>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <RideGroupSkeleton
            numberOfCards={5}
            dateText={formatDate(dateString)}
          />
        </div>
      </>
    );
  }

  if (error) {
    return <Error statusCode={500} />;
  }

  // Get user id from session
  const groupedRides = groupRides(data);
  const ridesFound = groupedRides.length > 0;

  return (
    <>
      <Head>
        <title>
          {NEXT_PUBLIC_CLUB_SHORT_NAME} Rides on {date}
        </title>
        <meta
          name="description"
          content={`${NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`}
        />
      </Head>

      <div className="flex w-full flex-col gap-2 md:gap-4">
        <div className="m-2 sm:mx-0 flex h-10 flex-row justify-between gap-4">
          <BackButton />
          {isLeader && isInFuture && (
            <Link href={`/ride/new?date=${date}`}>
              <Button accent>
                <PlusIcon className="fill-white" />
                <span>&nbsp;Add Ride</span>
              </Button>
            </Link>
          )}
        </div>

        {ridesFound ? (
          <>
            {groupedRides.map((group) => (
              <RideGroup key={Object.keys(group)[0]} group={group} />
            ))}
          </>
        ) : (
          <>
            <div className="flex w-full justify-center bg-primary p-2 font-bold uppercase tracking-widest text-white">
              <div>{formatDate(dateString)}</div>
            </div>
            <div className="flex h-32 w-full items-center justify-center text-4xl">
              No planned rides
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Rides;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore session user complains
  const user = serialiseUser(session?.user);
  const role = user?.role as string;
  const isLeader = ["LEADER", "ADMIN"].includes(role);

  return {
    props: {
      isLeader,
    },
  };
};
