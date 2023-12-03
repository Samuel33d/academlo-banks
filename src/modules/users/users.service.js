import { User } from './users.model.js';

export class UserServices {
  static async create(data) {
    return await User.create(data);
  }

  static async login(data) {
    return await User.findOne({
      where: {
        status: true,
        accountNumber: data.accountNumber,
        password: data.password
      }
    })
  }

  static async findOneAccount(accountNumber) {
    return await User.findOne({
      where: {
        status: true,
        accountNumber
      }
    })
  }

  static async updateBalance(account, newAmount) {
    return await account.update({ amount: newAmount })
  }
}
