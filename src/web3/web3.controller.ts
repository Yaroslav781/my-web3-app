import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@app/web3/guards/auth.guard';

@Controller()
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('balance/:tokenAddress/:userAddress')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async sendTransaction(
    @Body() sendTransactionDto: SendTransactionDto,
  ): Promise<{ transactionHash: string }> {
    const { token_addr, user_addr, recipient_addr, amount } =
      sendTransactionDto;
    const transactionHash = await this.web3Service.sendTransaction(
      token_addr,
      user_addr,
      recipient_addr,
      amount,
      sendTransactionDto.privateKey,
    );
    return { transactionHash };
  }
}
