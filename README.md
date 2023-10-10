# Teckno Technical CRUD App Angular

TaskPhin Technical CRUD App is an Angular application that provides a user interface for managing movies data using a CRUD interface. It includes login and registration functionality, movie details ist display in table and delete ,edit and update crud uses, and utilizes JWT (JSON Web Tokens) for user authentication. The app also features several Angular components, services, and interceptors for enhanced functionality.

# Project Structure
my-crud-app-angular
|-- src
|   |-- app
|   |   |-- auth-guard
|   |   |   `-- auth.guard.ts
|   |   |-- auth-service
|   |   |   `-- auth.service.ts
|   |   |-- error-interceptor
|   |   |   `-- error.interceptor.ts
|   |   |-- token-interceptor
|   |   |   `-- token.interceptor.ts
|   |   |-- login
|   |   |   |-- login.component.html
|   |   |   |-- login.component.ts
|   |   |-- register
|   |   |   |-- register.component.html
|   |   |   |-- register.component.ts
|   |   |-- movie-home
|   |   |   |-- movie-home.component.html
|   |   |   |-- movie-home.component.ts
|   |-- assets
|   |   |-- images
|   |   |   `-- logo.png
|-- node_modules
|-- package.json
|-- package-lock.json
|-- angular.json
|-- tsconfig.json
|-- README.md

# Installation
Before running the Angular app, make sure you have the following prerequisites installed on your machine:

Node.js and Angualr Cli 14.2.0 to run Project 
# Follow these steps to set up and run the project:
cd taskphin-angualr

# Install project dependencies using npm (use the --force flag to ensure dependencies are reinstalled):
npm install --force

# Start the Angular development server:
ng serve

# environment folder for Backend API 
Default set in development : http://localhost:5000/api
Default set in Production : http://localhost:5000/api
