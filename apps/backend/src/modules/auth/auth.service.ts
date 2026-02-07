import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../user/repositories/user.repository';
import { User } from '../user/schemas/user.schema';
import { UserRole, UserStatus } from '../user/enums';
import { LoggerService } from '../../common/logger/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponse, JwtPayload } from './types/auth.types';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    this.logger.log('User registration attempt', 'AuthService', {
      email: registerDto.email,
    });

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: false,
    });

    this.logger.business('user_registered', {
      userId: user.id,
      email: user.email,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      this.logger.log('User login attempt started', 'AuthService', {
        email: loginDto.email,
        timestamp: new Date().toISOString(),
      });

      // Find user
      this.logger.log('Looking up user by email', 'AuthService', {
        email: loginDto.email,
      });
      const user = await this.userRepository.findByEmail(loginDto.email);
      if (!user) {
        this.logger.warn('User not found', 'AuthService', {
          email: loginDto.email,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Convert user._id to string if needed
      const userId = user._id?.toString() || user.id?.toString() || String(user.id);
      
      this.logger.log('User found', 'AuthService', {
        userId,
        email: user.email,
        role: user.role,
        status: user.status,
        hasPasswordHash: !!user.passwordHash,
      });

      // Check if user has password (registered via email)
      if (!user.passwordHash) {
        this.logger.warn('User has no password hash', 'AuthService', {
          userId,
          email: user.email,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      this.logger.log('Verifying password', 'AuthService', {
        userId,
        email: user.email,
      });
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      this.logger.log('Password verification result', 'AuthService', {
        userId,
        email: user.email,
        isValid: isPasswordValid,
      });
      if (!isPasswordValid) {
        this.logger.warn('Invalid password', 'AuthService', {
          userId,
          email: user.email,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      this.logger.log('Checking user status', 'AuthService', {
        userId,
        email: user.email,
        status: user.status,
      });
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.warn('User account is not active', 'AuthService', {
          userId,
          email: user.email,
          status: user.status,
        });
        throw new UnauthorizedException('User account is not active');
      }

      // Generate tokens
      this.logger.log('Generating tokens', 'AuthService', {
        userId,
        email: user.email,
      });
      const tokens = await this.generateTokens(user);
      this.logger.log('Tokens generated', 'AuthService', {
        userId,
        email: user.email,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

      // Create session
      this.logger.log('Creating session', 'AuthService', {
        userId,
        email: user.email,
      });
      await this.createSession(userId, tokens.refreshToken);
      this.logger.log('Session created', 'AuthService', {
        userId,
        email: user.email,
      });

      // Update last login
      this.logger.log('Updating last login timestamp', 'AuthService', {
        userId,
        email: user.email,
      });
      await this.userRepository.updateLastLogin(userId);

      this.logger.business('user_logged_in', {
        userId,
        email: user.email,
        role: user.role,
      });

      this.logger.log('Login completed successfully', 'AuthService', {
        userId,
        email: user.email,
        role: user.role,
      });

      return {
        ...tokens,
        user: {
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors
      this.logger.error(
        'Unexpected error during login',
        error instanceof Error ? error.stack : String(error),
        'AuthService',
        {
          email: loginDto.email,
          errorName: error instanceof Error ? error.name : 'UnknownError',
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );

      // Re-throw as internal server error
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if session exists
      const session = await this.sessionRepository.findByRefreshToken(
        refreshTokenDto.refreshToken,
      );
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await this.sessionRepository.deleteByRefreshToken(
          refreshTokenDto.refreshToken,
        );
        throw new UnauthorizedException('Refresh token expired');
      }

      // Get user
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Delete old session and create new one
      await this.sessionRepository.deleteByRefreshToken(
        refreshTokenDto.refreshToken,
      );
      await this.createSession(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    await this.sessionRepository.deleteByRefreshToken(refreshToken);
    this.logger.log('User logged out', 'AuthService');
  }

  /**
   * Logout all sessions for a user
   */
  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId);
    this.logger.log('All sessions logged out', 'AuthService', { userId });
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    const accessTtl = this.configService.get<string>('jwt.accessTtl') || '15m';
    const refreshTtl = this.configService.get<string>('jwt.refreshTtl') || '7d';

    // Parse TTL to seconds
    const accessTtlSeconds = this.parseTtlToSeconds(accessTtl);
    const refreshTtlSeconds = this.parseTtlToSeconds(refreshTtl);

    // Convert user ID to string
    const userId = user._id?.toString() || user.id?.toString() || String(user.id);

    const accessPayload: JwtPayload = {
      sub: userId,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: accessSecret,
      expiresIn: accessTtl,
    } as any);

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: refreshSecret,
      expiresIn: refreshTtl,
    } as any);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTtlSeconds,
    };
  }

  /**
   * Create a session
   */
  private async createSession(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTtl = this.configService.get<string>('jwt.refreshTtl') || '7d';
    const expiresAt = new Date();
    expiresAt.setTime(
      expiresAt.getTime() + this.parseTtlToSeconds(refreshTtl) * 1000,
    );

    await this.sessionRepository.create({
      userId,
      refreshToken,
      expiresAt,
    });
  }

  /**
   * Parse TTL string to seconds
   */
  private parseTtlToSeconds(ttl: string): number {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900;
    }
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
