import { useRouter } from "next/router";
import { signOut, signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useSWRConfig } from "swr";
import useOnClickOutside from "use-onclickoutside";
import copy from "copy-to-clipboard";
import { Confirm } from "../Confirm";
import { env } from "../../env/client.mjs";
import { deleteRide, cancelRide } from "../../hooks";
import {
  BarsIcon,
  CalendarIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  LinkIcon,
  LogoutIcon,
  LoginIcon,
  PlusIcon,
  SettingsIcon,
  CircleExclamationIcon,
  UsersIcon,
  RepeatIcon,
} from "../Icon";
import { MenuEntry } from "./MenuEntry";
import pkg from "../../../package.json";

const { NEXT_PUBLIC_REPO } = env;

type MenuProps = {
  role: string | null;
  rideId?: string | string[];
  isAuthenticated: boolean;
};

export const UserMenu = ({ role, rideId, isAuthenticated }: MenuProps) => {
  const ref = useRef(null);
  const [show, setShow] = useState<boolean>(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const isLeader = role && ["ADMIN", "LEADER"].includes(role);
  const isAdmin = role === "ADMIN";
  const showEditAndDelete = isLeader && rideId;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const toggleMenu = () => {
    setShow(!show);
    if (show) {
      setShowConfirmCancel(false);
      setShowConfirmDelete(false);
    }
  };

  const closeMenu = () => {
    setShow(false);
    setShowConfirmCancel(false);
    setShowConfirmDelete(false);
  };

  const copyLink = () => copy(window.location.href);

  const handleSignout = () => {
    signOut({ callbackUrl: "http://localhost:3000" });
    closeMenu();
  };

  const handleSignin = () => {
    signIn("auth0");
    closeMenu();
  };

  const handleCancel = async (cb: (flag: boolean) => void) => {
    if (rideId) {
      mutate("/api/ride", async () => {
        const results = await cancelRide(rideId);
        if (results.id) {
          closeMenu();
          router.back();
          cb(true);
        } else {
          cb(false);
        }
      });
    } else {
      cb(false);
    }
  };

  const handleDelete = async (cb: (flag: boolean) => void) => {
    if (rideId) {
      mutate("/api/ride", async () => {
        const results = await deleteRide(rideId);
        if (results.id) {
          closeMenu();
          router.back();
          cb(true);
        } else {
          cb(false);
        }
      });
    } else {
      cb(false);
    }
  };
  const confirmCancel = () => setShowConfirmCancel(true);
  const confirmDelete = () => setShowConfirmDelete(true);

  useOnClickOutside(ref, closeMenu);

  return (
    <div ref={ref} className="relative">
      <div className="h-10 cursor-pointer rounded p-1 text-3xl">
        <button
          type="button"
          aria-label="Menu"
          onClick={toggleMenu}
          onKeyDown={toggleMenu}
        >
          <BarsIcon className="fill-white w-6 h-6" />
        </button>
      </div>

      {show && (
        <div className="absolute right-0 top-12 grid w-48 grid-cols-1 rounded bg-white text-neutral-700 shadow-xl">
          {!isAuthenticated && (
            <MenuEntry label="Log in" onClick={handleSignin}>
              <LoginIcon className="fill-neutral-700" />
            </MenuEntry>
          )}

          <MenuEntry label="Calendar" href="/ride/planner" onClick={closeMenu}>
            <CalendarIcon className="fill-neutral-700" />
          </MenuEntry>

          {isLeader && (
            <MenuEntry label="Add Ride" href="/ride/new" onClick={closeMenu}>
              <PlusIcon className="fill-neutral-700" />
            </MenuEntry>
          )}

          {isLeader && rideId && (
            <MenuEntry
              label="Copy Ride"
              href={`/ride/${rideId}/copy`}
              onClick={closeMenu}
            >
              <CopyIcon className="fill-neutral-700" />
            </MenuEntry>
          )}

          {showEditAndDelete && (
            <>
              <MenuEntry
                label="Edit Ride"
                href={`/ride/${rideId}/edit`}
                onClick={closeMenu}
              >
                <EditIcon className="fill-neutral-700" />
              </MenuEntry>
              <MenuEntry label="Cancel Ride" onClick={confirmCancel}>
                <CircleExclamationIcon className="fill-neutral-700" />
              </MenuEntry>
              <MenuEntry label="Delete Ride" onClick={confirmDelete}>
                <DeleteIcon className="fill-neutral-700" />
              </MenuEntry>
              <MenuEntry label="Copy Ride Link" onClick={copyLink}>
                <LinkIcon className="fill-neutral-700" />
              </MenuEntry>
            </>
          )}

          {isAdmin && (
            <>
              <MenuEntry label="Manage Users" href="/users" onClick={closeMenu}>
                <UsersIcon className="fill-neutral-700" />
              </MenuEntry>
              <MenuEntry
                label="Repeating Rides"
                href="/repeating-rides"
                onClick={closeMenu}
              >
                <RepeatIcon className="fill-neutral-700" />
              </MenuEntry>
            </>
          )}
          {isAuthenticated && (
            <>
              <MenuEntry label="Settings" href="/profile" onClick={closeMenu}>
                <SettingsIcon className="fill-neutral-700" />
              </MenuEntry>
              <MenuEntry label="Log out" onClick={handleSignout}>
                <LogoutIcon className="fill-neutral-700" />
              </MenuEntry>
            </>
          )}

          <div className="flex h-6 items-center justify-between px-2 pl-2 text-xs text-neutral-400">
            Version {pkg.version}
            <a
              href={`${NEXT_PUBLIC_REPO}/blob/main/CHANGELOG.md`}
              title="Release notes"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary underline"
            >
              Notes
            </a>
          </div>
        </div>
      )}

      <Confirm
        open={showConfirmCancel}
        closeHandler={closeMenu}
        heading="Are you sure you want to CANCEL this ride?  You cannot undo this action."
        onYes={(callback) => handleCancel(callback)}
      />

      <Confirm
        open={showConfirmDelete}
        closeHandler={closeMenu}
        heading="Are you sure you want to delete this ride?"
        onYes={(callback) => handleDelete(callback)}
      />
    </div>
  );
};
