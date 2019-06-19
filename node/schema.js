const gql = require("graphql-tag");

module.exports = gql `
  type Query {
    characters: [Character]
    character(name: String): Character
    houses: [House]
  }

  type Character {
    id: ID!
    name: String
    image: String
    allegiances: [String]
    lovers: [Character]
    spouses: [Character]
    siblings: [Character]
  }

  type House {
    id: ID!
    name: String
    words: String
    region: [String!]
    allegiances: [House!]
    members: [Character!]
  }
`;