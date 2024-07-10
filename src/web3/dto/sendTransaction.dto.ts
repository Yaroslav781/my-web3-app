import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class SendTransactionDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  token_addr: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  user_addr: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  recipient_addr: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  privateKey: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
