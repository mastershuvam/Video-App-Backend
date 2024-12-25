import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user.id

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID')
    }

    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, 'Channel not found')
    }

    const subscription = await Subscription.findOne({ subscriber: userId, channel: channelId })

    if (subscription) {
        // If subscription exists, remove it (unsubscribe)
        await subscription.remove()
        res.status(200).json(new ApiResponse(200, 'Unsubscribed successfully'))
    } else {
        // If subscription does not exist, create it (subscribe)
        await Subscription.create({ subscriber: userId, channel: channelId })
        res.status(201).json(new ApiResponse(201, 'Subscribed successfully'))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID')
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'name email')
    res.status(200).json(new ApiResponse(200, 'Subscribers fetched successfully', subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid subscriber ID')
    }

    const channels = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'name description')
    res.status(200).json(new ApiResponse(200, 'Subscribed channels fetched successfully', channels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}