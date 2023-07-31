import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from '../Controllers/analytics.controller';
import { AnalyticDataClass, AnalyticSchema } from '../Schemas/analytics.schema';
import { AnalyticsService } from '../Services/analytics.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalyticDataClass.name, schema: AnalyticSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
