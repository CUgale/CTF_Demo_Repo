import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from '../pages/login/Login.saga';
import { watchProjectSaga } from '../layouts/Layout.saga';
import { watchCreateJobSaga } from '../pages/createJob/CreateJob.saga';

export default function* rootSaga() {
  yield all([
    fork(watchAuthSaga),
    fork(watchProjectSaga),
    fork(watchCreateJobSaga),
  ]);
}