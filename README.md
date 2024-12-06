# VibeSync

## Project Description
VibeSync is a platform that allows users to compare their Spotify accounts to see how similar their music choices are to their friends. Using an in-house algorithm designed by our team, we can compare the Liked Songs of two Spotify Users and return a percentage of how similar they are. Our project aims to bring people closer together through a fun comparison of music.

## Installation Instructions
### 1. Clone the Repository:

#### First clone the repository:

```git clone <repository-url>``` 

#### Then switch to the repositories directory:

```cd <repository-directory>```

### 2. Install Dependencies:

### FOR THE BACKEND: 

```cd auth-server/authorization/authorization_code/```

#### Then install the dependencies using:

```npm install```


### FOR THE FRONTEND:

```cd client``` 

#### Then install the dependencies using:

```npm install```

### 3. Set Up Environment Variables and Database:

#### Create a .env file in the directory auth-server/authorization/authorization_code/.env with the following variables:

```CLIENT_ID=<your-spotify-client-id>```

```CLIENT_SECRET=<your-spotify-client-secret>```

```MONGO_URI=<your-mongodb-uri>```

Add the .env file to your .gitignore file to prevent it from being pushed to the repository. 

To get MongoDB up and running, run the following commands in the terminal:   

```npm install mongodb```

Check if the MongoDB connection is successful by running the following command in the terminal from the auth-server/authorization/authorization_code directory:

```node app.js```

### 4. Run the Frontend and Backend concurrently:
Use the following command from the root directory to start both the server and the client:

```npm run dev```

