import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullname: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		}
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
	  this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

const User = mongoose.model("User", userSchema);

export default User;