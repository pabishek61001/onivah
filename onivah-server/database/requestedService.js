import mongoose from "mongoose";


const requestedServiceSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        additionalFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

const RequestedService = mongoose.model('RequestedService', requestedServiceSchema);

export default RequestedService;