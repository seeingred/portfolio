import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './counter';
import storageReducer from './storage';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        storage: storageReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
export type ActionWithPayload = {
    payload: any;
}
