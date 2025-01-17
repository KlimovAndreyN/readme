import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { getAuthorizationHeader } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { RequestProperty } from '@project/shared/core';
import { TokenPayloadRdo } from '@project/account/authentication';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const url = `${this.apiOptions.accountServiceUrl}/check`;
    const { data } = await this.httpService.axiosRef.post<TokenPayloadRdo>(url, {}, { headers: getAuthorizationHeader(request) });
    const userId = data.sub;

    request[RequestProperty.User] = data; // для UsersController.checkToken
    request[RequestProperty.UserId] = userId; // для всех
    Logger.log(`[${request.method}: ${request.url}]: ${RequestProperty.UserId} is ${userId}`);

    return true;
  }
}
