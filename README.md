# mentoring

This is the app behind the Mozilla Mentoring Program

## Structure

* [mentoring](./mentoring) - main Django project
  * [participants](mentoring/participants) - app handling participant data
  * [pairs](mentoring/pairs) - app handling pairing
  * [frontend](mentoring/frontend) - app to render the frontend
* [frontend](./frontend) - main React project

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to develop and contribute to this app.

# Running In Production

## Docker Image

This repository contains a Dockerfile which will generate a Docker image that can run this service.
The details of the frontend are completely handled within the Docker image, so only the Django application needs to be considered.
Commands given to the docker image are passed to `manage.py`, so for example `docker run <image> migrate` will run the Django DB migrations.

## Configuration

Like any 12-factor app, the docker image takes its configuration as environment variables.

### Database

This application requires a backend database.
In development, it automatically uses a SQLite database, and in production it expects a Postgres database.
Pass a URL for that database, of the form `postgres://USER:PASSWORD@HOST:PORT/NAME`, in environment variable `DATABASE_URL`.

### Secrets

The following environment variables should be set to suitably random strings used to protect data via one-way hashes:

* `DJANGO_PAIR_ID_HASH_SECRET`
* `DJANGO_SECRET_KEY`

### Allowed Hosts

Set `DJANGO_ALLOWED_HOSTS` to the hostname on which this application will be served.

### Authentication

In production, this app uses Mozilla's SSO for authentication.
It requires an Auth0 client be created, with
 * Algorithm `RS256`
 * Redirect URI of `https://<hostname>/oidc/callback/` (note the trailing `/`)
 * At least the Mozilla AD connection enabled ("Allowing Mozilla LDAP with MFA")

Set `DJANGO_OIDC_RP_CLIENT_ID` `DJANGO_OIDC_RP_CLIENT_SECRET` using the resulting credentials.
Set `DJANGO_OIDC_AUTHENTICATION_CALLBACK_URL` to `https://<hostname>/oidc/callback` where `<hostname>` is the hostname on which the site appears.

The UI automatically redirects to the sign-in URL.
There is no way to interact with the UI without first signing in.
Signing in creates a Django user and remaining authentication is performed using a Django session.

Members of People API groups listed in `DJANGO_STAFF_GROUPS` (comma-separated) have "staff" access to the app.
This grants access to the REST API (`/api`) for pairing and other committee- activities.
This should be set to a group containing the Mentoring committee members, e.g., `mozilliansorg_mentoring-committee`.

The `DJANGO_ADMIN_GROUPS` setting controls admin access, which includes staff permissions as well as access to the Django administration panel (`/admin/`).
This should be given to the subset of the committee that might need to make ad-hoc modifications to the database, and be capable of doing so safely

Those who are not staff or admins have access only to the enrollment form.

# Deploy to Production

Deploying to production can be done by creating a new "Release" in GitHub from [here](https://github.com/mozilla/mentoring/releases) and tagging it with a semversion tag, for example `0.1.2`.

Behind the scenes the new Release will trigger [this](https://github.com/mozilla/mentoring/tree/main/.github/workflows/docker.yaml) Github CI job. The job builds and pushes a Docker container based on [this Dockerfile](https://github.com/mozilla/mentoring/tree/main/Dockerfile) into a private ECR repo.
Running alongside this application there's a service watching the ECR repository, and deploying any new container tagged with a semversion.
