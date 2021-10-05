# Code explanations

The explanations are broken down into 3 main sections. Client, Server, and Glaring Omissions.
But before reading all of that, try running the project with the following.

### Running the project

With [docker](https://docs.docker.com/get-docker/) installed it can be run with the following.

```
docker-compose up
```

The first time you run the command it will take a while for all the dependencies to install, the tests to run, and the builds compile. The second time launching the command is much faster.

You should then be able to acces the application on `http://localhost/` or `http://localhost:80/`

## Client

### Tests

If you want to run the tests outside of the Dockerfile, it's a simple `npm run test` from the `/client` directory. Running the application without the server is a simple `npm run dev` from the `/client` directory.

### Justification of opinionated decisions

#### Vanilla Typescript

This language was chosen since I was interested in learning more about how to implement [WebComponents](https://open-wc.org/guides/tools/ide/). Reflecting on an inherited project at work in backbone marionnette that we still haven't managed to deprecate, it made me realise that frameworks are fleeting. My experience implementing frameworks is that there's often wrappers that need to be applied to open source packages, and it's hard to transplant a module from one project to another. The promise of writing WebComponents is that they can run anywhere in any project, and that they will load faster since they have no dependencies. On the flip side however, they can be harder to implement that the framework alternatives and might become harder to read. This project was a convenient excuse for testing this trade-off, and to see if I could write a structured and clean project without the need of a framework. Things seem to have gone not too badly, but quite a lot of time was spent figuring out how to interact with attributes, what's the standard way of writing a WebComponent, how to write the unit-tests for WebComponents, and the drag & drop was a bit of a bother. I really should have used a third party lib for the drag and drop, or a third party WebComponent while were at it :sweat_smile:

#### Styling

Vite was used as the development tool, and it works better with CSS variables then Sass ones, so that's what was chosen. I didn't leave myself a lot of time to finish up the styling so there's a few bad practices in there. With more time on hand, implementing BEM and not using so many id's styles would be better. It would also have be interesting to implement the importing of styles in Shadow DOM WebComponents to avoid styles from one component interacting with those of another.

As for the Code format styling itself, mostly out of the box configurations of ESLint, Prettier and Typescript were used.

#### Open source packages

Jest for testing, EsLint for linting, Prettier for Formatting, and Vite for running dev and bundle-ing.

#### Code structure

Kept things to components, models, services. I did end up putting the drag and drop store under the services directory. The line between a store and a service often seems blurry.

The styles files and tests are next to their respective components.

## Server

### Tests

Using [VS code](https://code.visualstudio.com/download) as an IDE should recommend the installation of the extensions that were used during development.
This will enable a manual testing of the back-end by clicking on the `Send Request` buttons in the manual_tests.http file.

That being said the unit-tests are run before the docker-image is compiled.

### Justification of opinionated decisions

#### Python

It's understood that Dialogue uses Python as the main technology for their back-end. Using this language should help reviewers more easily understand what was done.
Not to mention that it's a syntactically minimalist language, and it's a standard to document each file/module and method. The makes the first-time reading much more pleasant.

#### Styling

Google's Python style guide was respected for this project.
yapf was used as the formatting tool, and the pylintrc configuration file is from google's python style guide.
This style guide was chosen since a lot of google's open source projects, such as tensorflow use this format.

There seems to be some conflicts between Prettier and yapf. You can run yapf manually before committing with

```

yapf -i . --recursive --style='{indent_width: 2}'

```

#### Persistence

Mongo DB was used for persistence. It may be a bit overkill for a single user as in a project of this scope, pickling and saving in flat file is usually quicker to implement.
It may not even be the best solution at a large number of users either, since SQL DBs are know to perform better at scale.
That being said, I already have an implementation of a python back-end with mongo in a personal project, so it was relatively painless to convert it for these purposes.
It also showcases an understanding on how to interact with a Database.

#### Open source packages

pytest is used for the testing, since it's found to simplify the syntax surrounding unit-tests. It's also recommended directly on the [python documentation for unit-tests](https://docs.python.org/3/library/unittest.html)

fastapi is used as the 'framework' tool, although it's implementation is so minimalist that it stays out of the way of how you organize your code.
It's lightweight and thanks to other tools like Starlette it offers a similar performance to Node.js alternatives.

Pydantic works in conjunction with fastapi and offers a conventient way to enforce and validate the typing of python objects.

pymongo is used for interacting with the mongo database.

#### Code structure

It's a simple MVC. Anything more obscure might have been annoying for others to review.
Since it's a small project, only models, controllers, and services were needed.
Tests were only done on the services, since it's really the only place where there's logic in the application.

## Glaring Omissions

Had I decided to use a framework I'm more familiar with I might have spent less time on this project. But as it stands I spent 2 days of my 3 day weekend, and I should spend some more time with friends and family. That is why although I noted the following on my own To Do list, they will unfortunately be omitted from my submission.

- It's only responsive over a width of 355px. Apparently the smallest screen is 325px.
- The background image will repeat for screens of an ipads width.
- Would have liked to break down some of the front-end unit tests into sub tests for cleaner code.
- Broke with the WemComponent pattern by using a store for the Drag & Drop.
- Skipped writing unit-tests for the todo.service.ts since it's simply a collection of straightforward http calls. It would be hard to mess up.
- Drag and drop does not work on mobile. Maybe a third party library would be able to do the trick.
- Drag and drop and dark mode were not unit-tested. Hopefully since they are Bonus marks this won't count against me.
- There's a potential memory issue if the user never drags and drops. The 'order' property on the ToDo's is only reset at the moment of Drag and Drop. If the user only creates new ToDo's and deletes them, you could have an almost infinitely large 'order' integer value. This could be fixed by resetting the order values of all ToDo's on the POST/creation endpoint.
- There's an issue with Prettier and yapf competing inside of VS Code if both extensions are running at the same time. Should figure out the settings configuration to have them work in their respective directories and apply it to the `./vscode/settings.json` file.
- Missing e2e tests. We taught QA how to do them at my current employer. Hopefully it's not a large part of the grading.

### Bonus

Thanks for reading this far! I hope the code was readable enough for you. I usually like to give verbal presentations of new code, but this will have to make due for the circumstances.

It may seem like a lot was done in a short time, but a fair chunk was recycled from a large open source personal project that I have going.

If you want you can check out the lighthouse audit, there's an attached a screenshot to the repo.

Have a wonderful day!
-Anonymous Developer
