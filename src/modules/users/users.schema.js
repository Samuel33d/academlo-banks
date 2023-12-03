import { z } from 'zod';
import { extractValidationData } from '../../commons/utils/extractErrorData.js';

const registerSchema = z.object({
    name: z
        .string({
            invalid_type_error: 'name must be a valid format',
            required_error: 'name is required',
        })
        .min(3, {
            message: 'name is too short',
        })
        .max(50, { message: 'name is too long' }),
    password: z
        .string()
        .min(8, { message: 'password must be at least 8 characters' })
        .max(20, { message: 'password is too long' }),
    accountNumber: z.number()
});

export const validateUser = (data) => {
    const result = registerSchema.safeParse(data);

    const { hasError, data: userData, errorMessage } = extractValidationData(result)

    return { hasError, userData, errorMessage }
}