import { injectable, inject } from 'tsyringe';
import { Types } from 'mongoose';
import { UserRepository } from '../repositories/UserRepository';
import { BcryptUtils } from '../utils/bcrypt';
import { JWTUtils, JWTPayload } from '../utils/jwt';
import { IUser } from '../models/User';
import { RegisterUserDto, LoginDto } from '../dtos';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
  };
}

@injectable()
export class AuthService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {}

  /**
   * Registra un nuevo usuario
   * @param dto - Datos del usuario a registrar
   * @returns Usuario creado y token JWT
   */
  async register(dto: RegisterUserDto): Promise<AuthResponse> {
    // Verificar que el email no esté en uso
    const existingUserByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingUserByEmail) {
      throw new Error('Email already in use');
    }

    // Verificar que el documento no esté en uso
    const existingUserByDocument = await this.userRepository.findByDocument(dto.documentNumber);
    if (existingUserByDocument) {
      throw new Error('Document number already in use');
    }

    // Hash del password
    const passwordHash = await BcryptUtils.hash(dto.password);

    // Crear usuario
    const user = await this.userRepository.create({
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      socioeconomicStratum: dto.socioeconomicStratum,
        regionalId: new Types.ObjectId(dto.regionalId), // ← Aquí está la solución
    role: 'user', // Por defecto todos los registros son usuarios normales
    });

    // Generar token JWT
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Inicia sesión de un usuario
   * @param dto - Credenciales de login
   * @returns Token JWT y datos del usuario
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Verificar password
    const isValidPassword = await BcryptUtils.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generar token JWT
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Valida un token JWT y retorna el payload
   * @param token - Token JWT a validar
   * @returns Payload del token
   */
  validateToken(token: string): JWTPayload {
    return JWTUtils.verifyToken(token);
  }

  /**
   * Genera un token JWT para un usuario
   * @param user - Usuario para el que se genera el token
   * @returns Token JWT
   */
  private generateToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
    };

    return JWTUtils.generateToken(payload);
  }

  /**
   * Obtiene un usuario por su ID
   * @param userId - ID del usuario
   * @returns Usuario encontrado
   */
  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    return user;
  }
}
