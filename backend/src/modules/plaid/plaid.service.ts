import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } from 'plaid';
import { PlaidItem } from '../../entities/plaid-item.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PlaidService {
  private plaidClient: PlaidApi;
  private clientId: string;
  private secret: string;

  constructor(
    @InjectRepository(PlaidItem)
    private plaidItemRepository: Repository<PlaidItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    // Get credentials from ConfigService (which loads from .env)
    this.clientId = this.configService.get<string>('PLAID_CLIENT_ID') || '';
    this.secret = this.configService.get<string>('PLAID_SECRET') || '';

    if (!this.clientId || !this.secret) {
      console.warn('Plaid credentials not found. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables in .env file.');
      console.warn('Current values:', { 
        clientId: this.clientId ? '***set***' : 'missing', 
        secret: this.secret ? '***set***' : 'missing' 
      });
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox, // Using sandbox/test environment
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
      },
    });

    this.plaidClient = new PlaidApi(configuration);
  }

  private validateCredentials(): void {
    if (!this.clientId || !this.secret) {
      throw new BadRequestException(
        'Plaid credentials not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables in your .env file.'
      );
    }
  }

  async createLinkToken(userId: string): Promise<{ link_token: string }> {
    this.validateCredentials();

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const request = {
        user: {
          client_user_id: userId,
        },
        client_name: 'Fledge FSA',
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
      };

      const response = await this.plaidClient.linkTokenCreate(request);
      return { link_token: response.data.link_token };
    } catch (error: any) {
      console.error('Error creating link token:', error);
      const errorMessage = error?.response?.data?.error_message || error?.message || 'Failed to create link token';
      throw new BadRequestException(`Failed to create link token: ${errorMessage}`);
    }
  }

  async exchangePublicToken(userId: string, publicToken: string): Promise<PlaidItem> {
    this.validateCredentials();

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Exchange public token for access token
      const response = await this.plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Get item information
      const itemResponse = await this.plaidClient.itemGet({
        access_token: accessToken,
      });

      const item = itemResponse.data.item;
      const institutionId = item.institution_id;

      // Get institution information
      let institutionName = '';
      if (institutionId) {
        try {
          const instResponse = await this.plaidClient.institutionsGetById({
            institution_id: institutionId,
            country_codes: [CountryCode.Us],
          });
          institutionName = instResponse.data.institution.name;
        } catch (err) {
          console.error('Error fetching institution:', err);
        }
      }

      // Get accounts
      const accountsResponse = await this.plaidClient.accountsGet({
        access_token: accessToken,
      });

      // Check if item already exists
      const existingItem = await this.plaidItemRepository.findOne({
        where: { itemId },
      });

      if (existingItem) {
        // Update existing item
        existingItem.accessToken = accessToken;
        existingItem.institutionId = institutionId;
        existingItem.institutionName = institutionName;
        existingItem.accounts = accountsResponse.data.accounts;
        existingItem.status = 'active';
        return await this.plaidItemRepository.save(existingItem);
      }

      // Create new item
      const plaidItem = this.plaidItemRepository.create({
        userId,
        itemId,
        accessToken,
        institutionId,
        institutionName,
        accounts: accountsResponse.data.accounts,
        status: 'active',
      });

      return await this.plaidItemRepository.save(plaidItem);
    } catch (error: any) {
      console.error('Error exchanging public token:', error);
      const errorMessage = error?.response?.data?.error_message || error?.message || 'Failed to exchange public token';
      throw new BadRequestException(`Failed to exchange public token: ${errorMessage}`);
    }
  }

  async getTransactions(userId: string, startDate?: string, endDate?: string): Promise<any> {
    this.validateCredentials();

    const plaidItems = await this.plaidItemRepository.find({
      where: { userId, status: 'active' },
    });

    if (plaidItems.length === 0) {
      throw new NotFoundException('No Plaid items found for this user');
    }

    // Use the first active item (can be extended to support multiple items)
    const plaidItem = plaidItems[0];

    // Default to last 30 days if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    // Format dates as YYYY-MM-DD for Plaid API
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    try {
      const response = await this.plaidClient.transactionsGet({
        access_token: plaidItem.accessToken,
        start_date: formatDate(start),
        end_date: formatDate(end),
      });

      return {
        transactions: response.data.transactions,
        total_transactions: response.data.total_transactions,
        accounts: response.data.accounts,
      };
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      const errorMessage = error?.response?.data?.error_message || error?.message || 'Failed to fetch transactions';
      throw new BadRequestException(`Failed to fetch transactions: ${errorMessage}`);
    }
  }

  async getPlaidItems(userId: string): Promise<PlaidItem[]> {
    return await this.plaidItemRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async removePlaidItem(userId: string, itemId: string): Promise<void> {
    const plaidItem = await this.plaidItemRepository.findOne({
      where: { userId, itemId },
    });

    if (!plaidItem) {
      throw new NotFoundException('Plaid item not found');
    }

    try {
      // Remove item from Plaid
      await this.plaidClient.itemRemove({
        access_token: plaidItem.accessToken,
      });

      // Mark as inactive in database
      plaidItem.status = 'inactive';
      await this.plaidItemRepository.save(plaidItem);
    } catch (error) {
      console.error('Error removing Plaid item:', error);
      // Still mark as inactive even if Plaid removal fails
      plaidItem.status = 'inactive';
      await this.plaidItemRepository.save(plaidItem);
    }
  }
}
