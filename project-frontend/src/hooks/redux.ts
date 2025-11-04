import { useDispatch, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/reducers/rootReducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
