import React from "react";
import { cloneDeep } from "lodash";

export interface IStore {
  notifications: Array<{
    message: string;
    time: number;
  }>;
  timeEntry?: string;
  wumpaHuntRace?: number;
  times: Array<number | undefined>;
}

export const defaultStore: IStore = {
  notifications: [],
  times: []
};

export interface IStoreContext {
  store: IStore;
  setStore: (store: Partial<IStore>) => void;
}

const context: IStoreContext = {
  store: cloneDeep(defaultStore),
  setStore: () => {}
};

export default React.createContext(context);
