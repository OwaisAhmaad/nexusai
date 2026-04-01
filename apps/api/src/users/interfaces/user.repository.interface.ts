import { UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  update(id: string, data: UpdateUserDto): Promise<UserDocument | null>;
}
