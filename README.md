# Websocket battleship server

## Installation
1. Clone/download repo
2. Switch to develop branch
3. `npm install`
(*replace `npm` with `yarn` in `package.json` if you use yarn.*)

## Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:3000` with nodemon

**Production**

`npm run start`

* App served @ `http://localhost:3000` compiled without nodemon

---

## Notes about game implementation

1. *Name/password validation*: there is a check if name and password are not less then 5 letters, also the name have to be unique in the game. If a player logged in already and disconnected, and the *server was not restarted*, his name will be associated with password used and there will be validation of password as well.

2. Once entered the player will found hitself in the fresh created room, expecting other player. If there are 5 players without a game in progress, there will be 5 rooms, each with only one player. Then any player can choose another room with a player to start game (__add to room__) or start single game (__play with bot__). Pressing __create room__ doesn't seem to have result, but new room is created and *empty room is not displayed* to avoid infinite empty room spawn.

3. After game conclusion, each *player returns to the game without room*, he has to press button **create room** to create a room and enter there to expect new game(or he can start new game by choosing another room with another player or choose **play with bot** *independently on being in the own room*).



