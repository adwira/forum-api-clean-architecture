const AddedComment = require('../AddedComment');

describe('Added Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'this is content',
    };

    // action & assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: 123,
      content: 'this is content',
      owner: 'user-123',
    };
    // action & assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Added Comment object correctly', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    };
    // action
    const addedComment = new AddedComment(payload);
    // assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
