import React from "react";
import "./SetupPage.css";
import CharacterNumberQuestion from "../../Components/CharacterNumberQuestion/CharacterNumberQuestion";

function SetupPage(props) {
  return (
    <div className={SetupPage}>
      <div className="GetRidOfMargin">
        <div className="MainSetupSection">
          <div className="SetupSections" style={{ gridColumnStart: 1 }}>
            <h1 className="SetupHeader">New Map</h1>

            <form className="SetupForm">
              <div className="row">
                <div className="col-6">Number of rows:</div>
                <input style={{ maxWidth: "44%" }} className="col-6" />
              </div>
              <div className="row">
                <div className="col-6">Number of columns:</div>
                <input style={{ maxWidth: "44%" }} className="col-6" />
              </div>
              <CharacterNumberQuestion />
            </form>
          </div>
          <div className="SetupSections" style={{ gridColumnStart: 2 }}>
            <h1 className="SetupHeader">Saved Maps</h1>
            <CharacterNumberQuestion />
          </div>
          <div className="SetupSections" style={{ gridColumnStart: 3 }}>
            <h1 className="SetupHeader">Public Maps</h1>
            <CharacterNumberQuestion />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupPage;