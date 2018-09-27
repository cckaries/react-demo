import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* initIngredientSaga(action) {
  try {
    const res = yield axios.get('https://react-my-burger-2ab50.firebaseio.com/ingredients.json')
    yield put(actions.setIngredients(res.data));
  } catch (err) {
    yield put(actions.fetchIngredientsFailed());
  }
}