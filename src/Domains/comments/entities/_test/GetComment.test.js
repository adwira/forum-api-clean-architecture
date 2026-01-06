const GetComment = require('../GetComment');

describe('Get Comment entities', () => {
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
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: new Date('2025-08-08T07:19:09.775Z'),
      username: 'this is username',
      is_delete: 1,
    };
    // action & assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Get Comment Object correctly', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'this is username',
      is_delete: 0,
    };
    // action
    const getComment = new GetComment(payload);

    // assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.username).toEqual(payload.username);
  });

  it('should show deleted message when is_delete is 1 (number)', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'the username',
      is_delete: 1,
    };

    const { content } = new GetComment(payload);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
