/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { useState, useRef, Fragment, ChangeEvent, FormEvent } from "react";
import { Transition, Switch, Combobox } from "@headlessui/react";
import clsx from "clsx";
import useOnClickOutside from "use-onclickoutside";
import { useAtom } from "jotai";
import { useLocalStorage } from "../hooks";
import { filterQueryAtom } from "../store";
import { Button } from "./Button";
import { CloseIcon, ChevronDownIcon, TickIcon } from "./Icon";
import { FilterQuery } from "../types";

type Props = {
  isShowing: boolean;
  closeHandler: () => void;
  data: (string | null | undefined)[];
};

const DEFAULT_WEEKS = "2";

export const Filters = ({ isShowing, closeHandler, data }: Props) => {
  const ref = useRef(null);
  const [filters] = useLocalStorage<FilterQuery>("bcc-filters", {});
  const [onlyJoined, setOnlyJoined] = useState<boolean>(
    filters?.onlyJoined || false
  );
  const [search, setSearch] = useState<string>(filters?.q || "");
  const [weeksAhead, setWeeksAhead] = useState<string>(
    filters?.weeksAhead || DEFAULT_WEEKS
  );
  const [filterQuery, setFilterQuery] = useAtom(filterQueryAtom);
  const [, setFilters] = useLocalStorage<FilterQuery>("bcc-filters", {});

  const setFilterAtomAndStorage = (filter: FilterQuery) => {
    setFilterQuery(filter);
    setFilters(filter);
  };

  const handleSwitchChange = () => {
    setOnlyJoined(!onlyJoined);
    setFilterAtomAndStorage({
      ...filterQuery,
      onlyJoined: !filterQuery.onlyJoined,
    });
  };
  const switchClass = clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full",
    onlyJoined ? "bg-green-600" : "bg-gray-200"
  );
  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    onlyJoined ? "translate-x-6" : "translate-x-1"
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleWeeksChange = (e: FormEvent<HTMLSelectElement>) => {
    // @ts-ignore
    const val = e.target.value;
    setWeeksAhead(val);
    setFilterAtomAndStorage({ ...filterQuery, weeksAhead: val });
  };

  const handleSelected = (q: string) => {
    setFilterAtomAndStorage({ ...filterQuery, q });
    setSearch(q);
  };

  const reset = () => {
    setOnlyJoined(false);
    setSearch("");
    setWeeksAhead(DEFAULT_WEEKS);
    setFilterAtomAndStorage({ onlyJoined: false, weeksAhead: DEFAULT_WEEKS });
  };

  const filteredData =
    search === ""
      ? data
      : data.filter((item) =>
          (item || "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(search.toLowerCase().replace(/\s+/g, ""))
        );

  useOnClickOutside(ref, closeHandler);

  return (
    <Transition
      ref={ref}
      show={isShowing}
      enter="transition ease-in-out duration-200 transform"
      enterFrom="-translate-y-full"
      enterTo="-translate-y-0"
      leave="transition ease-in-out duration-200 transform"
      leaveFrom="-translate-y-0"
      leaveTo="-translate-y-full"
      className="fixed z-10 h-82 w-full bg-neutral-800 text-white shadow-xl top-0"
    >
      <div className="container mx-auto flex w-full flex-col p-4 md:px-4 lg:max-w-[1024px]">
        <div className="flex flex-row justify-between">
          <div className="text-3xl">Filters</div>
          <button
            type="button"
            onClick={closeHandler}
            title="Close filters"
            className="flex items-center rounded p-1 text-3xl"
          >
            <CloseIcon className="fill-white w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4 md:gap-8 mt-2">
          <Combobox value={search} onChange={handleSelected}>
            <div className="relative mt-1 z-20">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-700 focus:ring-0"
                  placeholder="Search ride details"
                  // @ts-ignore
                  displayValue={(item) => item}
                  onChange={handleSearchChange}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                  <ChevronDownIcon className="fill-neutral-700" />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {filteredData.length === 0 && search !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredData.map((person) => (
                      <Combobox.Option
                        key={person}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <TickIcon className="fill-white" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>

        <div className="mt-4 flex flex-row justify-between">
          <div>Only show my rides</div>
          <Switch
            checked={onlyJoined}
            onChange={handleSwitchChange}
            className={switchClass}
          >
            <span className="sr-only">Enable notifications</span>
            <span className={toggleClass} />
          </Switch>
        </div>

        <div className="mt-4 flex flex-row justify-between items-center">
          <div>Weeks ahead</div>
          <label htmlFor="weeks" className="flex flex-col gap-1 w-32">
            <select
              id="weeks"
              aria-label="Weeks ahead"
              className="rounded-md text-neutral-700"
              value={weeksAhead}
              onChange={handleWeeksChange}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="-1">Forever</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-row justify-end gap-4">
          <Button
            onClick={reset}
            title="Reset filters"
            className="flex items-center rounded p-1"
          >
            <span>Reset</span>
          </Button>
          <Button
            secondary
            onClick={closeHandler}
            title="Reset filters"
            className="flex items-center rounded p-1"
          >
            <span>Apply</span>
          </Button>
        </div>
      </div>
    </Transition>
  );
};
