import {
  BadRequestException,
  Body,
  Headers,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetBalanceDto } from './dto/getBalance.dto';
import { SendTransactionDto } from './dto/sendTransaction.dto';
import { Web3Service } from './web3.service';

@Controller()
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('balance/:tokenAddress/:userAddress')
  @UsePipes(new ValidationPipe())
  async getBalance(@Param() params: GetBalanceDto): Promise<string> {
    const { tokenAddress, userAddress } = params;
    const balance = await this.web3Service.getBalance(
      tokenAddress,
      userAddress,
    );
    return balance;
  }

  @Post('send')
  @UsePipes(new ValidationPipe())
  async sendTransaction(
    @Body() sendTransactionDto: SendTransactionDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<{ transactionHash: string }> {
    const { token_addr, user_addr, recipient_addr, amount, signature } =
      sendTransactionDto;
    const message = this.web3Service.hashMessage(user_addr);
    const signerAddress = this.web3Service.recoverSignerAddress(
      message,
      signature,
    );
    if (signerAddress.toLowerCase() !== user_addr.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    try {
      const transactionHash = await this.web3Service.sendTransaction(
        token_addr,
        user_addr,
        recipient_addr,
        amount,
        authHeader,
      );
      return { transactionHash };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
