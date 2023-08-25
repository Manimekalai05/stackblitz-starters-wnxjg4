class ReplyStore {
  subscribeToStore(callback) {
    store.subscribe(() => {
      //      callback(store.getState().blocks);
    });
  }


  saveDraft(api,id,data) {
    store.dispatch(
      {types: generateAPITypes('SAVEDRAFT'),
     payload: { id, data },
    callAPI:api}
    );
  })
}
