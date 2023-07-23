# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.20.3] - TBD

### Added

- Added RepeatingRide table, to hold scheduled ride templates
- Added optional scheduleId column to Rides, to denote that they are instances of a repeating ride

## [1.20.2] - 2023-07-05

### Changed

- After changing a user record, Admin returns to 'All Users' page
- Changing a user record invalidates the user cache
- Updated form styles
- Bumped dependencies

## [1.20.1] - 2023-06-29

### Changed

- Updated user card styles in user management screen

## [1.20.0] - 2023-06-27

### Added

- Manage users list view and api (ADMIN roles only)
- Update user form and api (ADMIN roles only)

## [1.19.0] - 2023-06-26

Paceline rides are getting oversubscribed. This release adds rider limits on rides.

### Added

- Added limit (int) column to Ride table
- Added limit select to ride form
- Added alert to ride details page to show when ride is full; Join button is removed, but a signed-up rider can still leave
- Added limit of 8 riders to Paceline config (for ride generation)
- Show count/limit when there is a limit applied (card and details views)

## [1.18.0] - 2023-06-21

It's the Longest Day, so to celebrate the Rides app is becoming easier for clubs to customise and host their own version.

### Added

- Club colours can be set in a theme file
- Supports environmental variables for club name, host url and repo
- Added customisation docs

## [1.17.0] - 2023-06-12

### Changed

- Archived anonymous users from database
- Removed anonymous user features
- Allow leaders to delete a ride on the same day

## [1.16.2] - 2023-05-29

### Changed

- Spread ride title across full width of card before truncating, when user is not going (i.e. don't always make space for the GOING badge)
- Right align ride count in card
- Rounded headers in viewports larger than mobile

## [1.16.1] - 2023-05-28

### Changed

- Added Espresso #2 Sunday Ride Group

### Fixed

- When copying a ride, set the new ride time to the same as the copied one.

## [1.16.0] - 2023-05-22

### Added

- Automatically archive previous rides on first day of each month.

### Changed

- Added Fast Sunday Ride Group
- Changed Capuccino to Social Sunday Ride group

## [1.15.4] - 2023-05-08

### Changed

- Updated latest dependencies, including NextJS 13.4

### Fixed

- Font is correct in dialogs again (confirm and messages)

## [1.15.3] - 2023-04-30

### Changed

- Added next/font management
- Changed core (Google) font from Prompt to Outfit; a variable font
- Increased base font size in all pages

## [1.15.2] - 2023-04-26

### Changed

- Reverted to original Prisma query for rides

## [1.15.1] - 2023-04-25

### Changed

- Added Prisma experimental feature to speed up database queries and reduce cold start times.

## [1.15.0] - 2023-04-17

### Changed

- Changed method for fetching session info about current user; much faster performance for pages with forms.
- Changed session to server side in main rides and ride details pages
- Unified user menu for all users; login button is now inside menu. Removes jank when loading

### Fixed

- Calendar no longer displays Add Ride button unless you are a leader

## [1.14.6] - 2023-04-16

### Changed

- Added indexes to User and Session tables with the aim of improving auth query performance.

## [1.14.5] - 2023-04-04

### Changed

- Separated saturday social rides into short and long config files, to account for differnet start times

## [1.14.4] - 2023-03-31

### Changed

- Create schema for archived rides tables
- Add queries to archive rides before date and with no riders

### Fixed

- Set default preferences (kms) for anonymouse users on rides page

## [1.14.3] - 2023-03-31

### Changed

- Using optimised query for rides (main landing) page
- Added `getUser` auth helper to api
- Updated type for Ride
- Added borders and truncation to rider messages section

## [1.14.2] - 2023-03-30

### Changed

- Using optimised query for profile page

## [1.14.1] - 2023-03-29

### Changed

- Added config for new database connection and query library.
- Updated dependencies.

## [1.14.0] - 2023-03-27

### Added

- Added `riderhq` api route, to fetch and sanitise a list of club members.
- Write members to a new database table (Membership)

## [1.13.3] - 2023-03-22

### Changed

- Changed "Mystery Ride" to "Long Americano" in Sunday Ride configuration.

## [1.13.2] - 2023-03-17

### Changed

- Changed styling of Cancellation banner to have better contrast (for accessibility) and warning emojis.

## [1.13.1] - 2023-03-14

### Changed

- Refactored user menu, adding a new `MenuEntry` component

## [1.13.0] - 2023-03-12

### Added

- Leaders can cancel rides, which appear with a banner. This action cannot be undone.
- Riders cannot join, leave or add messages to cancelled rides

## [1.12.0] - 2023-03-11

### Added

- Show urls as live, clickable links in Notes section of ride

### Changed

- Updated Sunday Ride notes section to direct users to BCC website, for consistency.

## [1.11.0] - 2023-03-10

### Added

- Removed fontawesome as a dependency script
- Changed all icons for local SVG versions
- Changed all badges for DaisyUI version
- Improved layout of rides in large version of calendar

## [1.10.0] - 2023-03-09

### Added

- Added DaisyUI styling with custom theme
- Changed all button components

## [1.9.1] - 2023-03-08

### Changed

- Updated dependencies

## [1.9.0] - 2023-03-01

### Changed

- Made calendar taller for screens that allow

## [1.8.0] - 2023-02-27

### Changed

- Upgraded dependencies for NextJS (major version 13)
- Changed session schema to include user object
- Added indexes to join tables in Prisma
- Removed privacy template page

## [1.7.2] - 2023-02-27

### Fixed

- Change Sunday rides winter end date to end of February.

## [1.7.0] - 2022-12-28

### Changed

- Allow riders to join or leave a ride up to 12 hours after it has started.

## [1.6.1] - 2022-11-29

### Changed

- Updated default leaders and notes for Sunday and Wednesday rides.

## [1.6.0] - 2022-11-23

### Added

- Added menu entry to copy ride link

## [1.5.0] - 2022-11-20

### Added

- Added Progressive Web APp (PWA) support, for offline use
- Animate changes to ride cards when applying filters

## [1.4.0] - 2022-11-19

### Added

- "Forever" option in weeks ahead filter, which fetches all future rides in the system
- Added link to release notes

### Changed

- Rider "Notes" are now "Messages"

## [1.3.0] - 2022-11-18

### Added

- Adds a filter feature to main rides page. Rides can be filters by rides a user has joined and by a query match on ride name, group, destination or leader.
- User can change look ahead from 2 to 8 weeks
- settings are saved between visits

## [1.2.0] - 2022-11-17

### Added

- Adds an `/embed` route which strips out header and any user interaction (join, etc.). Intended for use as a read-only view of rides.

## [1.1.1] - 2022-11-14

### Added

- Clear localStorage if user signs in. Removes conflict with anonymous users

## [1.1.0] - 2022-11-14

Adds the first user preference in Settings menu; units in km or miles.

### Added

- Add default preferences (km) in constants and section in settings form
- Convert and display all distances in correct units
- Convert all submitted rides to use kms

### Changed

- Profile menu renamed to 'Settings'
- Change update API and hook to include preferences

## [1.0.0] - 2022-11-14

This is the first release of the rides app with essential features.

### Added

- SQL queries folder; some initial reports

## Previous Versions

- [Version 0 change log](./CHANGELOG-v0.md)
