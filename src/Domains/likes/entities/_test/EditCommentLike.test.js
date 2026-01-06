const EditCommentLike = require('../EditCommentLike');

describe('Edit Comment Like Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // action & assert
    expect(() => new EditCommentLike(payload)).toThrowError('EDIT_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: [],
    };

    // action & assert
    expect(() => new EditCommentLike(payload)).toThrowError('EDIT_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Edit Comment Like object correctly', () => {
    // arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    // action
    const { commentId, threadId, owner } = new EditCommentLike(payload);

    // assert
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
