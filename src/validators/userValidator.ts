import { User } from "../model/user";

export const validateUser = (user: User) => {
    const errors = [];

    if (user.firstName === "") errors.push("firstName is empty");
    if (user.lastName === "") errors.push("lastName is empty");
    if (user.email === "") errors.push("email is empty");
    if (user.password.length < 8) errors.push("password must be at least 8 characters long");

    if(!/[A-Z]/.test(user.password))
        errors.push("password must contain at least one capital letter");

    if(!/[a-z]/.test(user.password))
        errors.push("password must contain at least one lowercase letter");

    if(!/[!@#$%^&*,.?:|]/.test(user.password))
        errors.push("password must contain at least one special character");
    if(!/[0-9]/.test(user.password))
        errors.push("password must contain at least one number");
    if(!/@/.test(user.email))
        errors.push("email must contain @");

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    };
};
