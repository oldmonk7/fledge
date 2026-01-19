import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { PlaidService } from './plaid.service';

@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Post('link-token/:userId')
  async createLinkToken(@Param('userId') userId: string) {
    return this.plaidService.createLinkToken(userId);
  }

  @Post('exchange-token/:userId')
  async exchangePublicToken(
    @Param('userId') userId: string,
    @Body() body: { public_token: string },
  ) {
    return this.plaidService.exchangePublicToken(userId, body.public_token);
  }

  @Get('transactions/:userId')
  async getTransactions(
    @Param('userId') userId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.plaidService.getTransactions(userId, startDate, endDate);
  }

  @Get('items/:userId')
  async getPlaidItems(@Param('userId') userId: string) {
    return this.plaidService.getPlaidItems(userId);
  }

  @Delete('items/:userId/:itemId')
  async removePlaidItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    await this.plaidService.removePlaidItem(userId, itemId);
    return { message: 'Plaid item removed successfully' };
  }
}
