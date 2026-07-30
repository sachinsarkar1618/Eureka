import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  username: {
    type: String,
  },
  popularity: {
    type: Number,
    default: 0
  },
  reactions : {
    type: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        }
      }
    ],
    default : []
  }
}, {
  timestamps: true
});

UserSchema.index({ username: 1 });
UserSchema.index({ email : 1 });

const User = models.User || model('User', UserSchema);

export default User;
