# How to Contribute

We welcome pull requests from everyone. We do expect everyone to adhere to the [Mozilla Community Participation Guidelines][https://www.mozilla.org/en-US/about/governance/policies/participation/].

## Setup

> _NOTE:_ this is still incomplete; help is appreciated!  See https://github.com/mozilla/mentoring/issues/36.

This application is composed of two parts: a Django backend (`mentoring/`) and a React frontend (`frontend/`).

### Frontend

To set up the frontend for development, you will need the latest LTS Node installed.
With that, ensure you have [yarn installed](https://classic.yarnpkg.com/en/docs/install/).
Then, in the `frontend` directory, run

```shell
yarn install
```

to install the dependencies.

To build the frontend and prepare it for use in a browser, run

```shell
yarn dev
```

If you are planning to change the backend, this is all you need to do in the `frontend/` directory.

If you are making changes on the frontend, you can automatically rebuild every time a file changes with

```shell
yarn dev --watch
```

To actually load the frontend in the browser, you'll need to run the backend server, as described in the next section.

### Backend

The backend is a normal Django app, so those familiar with Django should have no difficulty.
Those unfamiliar can find some background information [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment).

You will need Python installed, at least version 3.6.
Set up a virtualenv, and install the required packages:

```shell
python3 -mvenv sandbox
sandbox/bin/pip install -r requirements.txt
```

You will need to set the following environment variables:

 * `OIDC_RP_CLIENT_ID` (see README)
 * `OIDC_RP_CLIENT_SECRET`
 * `SECRET_KEY` (a long random value used for session hashing)
 * `PAIR_ID_HASH_SECRET` (a long random value used for hashing historical pairs)

This will automatically configure a local database.
To set the proper tables up in that database, run
```
sandbox/bin/python manage.py migrate
```

To run the server, use 
```shell
sandbox/bin/python manage.py runserver
```

The result will show a message like
```
Starting development server at http://127.0.0.1:8000/
```

and you can access the server at that URL.

> _NOTE:_ this isn't true, as settings.py requires HTTPS.  A tunnel service like `ngrok.io` can supply that, but not for free.

When you return to the project on another day, you need only set up the environment variables again and invoke the `runserver` command.
