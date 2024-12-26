import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, null, "OK"));
    } catch (error) {
        next(new ApiError(500, "Health check failed"));
    }
})