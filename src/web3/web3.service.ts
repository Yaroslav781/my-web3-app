import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import erc20Abi from './erc20.abi.json';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  private web3: Web3;
  private readonly abi: any[];

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.web3 = new Web3(this.configService.get<string>('PROVIDER_URL'));
    this.abi = erc20Abi;
  }

  hashMessage(message: string): string {
    return this.web3.utils.sha3(message);
  }

  recoverSignerAddress(messageHash: string, signature: string): string {
    return this.web3.eth.accounts.recover(messageHash, signature);
  }

  async getBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const contract = new this.web3.eth.Contract(this.abi, tokenAddress);
      const balanceWei: string = await contract.methods
        .balanceOf(userAddress)
        .call();
      const decimals: number = await contract.methods
        .balanceOf(userAddress)
        .call();
      const balanceTokens = this.web3.utils.fromWei(balanceWei, decimals);
      return balanceTokens;
    } catch (error) {
      if (error.reason === 'invalid address') {
        throw new HttpException(
          'Invalid token or user address',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async sendTransaction(
    tokenAddress: string,
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string,
  ): Promise<string> {
    try {
      const contract = new this.web3.eth.Contract(this.abi, tokenAddress);
      const decimals: number = await contract.methods.decimals().call();
      const amountWei = this.web3.utils.toWei(amount.toString(), decimals);

      const nonce = await this.web3.eth.getTransactionCount(
        fromAddress,
        'pending',
      );
      const gasPrice = await this.web3.eth.getGasPrice();

      const txData = contract.methods
        .transfer(toAddress, amountWei)
        .encodeABI();
      const gasLimit = await this.web3.eth.estimateGas({
        from: fromAddress,
        to: tokenAddress,
        data: txData,
      });

      const signedTx = await this.web3.eth.accounts.signTransaction(
        {
          nonce,
          gasPrice,
          gas: gasLimit,
          to: tokenAddress,
          data: txData,
        },
        privateKey,
      );

      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );
      console.log(typeof receipt.transactionHash + '-------------');
      return receipt.transactionHash.toString();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
