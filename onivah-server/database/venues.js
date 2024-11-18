import mongoose from "mongoose";

// Define the schema
const venuesAllSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    ratings: { type: Number, required: true },
    venue_id: { type: String },
    price: { type: String },
    imageUrls: { type: [String], required: true } // Array of image URLs
});

// Create the model
const AllVenues = mongoose.model('venues', venuesAllSchema);

export default AllVenues;
