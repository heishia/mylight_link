import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(userId, dto);
  }
}
