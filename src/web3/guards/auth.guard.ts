import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Web3Service } from '../web3.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly web3Service: Web3Service) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const privateKey = authHeader.substring(7);

    if (!this.web3Service.isValidPrivateKey(privateKey)) {
      throw new UnauthorizedException('Invalid private key');
    }

    request.privateKey = privateKey;

    return true;
  }
}
