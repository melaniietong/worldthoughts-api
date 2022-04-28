# Routes

## Polls

### `GET /polls`
Get all polls.

### `GET /polls/random`
Get a random poll.

### `GET /polls/:id`
Get a specific poll.

| param    | type    | description               |
|----------|---------|---------------------------|
| id       | number  | Poll id                   |

### `POST /polls`
Create a poll question.

| query    | type    | description               |
|----------|---------|---------------------------|
| question | string  | Question                  |
| isSingle | boolean | Whether radio or checkbox |

## Options

### `GET /options`
Get all options for a poll.

| query    | type    | description               |
|----------|---------|---------------------------|
| pollId   | number  | Poll id                   |

### `POST /options`
Create poll options.

| body     | type    | description               |
|----------|---------|---------------------------|
| title    | string  | Option title              |

## Answers

### `GET /answers`
If a poll id is provided, then it'll return a count of the total answers for that poll.

If an option id is provided, it'll return a count of the total answers for that option.

| query    | type    | description               |
|----------|---------|---------------------------|
| pollId   | number  | Poll id                   |
| optionId | number  | Option id                 |

### `GET /answers/user`
Get all answers from a user

| query    | type    | description               |
|----------|---------|---------------------------|
| pollId   | number  | Poll id                   |
| cookie   | string  | User's cookie id          |

### `POST /answers`
Create an answer.

| body     | type    | description               |
|----------|---------|---------------------------|
| pollId   | number  | Poll id                   |
| optionId | number  | Option id                 |
| cookie   | string  | User's cookie id          |

### `DELETE /answers`
Delete an answer.

| query    | type    | description               |
|----------|---------|---------------------------|
| pollId   | number  | Poll id                   |
| cookie   | string  | User's cookie id          |