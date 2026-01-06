const AddedThread = require('../AddedThread');

describe('Added Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'thread-123',
      title: 'this is thread title',
    };
    // action & assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // arrange
    const payload = {
      id: 'thread-123',
      title: 'this is thread title',
      owner: 123,
    };
    // action & assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Added Thread object correctly', () => {
    // arrange
    const payload = {
      id: 'thread-123',
      title: 'this is thread title',
      owner: 'user-123',
    };

    // action
    const { id, title, owner } = new AddedThread(payload);

    // assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
