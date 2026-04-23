export interface JwtPayload {
    userId: string;
    email: string;
}

export interface RequestWithUser extends Express.Request {
    user: {
        userId: string;
        email: string;
    }
}