import { combineReducers, configureStore } from "@reduxjs/toolkit";
import configReducer from "./slices/configSlice";
import miscReducer from "./slices/miscSlice";
import serverStateReducer from "./slices/serverStateReducer";
import stateReducer from "./slices/stateSlice";
import uiStateReducer from "./slices/uiStateSlice";

import {
  ChatHistory,
  ContextItemWithId,
  ContextProviderDescription,
  ContinueConfig,
  SlashCommandDescription,
} from "core";
import { createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RootStore {
  state: {
    history: ChatHistory;
    contextItems: ContextItemWithId[];
    active: boolean;
    config: ContinueConfig;
    title: string;
    sessionId: string;
    defaultModelTitle: string;
  };

  config: {
    vscMachineId: string | undefined;
  };
  misc: {
    takenAction: boolean;
    serverStatusMessage: string;
  };
  uiState: {
    bottomMessage: JSX.Element | undefined;
    bottomMessageCloseTimeout: NodeJS.Timeout | undefined;
    displayBottomMessageOnBottom: boolean;
    showDialog: boolean;
    dialogMessage: string | JSX.Element;
    dialogEntryOn: boolean;
  };
  serverState: {
    meilisearchUrl: string | undefined;
    slashCommands: SlashCommandDescription[];
    selectedContextItems: any[];
    config: ContinueConfig;
    contextProviders: ContextProviderDescription[];
    savedContextGroups: any[]; // TODO: Context groups
    indexingProgress: number;
  };
}

const rootReducer = combineReducers({
  state: stateReducer,
  config: configReducer,
  misc: miscReducer,
  uiState: uiStateReducer,
  serverState: serverStateReducer,
});

const windowIDTransform = (windowID) =>
  createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => {
      return { [windowID]: inboundState };
    },
    // transform state being rehydrated
    (outboundState, key) => {
      return outboundState[windowID] || {};
    }
  );

const persistConfig = {
  key: "root",
  storage,
  // transforms: [
  //   windowIDTransform((window as any).windowId || "undefinedWindowId"),
  // ],
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export const persistor = persistStore(store);
