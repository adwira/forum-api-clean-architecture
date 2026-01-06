const AddThread = require('../AddThread');

describe('Add Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      title: 'this is title',
      body: 'this is thread body',
      owner: 'user-123',
    };
    // action & assert
    expect(() => new AddThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // arrange
    const payload = {
      title: 'this is title',
      body: 123,
      date: 'CURRENT_TIMESTAMP',
      owner: 'user-123',
    };

    // action & assert
    expect(() => new AddThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Add Thread object correctly', () => {
    // arrange
    const payload = {
      title: 'this is title',
      body: 'this is thread body',
      date: 'CURRENT_TIMESTAMP',
      owner: 'user-123',
    };
    // action
    const {
      title, body, date, owner,
    } = new AddThread(payload);

    // assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(owner).toEqual(payload.owner);
  });
});
