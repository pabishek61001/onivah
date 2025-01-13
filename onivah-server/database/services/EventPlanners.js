import mongoose from "mongoose";

// Define Event Planners schema
const eventPlannersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    eventPlanners_id: { type: String, required: true },  // For event planners, it can be like "event_planners_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const EventPlanners = mongoose.model("EventPlanners", eventPlannersSchema);

export default EventPlanners;
