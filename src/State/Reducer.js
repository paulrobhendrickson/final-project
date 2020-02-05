import {
  MOVE_CHARACTER,
  CREATE_MAP,
  SET_OBJECT,
  TOGGLE_EDIT_MODE,
  SELECT_OBJECT,
  SET_CHARACTER,
  END_TURN,
  SET_TURN
} from "./Actions";
import { tileMapDirectory } from "../Utils/tileMapDirectory";

export default function reducer(state, action) {
  // console.log(state);
  switch (action.type) {
    case END_TURN: {
      let currentTurn = state.turn;
      if (currentTurn === state.characters.length - 1) {
        currentTurn = 0;
      } else {
        currentTurn++;
      }
      return {
        ...state,
        turn: currentTurn,
        movespeed: state.characters[currentTurn].movespeed,
        movespeedRemaining: state.characters[currentTurn].movespeed,
        diagMove: false
      };
    }
    case SET_TURN: {
      const currentTurn = state.turn;
      const clickedTurn = parseInt(action.payload.dataset.position);
      if (currentTurn === clickedTurn) {
        return { ...state };
      } else {
        return {
          ...state,
          turn: clickedTurn,
          movespeed: state.characters[currentTurn].movespeed,
          movespeedRemaining: state.characters[currentTurn].movespeed,
          diagMove: false
        };
      }
    }
    case MOVE_CHARACTER: {
      /********************************
       * This function keeps the player
       * inside the playable grid
       *********************************/
      function keepInGrid(object) {
        if (object.x < 1) {
          object.x = 1;
        }
        if (object.y < 1) {
          object.y = 1;
        }
        if (object.x > state.numberOfCols) {
          object.x = state.numberOfCols;
        }
        if (object.y > state.numberOfRows) {
          object.y = state.numberOfRows;
        }
        return object;
      }

      //Pulls in the tile map from state
      const tileMap = state.tileMap;

      //Pulls in the current position of all characters
      const characters = state.characters;

      //Pulls in The movement speed remaining of the current character
      let movespeedRemaining = state.movespeedRemaining;

      //If the character has no remaining move speed they cannot move.
      if (movespeedRemaining < 5) {
        return { ...state };
      }

      //Pulls in current position from state to do some math on
      let newPosition = { ...characters[state.turn].position };

      if (
        action.payload === "KeyQ" ||
        action.payload === "KeyA" ||
        action.payload === "KeyZ"
      ) {
        //Gets the value of the tile that the character is trying to move to
        try {
          let desiredTileValue = tileMap[newPosition.y - 1].charAt(
            newPosition.x - 2
          );

          //Checks the tileMapDirectory to see if it's a passable tile
          if (tileMapDirectory[desiredTileValue].passable) {
            newPosition.x--;
          }
          keepInGrid(newPosition);
        } catch {
          keepInGrid(newPosition);
        }
      }
      if (
        action.payload === "KeyE" ||
        action.payload === "KeyD" ||
        action.payload === "KeyX"
      ) {
        try {
          let desiredTileValue = tileMap[newPosition.y - 1].charAt(
            newPosition.x
          );
          if (tileMapDirectory[desiredTileValue].passable) {
            newPosition.x++;
          }
          keepInGrid(newPosition);
        } catch {
          keepInGrid(newPosition);
        }
      }
      if (
        action.payload === "KeyS" ||
        action.payload === "KeyZ" ||
        action.payload === "KeyX"
      ) {
        try {
          let desiredTileValue = tileMap[newPosition.y].charAt(
            newPosition.x - 1
          );
          if (tileMapDirectory[desiredTileValue].passable) {
            newPosition.y++;
          }
          keepInGrid(newPosition);
        } catch {
          keepInGrid(newPosition);
        }
      }
      if (
        action.payload === "KeyQ" ||
        action.payload === "KeyW" ||
        action.payload === "KeyE"
      ) {
        try {
          let desiredTileValue = tileMap[newPosition.y - 2].charAt(
            newPosition.x - 1
          );
          if (tileMapDirectory[desiredTileValue].passable) {
            newPosition.y--;
          }
          keepInGrid(newPosition);
        } catch {
          keepInGrid(newPosition);
        }
      }

      /*******************************************************
      If the the x or y position is different change the move
      speed remaining to be -5. If the x AND y are different 
      AND state.diagmove is true then set movement speed to be
      -10 and state.diagmove to be false. If x AND y are 
      different BUT state.diagmove is false movement speed
      is -5. This makes it so every other time a diagonal
      movement is made 5 or 10 movement is used.
      *******************************************************/
      if (
        newPosition.x !== characters[state.turn].position.x ||
        newPosition.y !== characters[state.turn].position.y
      ) {
        if (
          newPosition.x !== characters[state.turn].position.x &&
          newPosition.y !== characters[state.turn].position.y &&
          state.diagMove
        ) {
          movespeedRemaining = movespeedRemaining - 10;
          state.diagMove = false;
        } else {
          movespeedRemaining = movespeedRemaining - 5;
          state.diagMove = true;
        }
      } else {
        movespeedRemaining = movespeedRemaining - 5;
      }

      characters[state.turn].position = { ...newPosition };

      return {
        ...state,
        characters: characters,
        movespeedRemaining: movespeedRemaining
      };
    }
    case SET_CHARACTER: {
      const clickedPosition = {
        x: action.payload.dataset.col,
        y: action.payload.dataset.row
      };
      const charactersArray = state.characters;
      charactersArray[state.turn].position = { ...clickedPosition };
      return { ...state, characters: charactersArray };
    }
    case SELECT_OBJECT: {
      return {
        ...state,
        selectedObject: action.payload.dataset.tiletype
      };
    }

    /*************************
     * This sets the currently
     * selected object to replace
     * something on the grid
     *************************/
    case SET_OBJECT: {
      //gets current tile map
      const newTileMap = [...state.tileMap];
      //gets the row number based on the tile clicked
      const changingRow = action.payload.dataset.row - 1;
      //gets the col number based on the tile clicked
      const changingCol = action.payload.dataset.col - 1;
      //A string of what the current row looks like from state
      const currentRow = state.tileMap[changingRow];

      //The character that is currently at that place in the tilemap/
      const currentObject = currentRow.charAt(changingCol);
      //The character in state that is currently wanting to replace what is in the tilemap.
      let selectedObject = state.selectedObject;
      if (currentObject == selectedObject) {
        selectedObject = tileMapDirectory[selectedObject].next;
      }

      //The new row with the changed string
      const newRow =
        currentRow.substring(0, changingCol) +
        selectedObject +
        currentRow.substring(changingCol + 1);

      //The new tileMap updated with the new row
      newTileMap[changingRow] = newRow;
      return {
        ...state,
        tileMap: newTileMap,
        selectedObject: selectedObject
      };

      //Changes the game between play or edit mode
    }
    case TOGGLE_EDIT_MODE: {
      return { ...state, editMode: !state.editMode };
    }
    //Creates the map based on stae
    case CREATE_MAP: {
      //Temporary version of the tileMap
      const tileMapLocal = [];
      //Temporary version of what a row in the tile map looks like
      const tileMapRow = [];

      //Based on the number of columns it pushes a "0" into the row
      for (let i = 0; i < state.numberOfCols; i++) {
        tileMapRow.push("0");
      }

      //Based on the number of rows it pushes a row of 0s into the map
      for (let i = 0; i < state.numberOfRows; i++) {
        tileMapLocal.push(tileMapRow.join(""));
      }

      //Console logs to make sure it did it right, it will be the tile map and the length of the row
      console.log(tileMapLocal);
      console.log(tileMapLocal[0].length);
      return {
        ...state,
        tileMap: tileMapLocal
      };
    }
    default: {
      throw new Error("UNKOWN ACTION:", action.type);
    }
  }
}
