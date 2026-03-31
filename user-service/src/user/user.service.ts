import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserReadModel } from "./models/user-read.model";
import { UserRepository } from "../common/database/user/repositories/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    async findAll(): Promise<UserReadModel[]> {
        try {
             return await this.userRepository.findAll();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findById(id: string): Promise<UserReadModel> {
        try {
            const user = await this.userRepository.findById(id);
            if(!user) 
            throw new InternalServerErrorException('User not found');
            return user;
            
        } catch (error) {
            if (error instanceof InternalServerErrorException) throw error;
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }
}