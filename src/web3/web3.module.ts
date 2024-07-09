import { Module } from '@nestjs/common';
import { Web3Controller } from './web3.controller';
import { Web3Service } from './web3.service';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [Web3Controller],
  providers: [Web3Service, AuthGuard],
})
export class Web3Module {}
