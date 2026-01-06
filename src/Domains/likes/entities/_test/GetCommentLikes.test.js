/* eslint-disable camelcase */
const GetCommentLikes = require('../GetCommentLikes');

describe('Get Comment Likes entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      comment_id: 'comment-123',
    };
    // action & assert
    expect(() => new GetCommentLikes(payload)).toThrowError('GET_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('shoult to throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      comment_id: 'comment-123',
      likeCount: '12',
    };
    // action & assert
    expect(() => new GetCommentLikes(payload)).toThrowError('GET_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Get Comment Likes object correctly', () => {
    // arrange
    const payload = {
      comment_id: 'comment-123',
      likeCount: 12,
    };
    // action
    const { likeCount } = new GetCommentLikes(payload);

    // assert
    expect(likeCount).toEqual(payload.likeCount);
  });
});
