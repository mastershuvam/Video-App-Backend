import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId })

    if (existingLike) {
        await existingLike.remove()
        res.status(200).json(new ApiResponse(200, "Video unliked successfully"))
    } else {
        await Like.create({ video: videoId, likedBy: userId })
        res.status(201).json(new ApiResponse(201, "Video liked successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId })

    if (existingLike) {
        await existingLike.remove()
        res.status(200).json(new ApiResponse(200, "Comment unliked successfully"))
    } else {
        await Like.create({ comment: commentId, likedBy: userId })
        res.status(201).json(new ApiResponse(201, "Comment liked successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId })

    if (existingLike) {
        await existingLike.remove()
        res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"))
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId })
        res.status(201).json(new ApiResponse(201, "Tweet liked successfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } }).populate("video")

    res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}