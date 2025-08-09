import { PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import PaginationLinks from "../components/PaginationLinks";
import SurveyListItem from "../components/SurveyListItem";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function Surveys() {
  const { showToast, userToken } = useStateContext(); // Access the user token from context
  const [surveys, setSurveys] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate('/signup'); // Redirect to signup if no userToken is found
      return;
    }

    getSurveys();
  }, [userToken, navigate]);

  const onDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      axiosClient.delete(`/survey/${id}`).then(() => {
        getSurveys();
        showToast('The survey was deleted');
      });
    }
  };

  const onPageClick = (link) => {
    getSurveys(link.url);
  };

  const getSurveys = (url) => {
    url = url || "/survey";
    setLoading(true);
    axiosClient.get(url).then(({ data }) => {
      setSurveys(data.data);
      setMeta(data.meta);
      setLoading(false);
    });
  };

  const handleBackClick = () => {
    navigate('/surveyspace'); // Redirect to the survey space
  };

  return (
    <PageComponent
      title=""
      buttons={
        <div className="flex items-center justify-between w-full">
          {/* Back Button */}
          <button 
            className="flex items-center space-x-1 p-2 rounded-full"
            onClick={handleBackClick}
            style={{ marginRight: '1rem' }}
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            <span className="text-gray-600">Back</span>
          </button>

          {/* Logo and Title */}
          <div className="flex items-center flex-1 justify-center">
            <img 
              src='./BranDo.png' 
              alt="logo" 
              className="w-10 h-10 object-contain mr-2" 
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Surveys
            </h1>
          </div>

          {/* Create New Button */}
          <TButton color="green" to="/surveys/create">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Create new
          </TButton>
        </div>
      }
    >
      {loading && <div className="text-center text-lg">Loading...</div>}
      {!loading && (
        <div>
          {surveys.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              You don't have surveys created
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {surveys.map((survey) => (
              <SurveyListItem
                survey={survey}
                key={survey.id}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
          {surveys.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
        </div>
      )}
    </PageComponent>
  );
}
