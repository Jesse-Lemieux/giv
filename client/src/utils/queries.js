import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      causes {
        _id
        title
        description
        url
        location
        category
        points
        comments {
          _id
          body
          createdAt
          username
        }
        medals {
          _id
          body
          username
          createdAt
        }
      }
      points
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      points
    }
  }
`;

export const QUERY_USER = gql`
  query user($id: ID!) {
    user(_id: $id) {
      __id
      username
      email
      causes {
        _id
        title
        description
        url
        location
        category
        points
        comments {
          _id
          body
          createdAt
          username
        }
        medals {
          _id
          body
          username
          createdAt
        }
      }
      points
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      email
      causes {
        _id
        title
        description
        url
        location
        comments {
          _id
          body
          username
          createdAt
        }
        medals {
          _id
          body
          username
          createdAt
        }
        category
        points
      }
    }
  }
`;

export const QUERY_USER_BASIC = gql`
  query user($id: ID!) {
    user(_id: $id) {
      __id
      username
      email
      points
    }
  }
`;

export const QUERY_CAUSE = gql`
  query cause($id: ID!) {
    cause(_id: $id) {
      _id
      title
      description
      url
      location
      category
      points
      createdAt
      username
      comments {
        _id
        body
        createdAt
        username
      }
      medals {
        _id
        body
        username
        createdAt
      }
    }
  }
`;

export const QUERY_CAUSES = gql`
  {
    causes {
      _id
      title
      description
      url
      location
      category
      points
      createdAt
      username
      comments {
        _id
        body
        createdAt
        username
      }
      medals {
        _id
        body
        username
        createdAt
      }
    }
  }
`;
