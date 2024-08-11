# TrashRight
## How to run the application
- Make sure Docker Desktop is installed correctly
- clone the git respository
- create an API Key for the Gemini API
- in /trash-right/app create a document ".env.local" and add your API_KEY like this:
    API_KEY=<your_api_key>
- Make sure port 3000 is not occupied
- from inside the cloned /trash-right directory run:
< docker compose up --build >
This will build the docker image an run the application.
- To use the webapp open http://localhost:3000 in Google Chrome
