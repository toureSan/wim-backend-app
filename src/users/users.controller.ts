import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

 

  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Getting profile for user:', req.user);
    return this.usersService.findByUserId(req.user.id);
  }

  
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Request() req,
  ) {
    const userProfile = await this.usersService.findOne(id);
    if (userProfile['user_id'] !== req.user.sub) {
      throw new UnauthorizedException(
        'Vous ne pouvez modifier que votre propre profil',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userProfile = await this.usersService.findOne(id);
    if (userProfile['user_id'] !== req.user.sub) {
      throw new UnauthorizedException(
        'Vous ne pouvez supprimer que votre propre profil',
      );
    }
    return this.usersService.remove(id);
  }
}
