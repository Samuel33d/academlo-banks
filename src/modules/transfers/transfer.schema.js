import { z } from 'zod'
import { extractValidationData } from "../../commons/utils/extractErrorData.js";

const transferSchema = z.object({
    amount: z.number({
        invalid_type_error: 'amount must be a valid format',
        required_error: 'amount is required',
    }),
    senderAccountNumber: z.string().min(6, { message: 'account number must be 6 digits' }).max(6, { message: 'account number must be 6 digits' }),
    recipientAccountNumber: z.string().min(6, { message: 'account number must be 6 digits' }).max(6, { message: 'account number must be 6 digits' })
})

export const validateTransfer = (data) => {
    const result = transferSchema.safeParse(data);

    const { hasError, data: userData, errorMessage } = extractValidationData(result)

    return { hasError, userData, errorMessage }
}