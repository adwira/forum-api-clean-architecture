const AddedReply = require('../AddedReply');

describe('Added Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
    };

    // action & assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: 123,
      content: 'this is content',
      owner: 'user-123',
    };
    // action & assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Added Reply object correctly', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      owner: 'user-123',
    };
    // action
    const addedReply = new AddedReply(payload);
    // assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
