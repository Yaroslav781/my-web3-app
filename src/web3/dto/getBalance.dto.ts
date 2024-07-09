import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class GetBalanceDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  tokenAddress: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  userAddress: string;
}
