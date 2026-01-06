const AddComment = require('../AddComment');

describe('Add Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      content: 'this is a content',
      threadId: 'thread-123',
      date: '2024-06-01T07:00:00.000Z',
    };

    // action & assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const date = new Date().toISOString();
    const payload = {
      content: 'this is content',
      threadId: 'thread-123',
      owner: 123,
      date,
    };

    // action & assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // arrange
    const payload = {
      content: 'this is content',
      threadId: 'thread-123',
      owner: 'user-123',
      date: '2024-06-01T07:00:00.000Z',
    };

    // action
    const addComment = new AddComment(payload);

    // assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.date).toEqual(payload.date);
  });
});
