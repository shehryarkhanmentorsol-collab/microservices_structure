import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserProfileResponseDto } from "./dto/response/user-profile-response.dto";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userSercive: UserService) {}


    @Get('profile')
    async getProfile(@CurrentUser() currentUser: {id: string},): Promise<UserProfileResponseDto> {
        const user = await this.userSercive.findById(currentUser.id);
        return UserProfileResponseDto.fromModel(user);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<UserProfileResponseDto>{
        const user = await this.userSercive.findById(id);
        return UserProfileResponseDto.fromModel(user)
    }
}