class AddThread {
  constructor(payload) {
    AddThread.verifyPayload(payload);

    const {
      title, body, date, owner,
    } = payload;

    this.title = title;
    this.body = body;
    this.date = date;
    this.owner = owner;
  }

  static verifyPayload({
    title, body, date, owner,
  }) {
    if (!title || !body || !date || !owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
