import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  _id: string;
  message: string;
  date: Date;
  userId: string;
  isRead: boolean; // Added this useful field to track if notifications have been read
}

const NotificationSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Check if the model exists before creating a new one (prevents overwriting during hot reloads)
export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
