import mongoose from "mongoose";

// Define the schema
const topPicksSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    ratings: { type: Number, required: true },
    venue_id: { type: String },
    location: { type: String },
    imageUrls: { type: [String], required: true } // Array of image URLs
});

// Create the model
const TopPicks = mongoose.model('TopPicks', topPicksSchema);

export default TopPicks;
