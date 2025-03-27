import mongoose from "mongoose";


const requestedServiceSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        category: { type: String, required: true },
        additionalFields: { type: mongoose.Schema.Types.Mixed, default: {} },
        images: [
            {
                filename: String,
                mimetype: String,
                data: String, // Store Base64 string
            },
        ],
        isApproved: { type: Boolean, default: false }, // True if approved, false otherwise
        declined: { type: Boolean, default: false }, // True if declined
        declineReason: { type: String, default: null }, // Reason for decline (if declined)
    },
    { timestamps: true }
);

const RequestedService = mongoose.model('RequestedService', requestedServiceSchema);

export default RequestedService;