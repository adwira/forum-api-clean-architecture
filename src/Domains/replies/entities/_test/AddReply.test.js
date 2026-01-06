const AddReply = require('../AddReply');

describe('Add Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const date = new Date().toISOString();
    const payload = {
      content: 'this is a content',
      threadId: 'thread-123',
      date,
    };

    // action & assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const date = new Date().toISOString();
    const payload = {
      content: 'this is content',
      threadId: 'thread-123',
      commentId: ['comment-123'],
      owner: 123,
      date,
    };

    // action & assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply object correctly', () => {
    // arrange
    const date = new Date().toISOString();
    const payload = {
      content: 'this is content',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      date,
    };

    // action
    const addReply = new AddReply(payload);

    // assert
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.threadId).toEqual(payload.threadId);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.date).toEqual(payload.date);
  });
});
