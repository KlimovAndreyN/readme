import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@project/shared/core';
import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  public async getComments(postId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    await this.blogPostSevice.existsPost(postId);

    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, query);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, userId: string): Promise<BlogPostCommentEntity> {
    await this.blogPostSevice.existsPost(postId);

    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId });

    await this.blogPostCommentRepository.save(commentEntity);
    await this.blogPostSevice.incrementCommentsCount(postId);

    return commentEntity;
  }

  public async deleteComment(postId: string, userId: string) {
    await this.blogPostSevice.existsPost(postId);
    await this.blogPostCommentRepository.delete(postId, userId);
    await this.blogPostSevice.decrementCommentsCount(postId);
  }
}
