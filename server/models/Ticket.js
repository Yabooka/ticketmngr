const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Diagnostics', 'In Progress', 'Completed'],
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
})

module.exports = mongoose.model('Ticket', TicketSchema)
