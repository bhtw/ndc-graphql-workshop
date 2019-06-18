# GraphQL Workshop

The master of whisperers is starting to lose track of all the comings and goings in Westeros. He has decides to build an GraphQL API to keep track, and has demanded that you help him.

Good luck!

## Introduction

GraphQL is an open-source data query language for API's, and a runtime for fulfilling those queries with existing data. It represent a new way to think about API's compared to traditional methods like REST. This workshop will give you hands-on experience using GraphQL to master common API operations.

We will cover basic topics like fetching data from a GraphQL server using queries and mutations, writing schemas to describe what data can be queried and getting to know the schema type system. At the end of the workshop you will be well equipped to start implementing a new, or to query an existing, GraphQL API.

## Getting started

First, clone this project.

The workshop comes in two versions. The exercises can be solved in Node.js or .NET. Choose your favourite, and follow the links below to install the project.

- [.NET](/dotnet/readme.md)
- [Node.js](/node/README.md)

Your GraphQL server should now be running on [http://localhost:4000](http://localhost:4000). Open the browser, to check that you are running [GraphiQL](https://github.com/graphql/graphiql), which is one of the key benefits of GraphQL. It is an interactive documentation of the GraphQL API, where you can see the Schema, read the autogenerated docs and try out queries with autocomplete. Use it for all it is worth in the excersises.

We also provide a React client that is set ut to consume data exposed from our GraphQL server. All client related tasks are marked with "Frontend" and are not required to finish the workshop. Follow the link below to read installation instructions for the client

- [Client (React.js)](/client/README.md)

Your React.js app should now show some html on [http://localhost:3000](http://localhost:3000).

## Task 1 - Basic Queries

The GraphQL query language is basically about selecting fields on objects, which means that the client is now in control. The GraphQL server will return only the fields asked for.

A query is built hierarchical, with a top-level `query`

```graphql
query {
  characters {
    id
  }
}
```

### a) Use the query above to list all character id's in GraphiQL

The client decides which character fields it needs. It can ask for id, name and image like this:

```graphql
query {
  characters {
    id
    name
    image
  }
}
```

### b) Extend the the query from a) to also list the `name` and `image` of each character.

Nested queries can be used to find information about a characters siblings:

```graphql
query {
  characters {
    name
    siblings {
      name
    }
  }
}
```

### c) Use a nested query to see the characters' siblings.

## Task 2 - Schemas and Types

The schema defines your GraphQL API's type system, and what is allowed to be executed in the GraphQL server. Calls from the client are validated and executed against the schema.

Every schema needs a root query type, defining the top level queries.

```graphql
type Query {
  characters: [Character]
}
```

The `characters` field is defined as a list of type `Character`.

```graphql
type Character {
  id: ID!
  name: String
  image: String
  allegiances: [String]
  siblings: [Character]
}
```

The `Character` type defines two fields of type `ID` and `String`. Both are one of the built in scalar types defined by GraphQL. A scalar type resolves to a single scalar object, which can't have sub-selections in a query. The scalar types are:

- Int: A signed 32‐bit integer.
- Float: A signed double-precision floating-point value.
- String: A UTF‐8 character sequence.
- Boolean: `true` or `false`.
- ID: represents a unique identifier and is serialized in the same way as a String

For scalar types, you can just add a field to a type in your schema - and GraphQL will resolve it based on matching name in the data set.

The `!` behind `ID` simply means that the field is non-nullable.

### a) Add the field `alligiances`to the `Character`type. Use GraphiQL to find alligiances of all characters.

### b) [Frontend] Add image for each character in `Characters.js`

## Task 3 - Resolvers

Resolvers are responsible for mapping the operations to actual functions. For the `Character` type, there is already defined one resolver - the one that resolved your query for siblings earlier.

### JS

With Javascript it would look something like this:

```js
const Character = {
  siblings: (root, args) => {
    return characters.filter(character =>
      root.siblingIds.includes(character.id)
    );
  }
};
```

All resolvers receives the `root` argument, which is the parent beeing resolved. To find all the siblings, the resolver filters all characters using the `siblingIds` list.

### C#

In C# the resolver responsible for mapping siblings is placed in `CharacterType.cs` and looks like this:

```c#
 Field<ListGraphType<CharacterType>>(
                "siblings",
                resolve: context => data.GetSiblings(context.Source)
            );
```

### a) Add lovers and spouses to `Character`. Remember to also add it to your schema

Up until now we have queried all characters, but we want to be able to get one specific. The following query should return Bran Stark:

```graphql
query {
  character(name: "Bran Stark") {
    name
  }
}
```

To support this query you need to extend the `Query` type in your schema:

```graphql
type Query {
  characters: [Character]
  character(name: String): Character
}
```

### JS

Now we will make use of the `args` argument. Adding a `character` resolver like below, will allow you to query a specific character by name.

```js
const Query = {
  characters: (root, args, context) => {
    return characters;
  },
  character: (root, args, context) => {
    return characters.find(char => char.name === args.name);
  }
};
```

### C#

With C# you would have to do something like this in the `GotQuery`-file

```c#
  Field<CharacterType>(
                "character",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name", Description = "name of the character" }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<string>("name");
                    return data.GetCharacter(name);
                });
```

### b) Add `character(name: String): Character` to the API.

```graphql
type House {
  id: ID!
  name: String
  words: String
  region: [String!]
  allegiances: [House!]
  members: [Character!]
}
```

### c) Add `House` to the API. Use GraphiQL to list all houses.

### d) It should also be possible to find out which house a character belongs to.

### e) [Frontend] Get required data for a specific character in `Character.js` by implementing `react-apollo`'s `Query`-component. You might need to update your server side GraphQL schema to get all required fields. Useful documentation can be found here: https://www.apollographql.com/docs/react/essentials/queries/

## Task 4 - Mutations

Mutations are the second main operation in GraphQL. It deals with creating, deleting and updating data. As with the `Query` type in your schema, you will need to add a `Mutation` type. Lets imagine you are Jaime Lannister, secrets are important to you - sometimes desperate actions are needed:

```graphql
type Mutation {
  pushFromWindow(name: String!): Character
}
```

### a) Implement the `pushFromWindow` mutation. This includes changes to both schema and resolver.

### b) [Frontend] Implement the `pushFromWindow` mutation in the `Push`-component in `Character.js`. Use `react-apollos`'s `Mutation`-component. Useful documentation can be found here: https://www.apollographql.com/docs/react/essentials/mutations/

It is not just in Westeros the action is happening. Across the Narrow Sea, an important wedding is taking place. The ruggedly handsome Khal Drogo is marrying the beautiful Daenerys Targaryen.

### c) Make sure the wedding takes place. Create a mutation taking two names as arguments.

```graphql
type Mutation {
  pushFromWindow(name: String!): Character
  marry(spouseName1: String!, spouseName2: String!): [Character]
}
```

Although the claim may be poor, Joffrey Baratheon manages to be crowned King of the Seven Kingdoms. We have to make sure our API keeps track.

### d) Give King Joffrey the titles: the First of His Name, King of the Andals and the First Men, Lord of the Seven Kingdoms, and Protector of the Realm

### e) [Frontend] Make it possible to add titles to a character by implementing a mutation in the `AddTitle`-component in `Character.js`

## Bonus task

Add seat to all the the houses. To do this you need to define a `Castle` type with the necessary fields (check the data set).
