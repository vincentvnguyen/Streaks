# Streaks# Building and Running
To build and run this project:

- Clone the repository
- `npm install`
- `npm run migrate`
 - This runs the database migrations necessary to initialize the database with the necessary tables.
- `npm run seed`
 - This inserts the first admin user into the database.
- `npm start` to run the local development server
 - Consider installing [nodemon](https://nodemon.io/) if you want the server to automatically restart itself when you make changes to the codebase

# Project structure
This project is structured in a pseudo-MVC way. The models in the `models` folder define objects which are stored in the database using [sequelize](http://docs.sequelizejs.com/). The views in the `views` folder are [Handlebars](https://handlebarsjs.com/) templates that are combined and rendered by the controllers in the `routes` folder to return pages to the frontend. The `public` folder stores public static assets like frontend javascript, CSS stylesheets, and images.

# API Endpoints
Document the relevant API endpoints here when they're ready.

## Sample streak schema structure
For reference, here's what the sample streak + history structure looks like when fully assembled:
```[
   {  
      "id":1,
      "name":"Mark CSC309 projects",
      "userId":1,
      "frequency":2,
      "period":"day",
      "totalSuccesses":8,
      "totalFailures":2,
      "startDate":"2018-11-29T17:44:10.000Z",
      "endDate":"2018-12-13T17:44:10.000Z",
      "createdAt":"2018-12-06T17:44:10.000Z",
      "updatedAt":"2018-12-06T17:44:10.000Z",
      "streakHistory":[  
         {  
            "id":2,
            "userId":1,
            "streakId":1,
            "outcome":"failure",
            "successes":0,
            "failures":2,
            "startDate":"2018-12-04T17:44:10.000Z",
            "endDate":"2018-12-04T17:44:10.000Z",
            "createdAt":"2018-12-04T17:44:10.000Z",
            "updatedAt":"2018-12-04T17:44:10.000Z"
         },
         {  
            "id":3,
            "userId":1,
            "streakId":1,
            "outcome":"success",
            "successes":2,
            "failures":0,
            "startDate":"2018-12-05T17:44:10.000Z",
            "endDate":"2018-12-05T17:44:10.000Z",
            "createdAt":"2018-12-05T17:44:10.000Z",
            "updatedAt":"2018-12-05T17:44:10.000Z"
         },
         {  
            "id":1,
            "userId":1,
            "streakId":1,
            "outcome":"success",
            "successes":6,
            "failures":0,
            "startDate":"2018-11-30T17:44:10.000Z",
            "endDate":"2018-12-03T17:44:10.000Z",
            "createdAt":"2018-11-30T17:44:10.000Z",
            "updatedAt":"2018-11-30T17:44:10.000Z"
         }
      ]
   }
]
```


# Running in Production
First, create a `www` user to run the node service: `useradd -r -U -s /usr/sbin/nologin www`
 - The `-s /usr/sbin/nologin` option removes the user's login shell (for security).
 - The `-r` option creates a system user, which doesn't have a home directory and is meant for running services.
 - The `-U` option creates a group of the same name, which is useful for web root directory permissions.

Then, set up the web root directory with `mkdir /var/www` and change its owner to the `www` user and group: `chown www:www /var/www`.

After cloning, make sure `app.js` has execute permissions and don't forget to migrate and seed the database.
To run this node app as a service, copy the `streaks.service` file into `/etc/systemd/system` (for `systemd` systems).
Then, use `systemctl daemon-reload` and `systemctl start streaks` to start the service.
 - Note: double-check directory permissions after cloning!
 - Binding to port 80 may require root privileges. There are various solutions to this problem. The best one is not using Node in production the first place.

To always start the service at boot, run `systemctl enable streaks`.
