// import React, { useReducer } from "react";

type selectState = {
  selectItem: string[];
};

type Action = { type: string; data: string };

export const appReducer = (state: selectState, action: Action) => {
  switch (action.type) {
    case "ADD_SELECT":
      return { selectItem: [...state.selectItem, action.data] };
    case "REMOVE_SELECT":
      return {
        selectItem: [
          ...state.selectItem.filter((item) => item !== action.data),
        ],
      };
    default:
      return state;
  }
};
