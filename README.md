# Chirpy HTTP Server

## Description
Chirpy is a http server that functions similar to twitter. It provides a number of admin and API endpoints that allow for the creation and management of user accounts and chirps. Users are authenticated using JWT tokens and hashed passwords and require appropriate authorization for many of the endpoints such as deleting chirps or admin endpoints.

Note: This was a semi-guided project through Boot.dev (architecture not code)

## Installation
### Dependencies
Chirpy is written in typescript and requires the following dependencies:
- "Node": "^21.7.0"
- "argon2": "^0.44.0"
- "dotenv": "^17.2.3",
- "drizzle-orm": "^0.45.1",
- "express": "^5.2.1",
- "jsonwebtoken": "^9.0.3",
- "postgres": "^3.4.8"

### .env requirements

The following are required in your .env file. There are built in unit tests to check that these are accessed properly. Run the unit tests via "npm run tests"

DB_URL= "connection string to postgres db"
PLATFORM = "role on the platform - dev used for accessing admin endpoints"
SECRET = "secret key for argon 2 hashing"
POLKA_KEY = "API key used for polka webhooks to authenticate membership upgrades"

## API Endpoints

### API Endpoints
#### GET "/api/healthz"
Accepts GET requests and provides the current server status
___
#### POST "/api/users"
Accepts POST requests and creates a new user account.
##### Request Structure
```json
{
    "email": "example@test.com",
    "isChirpyRed": false
}
```
##### Response Structure
```json
{
    "id": "123451235123",
    "createdAt": "2024-01-28T07:38:00.000Z",
    "updatedAt": "2024-01-28T07:38:00.000Z",
    "email": "example@test.com",
    "isChirpyRed": false
}
```
___
#### "/api/users"
Accepts PUT Requests and updates a users email or password for the current logged in user
##### Request Structure
###### Headers
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
###### Request Body
```json
{
  "email": "example@test.com",
  "password": "thisismysuperstrongpassword"
}

```
##### Response Structure
```json
{
    "id": "123451235123",
    "createdAt": "2024-01-28T07:38:00.000Z",
    "updatedAt": "2024-01-28T07:38:00.000Z",
    "email": "example@test.com",
    "isChirpyRed": false
}
```
___

#### "/api/polka/webhooks"
Accepts POST Requests and is used to upgrade a user to chirpy_red via polka webhooks. Requires API key.
##### Request Structure

##### Response Structure

___

#### "/api/chirps"
Accepts GET requests and provides a list of all chirps on the server
##### Request Structure

##### Response Structure

___

#### "/api/chirps/:chirpID"
Accepts GET requests and provides the details of a specific chirp by ID
##### Request Structure

##### Response Structure

___

#### "/api/chirps/:chirpID"
Accepts DELETE requests and deletes a specific chirp by ID. Requires author to be logged in.
##### Request Structure

##### Response Structure

___

#### "/api/chirps"
Accepts POST requests and is used for creating a new chirp
##### Request Structure

##### Response Structure

___

#### "/api/login"
Accepts POST Requests and is used to log in a specific user
##### Request Structure

##### Response Structure

___

#### "/api/refresh"
Accepts POST requests and is used to verify a refresh token
##### Request Structure

##### Response Structure

___

#### "/api/revoke"
Is used to revoke a specific request token
##### Request Structure

##### Response Structure

___

### Admin Endpoints
#### "/admin/reset"
Accepts POST requests and is used to reset the server deleting all chirps and user accounts

___
#### "/api/users"
Accepts POST requests and creates a new user account.
##### Request Structure

##### Response Structure

___
#### "/admin/metrics"
Accepts GET requests and provides simple metrics about the server such as how many hits it has received since reset.
##### Request Structure

##### Response Structure

___