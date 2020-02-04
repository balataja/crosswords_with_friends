google doc style crossword puzzle:

### Thoughts
-keeps score
-pulls puzzles from LA Times/NY Times
-Modes:
--Free For All
---only checks answer on clue unfocus
---only saves answer when it's correct, otherwise clears
--Loop through clues together (Anagram Helper button is a good starting point!)
---one person can get the clue correct
---timer would force onto next clue if no one has solved
---to short circuit the timer, user can check a box to skip, and when all boxes are checked, will move onto next clue
-1 point/word vs 1 point/letter

### Resources
-source for crossword data (json)
https://github.com/doshea/nyt_crosswords

-source for crossword component (react)
https://github.com/zetter/react-crossword

-source for backend skeleton --> includes login/sign up (MERN)
https://github.com/joshuaslate/mkrn-starter

-source for socket.io --> broadcasts updates to connected clients
https://github.com/socketio

-source for mongoose concurrency control --> won't update document unless you have latest version
https://www.npmjs.com/package/mongoose-update-if-current

-source for react notifications
-https://www.npmjs.com/package/react-notifications

-to import folder of json into mongoose
-FOR %i IN (C:\mongodbData\*.json) DO mongoimport --db dbName --collection colection --type json --file %i

### Work

DONE:
Phase 0: Environment Setup/Run Example/Convert Crossword JSON Data
-Set up Reactjs environment
-Import react-crossword and get example running
-convert nyt crossword json to react-crossword json format
-setup MKRN environment
-create new Mongo database
-merge react-crossword with mkrn-skeleton
-populate db with nyt json

Phase 1: Database Persistence Of Game State
-create Mongoose db models for json data
-Mongoose models for profile
-create Mongoose model for active game
--basically a representation of the Crossword obj with _id's, game _id, player's participating and color associated with said player, player _id who got answer right
-write to db upon correct answer
--plugin mongoose-update-if-current to ensure concurrency in document saves

Phase 2: User Profiles & Game History
-create user game history, to be able to jump back into started/ended games
-login/sign up page
-create game screen after login/sign up screen
-join game screen after login/sign up screen
-allow random games to be created

Phase 3: Multi-Player Coordination
-import socket.io and get example working
-unpack react-crossword in order to hook into onCheck() methods to emit socket.io events
-update react-crossword to only highlight correct letters
-emit Socket.io events for pushing clue notifications to/from server
-add buildClueAnsweredBy() method to build a map
-different highlighting for different io connection's correct answers/scores
-add notifications framework for alerting players on screen
-emit IO event when game joined
-cross through of answered clues

Phase 4: Allow Concurrent Games To Be Played
-Generate a game _id function in Mongoose, that will also be used for custom socket.io namespace
-create custom socket.io rooms logic for multiple games
-UI directory for searching for a given puzzle, or logic to pick random puzzle


ToDo:
Phase 0: Environment Setup/Run Example/Convert Crossword JSON Data
-push to github

Phase 1: Database Persistence Of Game State

Phase 2: User Profiles & Game History
-add game timer

Phase 3: Multi-Player Coordination
-game scoreboard
-single global instance for socket
--https://itnext.io/how-to-use-a-single-instance-of-socket-io-in-your-react-app-6a4465dcb398
-show where other users are focused
--would need it's own emitFocus() event
-reconnect upon socket disconnect

Phase 4: Allow Concurrent Games To Be Played
-test multiple games at once (need to host project first)

Phase 5: Deploy
-host the project
--heroku app
--url's need to point to same place (api and app)
-load initial crossword data to mongodb (mLab)
-document setup and deployment
-get feedback from friends playing the game!!

Phase 6: Scaling/Optimizing
-load UserGames and data efficiently when on gameLobby screen
-efficient loading and saving of crossword game data
-efficiently show list of crossword games to create (ie. date of game)

Phase 7: Prettify
-gameLobby screen
--make 'game cards' to house game info with links and stuff
--career stats (total clues answered, games played, games won, etc.)
--pictures
-loading animation
-clean up/add appropriate notifications (user connected/disconnected, clue answered, etc.)