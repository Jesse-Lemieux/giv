const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    causes: [Cause]
    points: Int
  }

  type Cause {
    _id: ID
    title: String
    description: String
    url: String
    location: String
    comments: [Comment]
  }

  type Comment {
    _id: ID
    createdAt: String
    username: String
    body: String
  }

  type Category {
    _id: ID
    title: String
  }

  type Medal {
    title: String
    pointMin: Int
  }


  type Query {
    me: User
    user: User
    users: [User]
    causes(username: String): [Cause]
    cause(_id: ID!): Cause
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addUserPoints(userId: ID!, purchaseNumber: Int!): User
    addCausePoints(causeId: ID!, donationNumber: Int!): Cause
    addCause(
      title: String!
      description: String!
      url: String!
      location: String!
    ): Cause
    addComment(causeId: ID!, body: String!): Cause
  }
`;

module.exports = typeDefs;
