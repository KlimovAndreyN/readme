import { IsNumber, IsOptional, IsString, Max, Min, validateOrReject } from 'class-validator';

import { EnvValidationMessage } from './mongo.messages';
import { MIN_PORT, MAX_PORT, DEFAULT_MONGODB_PORT } from './mongo.const';

export class MongoConfiguration {
  @IsString({ message: EnvValidationMessage.DBUserRequired })
  public username: string;

  @IsString({ message: EnvValidationMessage.DBPasswordRequired })
  public password: string;

  @IsString({ message: EnvValidationMessage.DBHostRequired })
  public host: string;

  @IsNumber({}, { message: EnvValidationMessage.DBPortRequired })
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  @IsOptional()
  public port: number = DEFAULT_MONGODB_PORT;

  @IsString({ message: EnvValidationMessage.DBBaseAuthRequired })
  public authBase: string;

  @IsString({ message: EnvValidationMessage.DBNameRequired })
  public databaseName: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}