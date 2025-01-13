import mongoose from "mongoose";

// Define Makeup Artist schema
const makeupArtistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    makeupArtist_id: { type: String, required: true },  // For makeup artist, it can be like "makeup_artist_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const MakeupArtist = mongoose.model("MakeupArtist", makeupArtistSchema);

export default MakeupArtist;
