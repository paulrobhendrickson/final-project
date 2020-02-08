import React, { createContext, useReducer, useEffect } from "react";

// import CreateState from "./CreateState";
import Reducer from "./Reducer";
import * as Actions from "./Actions";

// import UseKeyboard from "../Hooks/UseKeyboard";

export const GameContext = createContext();

// const initialState = CreateState;
const initialState = {
  editMode: false,
  mapPosition: { left: 0, top: 0 },
  dimensions: {
    x: 32,
    y: 32
  },
  selectedObject: 1,
  turn: 0,
  movespeed: 0,
  diagMove: false,
  movespeedRemaining: 30,
  characters: [
    {
      name: "Player",
      movespeed: "30",
      initiative: 0,
      color: "Red",
      position: {
        x: 1,
        y: 1
      }
    },
    {
      name: "Player",
      movespeed: "30",
      initiative: 0,
      color: "Green",
      position: {
        x: 1,
        y: 1
      }
    }
  ],
  tileMap: [
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000"
  ]
};

export default function GameProvider(props) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  function HandleKey(e) {
    dispatch({
      type: Actions.MOVE_CHARACTER,
      payload: e.code
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", HandleKey);
    return () => window.removeEventListener("keydown", HandleKey);
  }, []);

  function handleClick(e) {
    try {
      e.path.map(x => {
        if (x.dataset.clickable) {
          dispatch({
            type: x.dataset.action,
            payload: x
          });
        }
      });
    } catch {
      return;
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const value = { state, dispatch, Actions };

  return (
    <>
      <GameContext.Provider value={value}>
        {props.children}
      </GameContext.Provider>
    </>
  );
}
