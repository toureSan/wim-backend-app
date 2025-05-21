import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Received create user request with data:', createUserDto);
    if (createUserDto.role === 'prestataire') {
      this.validateProviderData(createUserDto);
    }

    // Validate service rate if provided
    if (createUserDto.service_rate !== undefined && createUserDto.service_rate <= 0) {
      throw new BadRequestException('Service rate must be greater than 0');
    }

    // Validate service radius if provided
    if (createUserDto.service_radius !== undefined && createUserDto.service_radius <= 0) {
      throw new BadRequestException('Service radius must be greater than 0');
    }

    try {
      const result = await this.usersService.create(createUserDto);
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  private validateProviderData(createUserDto: CreateUserDto) {
    const requiredFields = [
      'service_description',
      'service_rate',
      'service_radius',
      'experience_description',
      'services',
      'start_date'
    ];

    for (const field of requiredFields) {
      if (!createUserDto[field]) {
        throw new BadRequestException(`Le champ ${field} est obligatoire pour un prestataire`);
      }
    }

    if (!createUserDto.services || createUserDto.services.length === 0) {
      throw new BadRequestException('Un prestataire doit proposer au moins un service');
    }

    if (createUserDto.service_rate && createUserDto.service_rate <= 0) {
      throw new BadRequestException('Le tarif horaire doit être supérieur à 0');
    }

    if (createUserDto.service_radius && createUserDto.service_radius <= 0) {
      throw new BadRequestException('Le rayon de service doit être supérieur à 0');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Getting profile for user:', req.user);
    return this.usersService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
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
    @Request() req
  ) {
    const userProfile = await this.usersService.findOne(id);
    if (userProfile['user_id'] !== req.user.sub) {
      throw new UnauthorizedException('Vous ne pouvez modifier que votre propre profil');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req
  ) {
    const userProfile = await this.usersService.findOne(id);
    if (userProfile['user_id'] !== req.user.sub) {
      throw new UnauthorizedException('Vous ne pouvez supprimer que votre propre profil');
    }
    return this.usersService.remove(id);
  }
} 