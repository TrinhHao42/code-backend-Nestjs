import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { email, password, fullName } = registerDto;

    const isEmailExist = await this.usersService.findByEmail(email);
    if (isEmailExist) {
      throw new ConflictException('Email này đã được đăng ký sử dụng');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      fullName,
      role: UserRole.USER,
    });

    return newUser;
  }

  async registerAdmin(
    registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, fullName } = registerDto;

    const isEmailExist = await this.usersService.findByEmail(email);
    if (isEmailExist) {
      throw new ConflictException('Email này đã được đăng ký sử dụng');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await this.usersService.create({
      email,
      password: hashedPassword,
      fullName,
      role: UserRole.ADMIN,
    });

    return newAdmin;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async adminLogin(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto);

    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        'Bạn không có quyền truy cập vào khu vực Admin',
      );
    }

    return this.generateToken(user);
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return user;
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
