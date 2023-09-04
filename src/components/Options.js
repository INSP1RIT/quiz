import React from "react";

function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div className={"options"}>
      {question.options.map((option, index) => {
        return (
          <button
            className={`btn btn-option ${
              hasAnswered
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            } `}
            disabled={answer !== null}
            key={option}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
