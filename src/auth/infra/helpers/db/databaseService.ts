import mongoose from 'mongoose';

export class DatabaseService {
  static async init () {
    try {
      await mongoose.connect('');
      console.log('[DATABASE] Connection was a success!');
    } catch (err) {
      console.log('[DATABASE] Something was wrong', err);
    }
  }
}
