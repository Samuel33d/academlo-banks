import { UserServices } from '../users/users.service.js';
import { validateTransfer } from './transfer.schema.js';
import { TransferService } from './transfer.service.js';

export const processTransfer = async (req, res) => {
  try {
    const { amount, senderAccountNumber, recipientAccountNumber } = req.body;

    const { hasError, errorMessage, userData } = validateTransfer({ amount, senderAccountNumber, recipientAccountNumber })

    if (hasError) {
      return res.status(422).json({
        status: 'error',
        message: errorMessage[0].message
      })
    }

    const senderUserPromise = await UserServices.findOneAccount(
      senderAccountNumber
    );
    const recipientUserPromise = await UserServices.findOneAccount(
      recipientAccountNumber
    );

    const [senderUser, recipientUser] = await Promise.all([
      senderUserPromise,
      recipientUserPromise,
    ]);

    if (!senderUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Sender account does not exist',
      });
    }

    if (!recipientUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Recipient account does not exist',
      });
    }

    if (amount > senderUser.amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient balance',
      });
    }

    const newSenderBalance = senderUser.amount - amount;
    const newRecipientBalance = amount + recipientUser.amount;

    const updateSenderUserPromise = await UserServices.updateBalance(
      recipientUser,
      newRecipientBalance
    );
    const updateRecipientUserPromise = await UserServices.updateBalance(
      senderUser,
      newSenderBalance
    );
    const transferPromise = await TransferService.createRecordTransfer(
      amount,
      senderUser.id,
      recipientUser.id
    );

    await Promise.all([
      updateSenderUserPromise,
      updateRecipientUserPromise,
      transferPromise,
    ]);

    return res.status(200).json({
      status: 'success',
      message: 'payment was processed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internet server error',
      error: error.message,
    });
  }
};
