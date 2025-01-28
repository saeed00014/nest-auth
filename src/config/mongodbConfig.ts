import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongodbConfig: MongooseModuleAsyncOptions = {
  useFactory: async () => ({
    uri: process.env.MONGODB_URL,
  }),
};
