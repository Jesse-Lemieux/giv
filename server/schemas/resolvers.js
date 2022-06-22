const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { User, Cause  } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("causes");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find().select("-__v -password").populate("causes");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("causes");
    },
    causes: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Cause.find(params).sort({ createdAt: -1 });
    },
    cause: async (parent, { _id }) => {
      return Cause.findOne({ _id });
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      console.log(args, user, token);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addUserPoints: async (parent, args, context) => {
      console.log(args, context.user)
      if (context.user) {
        const count = args.purchaseNumber

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $inc: { points: count }},
          { new: true }
        );
        return count;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addCausePoints: async (parent, args, context) => {
      if (context.user) {
        console.log(args)
        const cause = await Cause.findById(args.causeId)
        
        const count = args.donationNumber
        
        if( count > 99  && count < 200){
          
         
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $inc: { points: -count }},
            { new: true }
          );

          await Cause.findByIdAndUpdate(
            {_id: args.causeId},
            { $inc: { points: count }},
            { new: true }
          )
          console.log(cause.medals)
          cause.medals.unshift({
            body: 'Bronze',
            username: context.user.username,
            createdAt: new Date().toISOString()
          })
          await cause.save()
          console.log(cause.medals)

          return cause;

        }

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $inc: { points: -count }},
          { new: true }
        );

        await Cause.findByIdAndUpdate(
          {_id: args.causeId},
          { $inc: { points: count }},
          { new: true }
        )
        return count;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addCause: async (parent, args, context) => {
      if (context.user) {
        const cause = await Cause.create({ ...args, userId: context.user._id });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { causes: cause._id } },
          { new: true }
        );
        return cause;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addComment: async (parent, { causeId, body }, context) => {
      const cause = await Cause.findById(causeId);

      console.log(cause);

      if (cause) {
        cause.comments.unshift({
          body,
          createdAt: new Date().toISOString(),
        });

        await cause.save();

        return cause;
      }

      throw new UserInputError("Cause not found");
    },
  },
};

module.exports = resolvers;
