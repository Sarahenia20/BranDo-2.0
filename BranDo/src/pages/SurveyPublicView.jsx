import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import PublicQuestionView from "../components/PublicQuestionView";

export default function SurveyPublicView() {
  const [answers, setAnswers] = useState({});
  const [surveyFinished, setSurveyFinished] = useState(false);
  const [survey, setSurvey] = useState({
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`survey/get-by-slug/${slug}`)
      .then(({ data }) => {
        setLoading(false);
        setSurvey(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  function answerChanged(questionId, value) {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
    console.log(`Question ID: ${questionId}, Answer: ${value}`);
  }

  function onSubmit(ev) {
    ev.preventDefault();

    console.log(answers);
    axiosClient
      .post(`/survey/${survey.id}/answer`, {
        answers,
      })
      .then(() => {
        setSurveyFinished(true);
      })
      .catch((error) => {
        console.error("Failed to submit answers:", error);
      });
  }

  return (
    <div>
      {loading && <div className="flex justify-center">Loading..</div>}
      {!loading && (
        <form onSubmit={onSubmit} className="container mx-auto p-4">
          <div className="grid grid-cols-6">
            <div className="mr-4">
              {survey.image_url && (
                <img src={survey.image_url} alt="Survey" />
              )}
            </div>

            <div className="col-span-5">
              <h1 className="text-3xl mb-3">{survey.title}</h1>
              <p className="text-gray-500 text-sm mb-3">
                Expire Date: {survey.expire_date}
              </p>
              <p className="text-gray-500 text-sm mb-3">{survey.description}</p>
            </div>
          </div>

          {surveyFinished && (
            <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
              Thank you for participating in the survey
            </div>
          )}
          {!surveyFinished && (
            <>
              <div>
                {survey.questions.map((question, index) => (
                  <PublicQuestionView
                    key={question.id}
                    question={question}
                    index={index}
                    selectedAnswer={answers[question.id] || ""}
                    answerChanged={(val) => answerChanged(question.id, val)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
