import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  status: "loading", // loading, error ,active , finished
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": {
      return { ...state, questions: action.payload, status: "ready" };
    }

    case "dataFailed": {
      return { ...state, status: "error" };
    }

    case "start": {
      return { ...state, status: "active" };
    }

    case "newAnswer": {
      const currQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currQuestion.correctOption
            ? state.points + currQuestion.points
            : state.points,
      };
    }

    default: {
      throw new Error("Action unknown");
    }
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const numQuestions = questions.length;

  useEffect(() => {
    async function fetchData() {
      try {
        const questions = await fetch("http://localhost:8001/questions");
        const result = await questions.json();
        dispatch({ type: "dataReceived", payload: result });
      } catch (e) {
        dispatch({ type: "dataFailed" });
      }
    }

    fetchData();
  }, []);
  return (
    <div className={"app"}>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions.at(index)}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}
