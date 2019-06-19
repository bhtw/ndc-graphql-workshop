const {
  GraphQLServer
} = require("graphql-yoga");
const typeDefs = require("./schema.js");

// In-memory data storage
const characters = require("./data/characters.js");
const houses = require("./data/houses.js");
const castles = require("./data/castles.js");

// This is the Query resolver
const Query = {
  characters: (root, args, context) => {
    return characters;
  },
  character: (root, args, context) => {
    return characters.find(char => char.name === args.name);
  },
  houses: (root, args, context) => {
    return houses;
  },
};

// This is the Character resolver
// Scalar fields with the same name as in the js object are resolved automatically.
const Character = {
  siblings: (root, args, context) => {
    return characters.filter(char => root.siblingIds.includes(char.id));
  },
  lovers: (root, args, context) => {
    return characters.filter(char => root.loverIds.includes(char.id));
  },
  spouses: (root, args, context) => {
    return characters.filter(char => root.spouseIds.includes(char.id));
  }
};

const House = {
  allegiances: (root, args, context) => {
    return houses.filter(house => root.allegianceHouseIds.includes(house.id));
  },
  members: (root, args, context) => {
    return characters.filter(char => root.id.includes(char.houseId));
  }
}

// All resolvers must be added to the resolver object
const resolvers = {
  Query,
  Character,
  House
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));