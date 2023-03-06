import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorators';
import { IdValidationPipes } from '../pipes/id-validation.pipes';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipes) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
  @UseGuards(JwtGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipes) productId: string,
    @UserEmail() email: string,
  ) {
    return await this.reviewService.findByProductId(productId);
  }
}
