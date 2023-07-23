# Customising the App

This app uses Open Source code, which can be freely forked, and online hosting services, which, at the time of writing, allow very generous free tiers. It should be possible to operate this app for a cycling club at no cost.

Setting up your own copy does require some software skills. Reach out to [Mark Fairhurst](mailto:mark@fairhursts.net) if you need assistance.

The following third-party services are necessary to host and run the app:

| Service                                 | Description                | Free Tier                                                                                                             |
| --------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [PlanetScale](https://planetscale.com/) | A scalable MySQL database  | 1 free database with:<br/>Row writes: 10 million per month<br />Row reads: 1 billion rows per month<br />Storage: 5GB |
| [Auth0](https://auth0.com)              | User authentication        | 7,000 user accounts                                                                                                   |
| [Vercel](https://vercel.com/)           | NextJS application hosting | Effectively unlimited for this app                                                                                    |

## Setting up services

The following steps outline the process. You will need to read up on using each service in detail to carry out these steps.

### Code

Fork this repo to your own GitHub account. The app is written in TypeScript and uses NextJS with React to build all of the pages and apis.

### Auth0

Sign up for a free Auth0 account and create a new Auth0 app with your club logo and `http://localhost:3000` as the allowed login, logout, callback (~/api/auth/callback/auth0, ~/api/auth/signin) and origins URLs.

Style the login page with your club colours if desired. Copy the generated Client ID and Secret and add them to a `.env` file in code. (You will also need to set them in Vercel later).

```bash
AUTH0_ISSUER={YOUR_AUTH0_APP_URL}
AUTH0_ISSUER_BASE_URL={YOUR_AUTH0_APP_URL}
AUTH0_SECRET={MAKE_A_STRONG_SECRET}
AUTH0_BASE_URL=http://localhost:3000
AUTH0_CLIENT_ID={GENERATED_IN_AUTH0_DASHBOARD}
AUTH0_CLIENT_SECRET={GENERATED_IN_AUTH0_DASHBOARD}
```

Note that URLs need to be full https:// urls.

### PlanetScale

Create a free account and in it, your rides database (called bcc-rides). Copy the database connection url and credentials:

```bash
# Prisma
DATABASE_URL='mysql://{GENERATED_IN_PLANETSCALE_DASHBOARD}:{GENERATED_IN_PLANETSCALE_DASHBOARD}@aws.connect.psdb.cloud/bcc-rides?sslaccept=strict'

# PlanetScale database http connection
DATABASE_HOST={GENERATED_IN_PLANETSCALE_DASHBOARD}
DATABASE_USERNAME={GENERATED_IN_PLANETSCALE_DASHBOARD}
DATABASE_PASSWORD={GENERATED_IN_PLANETSCALE_DASHBOARD}
```

Follow the instructions on the PlanetScale site for installing the [pscale CLI tool](https://planetscale.com/features/cli), which you will need to connect to your database for development. Although you can use SQLite for development, PlanetScale will only allow schema changes and deploys to a non-production database branch, once you are in production mode. You must then use their UI to deploy to the main branch.

Once the database tables are created and seeded (see later) you can optionally connect a GUI tool for management.

### Vercel

_(Note: Park this step until the app is working in development first)._

Create a project for this app and connect it to your GitHub account, to track your forked copy of this repo. Each push to Github will result in a build and deploy attempt. The production domain reflects your master branch; pushes to other branches will create preview instances.

You will need to set up environmental variables. Visit:

```bash
https://vercel.com/{github_id}/{project}/settings/environment-variables
```

..and add every variable listed in `.env.example`. It is safe to give all variables `Production` and `Preview` scope.

Once you have a production hosting URL from Vercel (you can optionally link it to a custom domain that you own), go back to Auth0 and add the production URLs in addition to the local URLs for the login, callback, origins, etc.

## Getting Started

The first step is to install dependencies. A post install task will generate types from the Prisma ORM schema.

```bash
yarn
```

Connect to your PlanetScale database and create the table schema.

```bash
yarn connect  # While you are NOT in production mode; otherwise yarn connect:dev

yarn pushdb

yarn seed # populate with some test rides
```

Launch the app locally.

```bash
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## Customising the app

The following aspects can be customised:

- [Club name, repo and url](#club-name)
- [Colours](#colours)
- [Logo](#logo)
- [Standard rides](#standard-rides), which you want to generate every month
- [Web manifest](#web-manifest)

### Club name

Set environmental variables in `.env` and in Vercel (see above) as follows:

```bash
NEXT_PUBLIC_CLUB_LONG_NAME='e.g. Bath Cycling Club'
NEXT_PUBLIC_CLUB_SHORT_NAME=BCC
NEXT_PUBLIC_REPO={YOUR_FORKED_REPO_URL}
HOST_URL={YOUR_VERCEL_URL}
```

### Colours

Open `src/themes/bath.cjs` in a code editor and make a copy, using your club name. Change colours as needed for:

- `primary` (main background and hyperlink colour)
- `primary-content` (text)
- `secondary` (button used in filter menu)
- `accent` (calendar nav buttons and message button in ride details)
- `base200|300` (historic and hover days in Calendar)
- `info|error|warning` (as expected; all red buttons use `error` colour)

Open `tailwind.config.js` and change the import on line 5 to reflect the filename that you used above:

```bash
const club = require("./src/themes/{your-filename}.cjs");
```

The app should reflect your scheme with hot reloading.

### Logo

Copy a logo file in SVG format to `public/staic/images` folder.

Modify the import on line 7 of `src/components/Header.tsx` to relfect your filename:

```javascript
import Logo from "../../public/static/images/bath-cc-logo.svg";
```

### Standard Rides

Probably the most involved task; the app runs a cron job on the first of every month at 1am and generates all rides for the following (+1) month. So your members should always have at least one month of rides ahead to book onto.

Rides are configured in `src/constants/rides` folder, with each file represnting a group or class of rides. Each ride can have the following fields:

```javascript
name: string;
destination?: string | null;
group?: string | null;
distance?: number | null;
meetPoint?: string | null;
route?: string | null;
leader?: string | null;
speed?: number | null;
notes?: string | null;
```

The file exports an array of rides, e.g. a "Saturday Paceline" collection might have several rides at different speeds. You can set different times for Summer and Winter (the date for that changeover is configured separately) and then set what you know about each ride: meeting point, typical distance, leader etc.

Once all rides are configured, you can test their generation by hitting the api endpoint, e.g.

```bash
curl --request POST -d '{"date":"2023-06-01"}' \
  --url 'http://localhost:3000/api/cron' \
  --header 'Authorization: Bearer {API_KEY}'
```

Having first set an API_KEY in `.env` and in Vercel, **and added it as a Github secret**, and where the date is in the current month. The api should generate all rides for the following month.

For the cron job to run in production, you must modify the github action. Open the file `.github/workflows/cron.yml` and change the url on line 22 to use your domain.

### Web manifest

Open `public/static/site.webmanifest` in your code editor and change values for `name` and `short_name`. These settings change the display name when saving the app shortcut to mobile phone home screens.
