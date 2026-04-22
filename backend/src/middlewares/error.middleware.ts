import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            ApiResponse.error(err.message)
        )
    }

    console.error("Error", err);
    

    return res.status(500).json(
        ApiResponse.error("Something went wrong")
    )
}