import { TransferService } from '../transfers/transfer.service.js';
import { validateUser } from './users.schema.js';
import { UserServices } from './users.service.js';

export const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const accountNumber = Math.floor(Math.random() * 90000) + 100000;

    const { hasError, errorMessage, userData } = validateUser({ name, password, accountNumber })

    if (hasError) {
      return res.status(422).json({
        status: 'error',
        message: errorMessage[0].message
      })
    }

    await UserServices.create({ name, password, accountNumber })

    return res.status(201).json({
      status: 'success',
      message: 'User created succesfully! 😀',
      newUser: userData
    });

  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internet server error',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    const user = await UserServices.login({ accountNumber, password });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'AccountNumber or password not valid',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login succesfully 😀',
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internet server error',
      error,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const transfers = await TransferService.findAll(id);

    return res.status(200).json({
      id,
      transfers,
    });

  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internet server error',
      error,
    });
  }
};
