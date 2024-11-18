// models/Venue.js
import mongoose from "mongoose";

const venuesubmitSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,  // Initially, the venue is not approved
    },
});

const VenueSubmission = mongoose.model('Venue', venuesubmitSchema);

export default VenueSubmission;