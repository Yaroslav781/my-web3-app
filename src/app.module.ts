import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [Web3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
