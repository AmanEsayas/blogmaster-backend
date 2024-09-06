import { IUser } from '../models/user.model'; // Adjust this path based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
