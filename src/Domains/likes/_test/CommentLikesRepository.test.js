const CommentLikesRepository = require('../CommentLikesRepository');

describe('Comment Likes Repository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // arrange
    const commentLikesRepository = new CommentLikesRepository();

    // action & assert
    await expect(commentLikesRepository.verifyCommentLike('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.addCommentLike({})).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.deleteCommentLike('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.getLikeCountByThreadId('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
