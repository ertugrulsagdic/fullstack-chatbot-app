# This is the README file for the FullStack Chatbot Application

The project is implemented using NestJS for backend and React for frontend. The project is a chatbot application that allows users to interact with the chatbot and get responses to their queries. 

There are questions that user should answer and for each session those asnwers are saved into database.

Here are the default questions that user should answer:
1. What is your favorite breed of cat, and why?
2. How do you think cats communicate with their owners?
3. Have you ever owned a cat? If so, what was their name and personality like?
4. Why do you think cats love to sleep in small, cozy places?
5. What’s the funniest or strangest behavior you’ve ever seen a cat do?
6. Do you prefer cats or kittens, and what’s the reason for your preference?
7. Why do you think cats are known for being independent animals?
8. How do you think cats manage to land on their feet when they fall?
9. What’s your favorite fact or myth about cats?
10. How would you describe the relationship between humans and cats in three words?

## Installation

Before anything make sure that you installed NodeJS and MongoDB on your machine.

To install the project, you need to clone the repository and run the following commands:

```git clone <repository-url>```

```cd fullstack-chatbot```

If you want to use pnpm as package manager, you can install it by running the following command:
```npm install -g pnpm```

Then in one terminal run the following command to start the backend server:
```cd backend && pnpm install && pnpm start```

And in another terminal run the following command to start the frontend server:
```cd frontend && pnpm install && pnpm start```

Then we can run seed command in backend directory to seed the questions:
```npx nestjs-command seed:questions```

### Docker Installation
To run the application using Docker, you need to have Docker installed on your machine.
```https://docs.docker.com/get-docker/```

After installing Docker, you can run the following command to start the application:
```docker-compose up --build```

### Start the application after installation
After running the above commands using native way or Docker, you can access the application by visiting http://localhost:3000 in your browser.


### Resources I used to implement the project

To install NodeJS:
```https://nodejs.org/en/download/```

If you are not using MongoDB Atlas or Docker Image you can install MongoDb:
```https://www.mongodb.com/docs/manual/installation/```

Setup NestJS mongoose connection and schemas:
```https://docs.nestjs.com/techniques/mongodb```

Seed setup in NestJS:
```https://www.npmjs.com/package/nestjs-command```
```https://stackoverflow.com/questions/56103518/what-is-the-proper-way-to-do-seed-mongodb-in-nestjs-using-mongoose-and-taking-a```

Websockets in NestJS:
```https://docs.nestjs.com/websockets/gateways```
```https://dev.to/jfrancai/demystifying-nestjs-websocket-gateways-a-step-by-step-guide-to-effective-testing-1a1f```

To test socket connection:
```https://piehost.com/socketio-tester```
