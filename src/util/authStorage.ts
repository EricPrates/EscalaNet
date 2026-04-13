import { AuthContext } from "../types/util.types"
import {AsyncLocalStorage} from 'node:async_hooks';

export const authStorage = new AsyncLocalStorage<AuthContext>();

export const getContext = () => authStorage.getStore();
