import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Ensure 'name' is required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;