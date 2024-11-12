# Todo List App Documentation

## Instruments (Tech Stack)

- **JavaScript**: Core language for both frontend and backend.
- **Node.js**: Runs JavaScript on the server side.
- **CSS (Sass)**: Styling and design aesthetics.
- **React/JSX**: Frontend building blocks.
- **Express**: Backend server framework.
- **MySQL**: Database for storing tasks and user information.
- **npm**: Dependency management.

## Purpose

The primary goal of this app is learning. The focus is on understanding React's concepts and principles. Building a simple todo app allows for experimenting with the basics of state, component interaction, and HTTP requests without the complexity of advanced algorithms.

## Struggles (Took 10+ hours)

- **JWT or Sessions**: Deciding between Session and JWT. Took 4 days to realize that session storage is not the same as server sessions.
- **Cookie Dilemma**: Cookie wasn’t being added to the browser even though `set-cookie` was present in the header.

## Authentication

- **Current Status**: In progress.
- **Goal**: Implement user authentication for sign-up and sign-in.

### API Endpoints

- `POST /signup`: Create a new user account.
- `POST /signin`: Log in with existing credentials.
- `POST /currentUser`: Gets the username through the session.

## Tests

- **Not Applicable**: No formal testing implemented yet.
- **Logging in testing**

## Current Todo

- **Implement Cookies/Sessions**: Track if a user is logged in and route accordingly to the home page.
- **Guest Access**: Consider adding a guest user feature.
- **Sign In / Sign Up Pages**: Implement with React Router.

## Future Improvements

- **Add a Small Chat Feature**: For real-time user interaction.
- **Renovate the Design**: Better visuals for improved UX.

## Progress (Completed Tasks)

- **Brainstormed Components**: Sketched out the structure of app components.
- **Initial Design**: Established the basic layout and user interface.
- **Interactivity**: Added functionality to add, remove, and mark tasks as done.
- **Started Express Server**: Running at `localhost:5000`, set up a RESTful API to handle requests.
- **Integrated Frontend and Backend**: Used Axios for HTTP requests between React and Express (similar to Python’s httpx and requests, but in JavaScript).
- **Sign-up Functionality**: Added user records to the MySQL database, ensuring no email duplicates. Considering Firebase or Auth0 for future enhancements.
- **Understand Express/Axios**: Almost done.
- **Add React Router**: For navigation between pages.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

