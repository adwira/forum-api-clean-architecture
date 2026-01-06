const GetReply = require('../GetReply');

describe('Get Replies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: 'this is date',
      username: 'this is username',
      // is_delete: 1
    };
    // action & assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: 'this is date',
      username: 'this is username',
      is_delete: '1',
    };
    // action & assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Get Replies Object correctly', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: 'this is date',
      username: 'this is username',
      is_delete: 0,
    };
    // action
    const getReplies = new GetReply(payload);

    // assert
    expect(getReplies.id).toEqual(payload.id);
    expect(getReplies.content).toEqual(payload.content);
    expect(getReplies.date).toEqual(payload.date);
    expect(getReplies.username).toEqual(payload.username);
  });

  it('should show deleted message when is_delete is 1 (number)', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: 'this is date',
      username: 'the username',
      is_delete: 1,
    };

    const { content } = new GetReply(payload);
    expect(content).toEqual('**balasan telah dihapus**');
  });
});
