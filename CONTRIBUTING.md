# How to Contribute

We welcome pull requests from everyone. We do expect everyone to adhere to the [Mozilla Community Participation Guidelines][https://www.mozilla.org/en-US/about/governance/policies/participation/].

## Setup

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
You may need to repeat the last step (`yarn dev`) if you update your working copy to include changes made by others to the frontend.

If you are making changes on the frontend, you can automatically rebuild every time a file changes with

```shell
yarn dev --watch
```

To run the tests,
```shell
yarn test
```

To actually load the frontend in the browser, you'll need to run the backend server, as described in the next section.

### Backend

The backend is a normal Django app, so those familiar with Django should have no difficulty setting it up.
Those unfamiliar can find some background information [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment).

You will need Python installed, at least version 3.6.
Set up a virtualenv, and install the required packages:

```shell
python3 -mvenv sandbox
sandbox/bin/pip install -r requirements.txt
```

The backend defaults to a development configuration, with a local database and local users.
You'll need to set up that database and create a user.

```shell
python3 manage.py migrate
```

```shell
python3 manage.py createsuperuser
Username: yourname
Email address: (any email address)
Password: 
Password (again): 
Superuser created successfully.
```

Finally, run the server:
```shell
sandbox/bin/python manage.py runserver
```

The result will show a message like
```
Starting development server at http://127.0.0.1:8000/
```

and you can access the server at that URL.
Sign in as the new superuser you have created.
From there, you can create a new non-superuser via the DB admin page, if you would like.

To run the backend tests,
```shell
python3 manage.py test
```

When you return to the project on another day, you need only invoke the `runserver` command.
As you update your working copy to include database changes made by others, you may need to run the `migrate` command again as well.
