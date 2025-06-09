import mongoose from "mongoose";


const requestedServiceSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        category: { type: String, required: true },
        additionalFields: { type: mongoose.Schema.Types.Mixed, default: {} },
        images: {
            type: Map,
            of: [String], // Each key is a folder name, value is array of strings (keys)
            default: {}
        },
        file: {
            originalName: String,
            storedName: String,
            mimeType: String,
            size: Number,
        },
        isApproved: { type: Boolean, default: false }, // True if approved, false otherwise
        declined: { type: Boolean, default: false }, // True if declined
        declineReason: { type: String, default: null }, // Reason for decline (if declined)
        linkedServiceId: { type: mongoose.Schema.Types.ObjectId, default: null },

    },
    { timestamps: true }
);

const RequestedService = mongoose.model('RequestedService', requestedServiceSchema);

export default RequestedService;