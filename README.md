# mentoring

This is the app behind the Mozilla Mentoring Program

## Structure

* [mentoring](./mentoring) - main Django project
  * [enrollment](mentoring/enrollment) - app handling participant enrollment
  * [participants](mentoring/participants) - app handling participant data
  * [pairs](mentoring/pairs) - app handling pairing
  * [frontend](mentoring/frontend) - app to render the frontend
* [frontend](./frontend) - main React project

## Authentication

This app uses Mozilla's SSO for authentication.
It requires an Auth0 client be created, with
 * Algorithm `RS256`
 * Redirect URI of `https://<hostname>/oidc/callback/` (note the trailing `/`)
 * At least the Mozilla AD connection enabled ("Allowing Mozilla LDAP with MFA")

Set `OIDC_RP_CLIENT_ID` `OIDC_RP_CLIENT_SECRET` using the resulting credentials.

The UI automatically redirects to the sign-in URL.
There is no way to interact with the UI without first signing in.
Signing in creates a Django user and remaining authentication is performed using a Django session.

Members of groups listed in `STAFF_GROUPS` have "staff" access to the app.
This includes access to the REST API (`/api`) and the Django administration panel (`/admin/`).
Those who are not staff have access only to the enrollment form.

## Development

(incomplete)

### Full Server

This is a normal Django app.  To run the server, use `python manage.py runserver`.
You will need to set the following environment variables first:
 * `OIDC_RP_CLIENT_ID`
 * `OIDC_RP_CLIENT_SECRET`
 * `SECRET_KEY` (a long random value used for session hashing)
 * `PAIR_ID_HASH_SECRET` (a long random value used for hashing historical pairs)
