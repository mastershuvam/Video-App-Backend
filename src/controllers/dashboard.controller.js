import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;

        const totalVideos = await Video.countDocuments({ owner: userId });
        const totalViews = await Video.aggregate([
            { $match: { owner: userId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const totalSubscribers = await Subscription.countDocuments({ channel: userId });
        const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ owner: userId }).select('_id') } });

        res.status(200).json(new ApiResponse(200, {
            totalVideos,
            totalViews: totalViews[0]?.totalViews || 0,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully"));
    } catch (error) {
        next(new ApiError(500, "Failed to fetch channel stats"));
    }
})

const getChannelVideos = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const videos = await Video.find({ owner: userId });

        res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
    } catch (error) {
        next(new ApiError(500, "Failed to fetch channel videos"));
    }
})

export {
    getChannelStats, 
    getChannelVideos
}