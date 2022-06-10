//Mongoose models
const Ticket = require('../models/Ticket')
const Client = require('../models/Client')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql')

// Ticket Type
const TicketType = new GraphQLObjectType({
  name: 'Ticket',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      },
    },
  }),
})

//Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tickets: {
      type: new GraphQLList(TicketType),
      resolve(parent, args) {
        return Ticket.find()
      },
    },
    ticket: {
      type: TicketType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Ticket.findById(args.id)
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find()
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id)
      },
    },
  },
})

//Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //Add Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })

        return client.save()
      },
    },
    //Delete Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id)
      },
    },
    // Add a ticket
    addTicket: {
      type: TicketType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'TicketStatus',
            values: {
              new: { value: 'Diagnostics' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const ticket = new Ticket({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        })

        return ticket.save()
      },
    },
    // Delete a ticket
    deleteTicket: {
      type: TicketType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Ticket.findByIdAndRemove(args.id)
      },
    },
    // Update a ticket
    updateTicket: {
      type: TicketType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'TicketStatusUpdate',
            values: {
              new: { value: 'Diagnostics' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Ticket.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        )
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})
