import { RefreshToken } from "../model/refreshToken";

export const validateRefreshToken = (refreshToken: RefreshToken) => {
    const errors = [];

    if (refreshToken.token === "") errors.push("token is empty");
    if (refreshToken.email === "") errors.push("email is empty");
    if (refreshToken.firstName === "") errors.push("firstName is empty");
    if (refreshToken.lastName === "") errors.push("lastName is empty");

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    };
};