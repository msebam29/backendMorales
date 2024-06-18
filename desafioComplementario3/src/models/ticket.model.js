import mongoose from "mongoose";

const ticketCollection = 'Tickets';

const TicketSchema = new mongoose.Schema({
  code: { 
        type: Number,
        required: true, 
        unique: true 
    },
  purchase_datetime: { 
        type: Date,  
    },
  amount: { 
        type: Number, 
        required: true 
    },
  purchaser: {
        type: String, 
        required: true 
    }
});

export const ticketModel = mongoose.model(ticketCollection, TicketSchema);
