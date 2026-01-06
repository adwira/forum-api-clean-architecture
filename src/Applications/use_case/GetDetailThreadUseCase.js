/* eslint-disable no-underscore-dangle */
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread');
const GetThread = require('../../Domains/threads/entities/GetThread');
const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/replies/entities/GetReply');
const GetCommentLikes = require('../../Domains/likes/entities/GetCommentLikes');

class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikesRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikesRepository = commentLikesRepository;
  }

  async execute(useCasePayload) {
    await GetDetailThreadUseCase.validatePayload(useCasePayload);
    const { threadId } = useCasePayload;
    const rawThread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const rawReplies = await this._replyRepository.getRepliesByThreadId(threadId);
    const rawLikes = await this._commentLikesRepository.getLikeCountByThreadId(threadId);

    const thread = {
      ...rawThread,
      date: typeof rawThread.date === 'string'
        ? rawThread.date : rawThread.date.toISOString(),
    };

    const validatedThread = new GetThread(thread);

    const commentsWithReplies = rawComments.map((comment) => {
      const validatedComment = new GetComment({
        ...comment,
        date: typeof comment.date === 'string'
          ? comment.date : comment.date.toISOString(),
      });

      const repliesForComment = rawReplies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new GetReply({
          ...reply,
          date: typeof reply.date === 'string'
            ? reply.date : reply.date.toISOString(),
        }));

      const likeData = rawLikes.find((like) => like.comment_id === comment.id);
      const validatedLike = likeData ? new GetCommentLikes(likeData) : null;
      const likeCount = validatedLike ? validatedLike.likeCount : 0;

      return {
        ...validatedComment,
        replies: repliesForComment,
        likeCount,
      };
    });

    return new GetDetailThread({
      ...validatedThread,
      comments: commentsWithReplies,
    });
  }

  static validatePayload(useCasePayload) {
    const { threadId } = useCasePayload;
    if (!threadId) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailThreadUseCase;
