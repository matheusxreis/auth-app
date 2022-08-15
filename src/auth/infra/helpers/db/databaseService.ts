import mongoose from 'mongoose';

export class DatabaseService {
  static async init () {
    mongoose.connect(`${process.env.MONGO_URL}`)
      .then(() => console.log('[DATABASE] - Connected!'))
      .catch((err) => { throw new Error(err); });
  }
}
