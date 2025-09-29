import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new Schema({

    subscriber: {
        typr: Schema.Types.ObjectId,
        ref:"User"
    },
    channel: {
        typr: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export default Subscription = mongoose.model("Subscription", subscriptionSchema);