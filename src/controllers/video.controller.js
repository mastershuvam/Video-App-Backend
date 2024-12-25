import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const filter = {
        ...(query && { title: new RegExp(query, 'i') }),
        ...(userId && { user: userId })
    }
    const sort = sortBy ? { [sortBy]: sortType === 'desc' ? -1 : 1 } : {}
    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
    res.status(200).json(new ApiResponse(videos))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const videoFile = req.file
    if (!videoFile) throw new ApiError(400, 'No video file uploaded')
    const uploadResult = await uploadOnCloudinary(videoFile.path)
    const video = new Video({
        title,
        description,
        url: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        user: req.user._id
    })
    await video.save()
    res.status(201).json(new ApiResponse(video))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, 'Invalid video ID')
    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, 'Video not found')
    res.status(200).json(new ApiResponse(video))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, 'Invalid video ID')
    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, 'Video not found')
    const { title, description, thumbnail } = req.body
    if (title) video.title = title
    if (description) video.description = description
    if (thumbnail) video.thumbnail = thumbnail
    await video.save()
    res.status(200).json(new ApiResponse(video))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, 'Invalid video ID')
    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, 'Video not found')
    await video.remove()
    res.status(200).json(new ApiResponse({ message: 'Video deleted successfully' }))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, 'Invalid video ID')
    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, 'Video not found')
    video.isPublished = !video.isPublished
    await video.save()
    res.status(200).json(new ApiResponse(video))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}