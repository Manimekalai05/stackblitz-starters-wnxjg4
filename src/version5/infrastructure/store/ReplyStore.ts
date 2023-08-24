class ReplyStore {
  subscribeToBlock(callback) {
    store.subscribe(() => {
      console.log('BlockSt', store.getState().blocks);
      //      callback(store.getState().blocks);
    });
  }

  getBlocks() {
    return store.getState().blocks;
  }

  saveDraft(api,id,data) {
    store.dispatch(
      {types: generateAPITypes('SAVEDRAFT'),
     payload: { id, data },
    callAPI:api}
    );
  })
}
