export const validateVerificationCode = (code: string) => {
    return /^[0-9]{6}$/.test(code);
};