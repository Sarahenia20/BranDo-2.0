import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import PublicQuestionView from '../components/PublicQuestionView';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { headContainerAnimation, headContentAnimation, headTextAnimation } from '../config/motion';

export default function ViewAnswers() {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get(`/survey/${id}`)
      .then((response) => {
        if (response.data && response.data.data) {
          const surveyData = response.data.data;

          // Fetch answers for each question in the survey
          axiosClient.get(`/survey/${id}/answers`)
            .then((answerResponse) => {
              const answers = answerResponse.data.data;

              // Map answers to corresponding questions
              const questionsWithAnswers = surveyData.questions.map(question => {
                const matchingAnswers = answers.filter(answer => answer.survey_question_id === question.id);
                return {
                  ...question,
                  selectedAnswers: matchingAnswers.map(answer => answer.answer),
                };
              });

              setSurvey({ ...surveyData, questions: questionsWithAnswers });
              setLoading(false);
            });
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBackClick = () => {
    navigate('/surveyspace');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!survey) {
    return <div>No survey found</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Navigation and Logo Section */}
      <div
        style={{
          width: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
          zIndex: 1000,
        }}
      >
        <button 
          className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-200"
          onClick={handleBackClick}
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          <span className="text-gray-600">Back</span>
        </button>
      </div>

      <motion.section
        className='mx-auto p-5 fixed inset-0 max-w-[1024px] overflow-hidden'
        {...headContainerAnimation}
        style={{ zIndex: 2, paddingTop: '3rem' }}
      >
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={headContainerAnimation}
          style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}
        >
          <motion.img 
            src='./BranDo.png' 
            alt="logo" 
            className="w-20 h-20 object-contain"  
            {...headContentAnimation}
            style={{ marginRight: '0.5rem' }}
          />
          <motion.img 
            src='./BranDoTitle.png'  
            alt="logo title" 
            className="w-32 h-20 object-contain"  
            {...headTextAnimation}
          />
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto p-4" style={{ paddingTop: '100px' }}>
        <h1 className="text-3xl mb-4">{survey.title}</h1>
        <div>
          {survey.questions && survey.questions.length > 0 ? (
            survey.questions.map((question, index) => (
              <PublicQuestionView 
                key={question.id} 
                question={question} 
                index={index} 
                selectedAnswer={question.selectedAnswers} // Render the answers
              />
            ))
          ) : (
            <p>No questions available for this survey.</p>
          )}
        </div>
      </div>
    </div>
  );
}
