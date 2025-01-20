import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch,
  Post, Query, Req, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { ApiConsumes, ApiHeaders, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { RequestWithRequestIdAndUserId, RequestWithUserId, RouteAlias } from '@project/shared/core';
import { GuidValidationPipe } from '@project/shared/pipes';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DetailPostRdo } from './rdo/detail-post.rdo';
import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { BlogPostQuery } from './blog-post.query';
import { PostIdApiParam, BlogPostApiResponse, ImageOption, parseFilePipeBuilder, Default } from './blog-post.constant';
import { BlogRequestIdApiHeader, BlogUserIdApiHeader } from './blog-post.constant.header';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('blog-post')
@ApiHeaders([BlogRequestIdApiHeader, BlogUserIdApiHeader]) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller(RouteAlias.Posts)
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  private async getPostsWithPagination(query: BlogPostQuery, userId: string, checkAuthorization: boolean): Promise<PostWithPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getAllPosts(query, userId, checkAuthorization);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(
    @Query() query: BlogPostQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithPaginationRdo> {
    const posts = await this.getPostsWithPagination(query, userId, false);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Get(`/${RouteAlias.MyPosts}`)
  public async getMyPosts(@Req() { userId }: RequestWithUserId): Promise<PostWithPaginationRdo> {
    const query: BlogPostQuery = { userId, page: Default.CURRENT_PAGE };
    const posts = await this.getPostsWithPagination(query, userId, true);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(`:${PostIdApiParam.name}`)
  public async show(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostRdo> {
    const existPost = await this.blogPostService.getPost(postId, userId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostRdo> {
    const newPost = await this.blogPostService.createPost(dto, imageFile, userId, requestId);

    return fillDto(DetailPostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Patch(`:${PostIdApiParam.name}`)
  public async update(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostRdo> {
    const updatedPost = await this.blogPostService.updatePost(postId, dto, imageFile, userId, requestId);

    return fillDto(DetailPostRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @HttpCode(BlogPostApiResponse.PostDeleted.status)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostService.deletePost(postId, userId);
  }
}
