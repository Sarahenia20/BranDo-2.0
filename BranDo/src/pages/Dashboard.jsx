import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import axiosClient from "../axios.js";
import PageComponent from "../components/PageComponent";
import DashboardCard from "../components/DashboardCard.jsx";  
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useStateContext } from '../context/ContextProvider'; // Import context for user state

export const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const { userToken } = useStateContext(); // Access the user token from context

    useEffect(() => {
        if (!userToken) {
            navigate('/signup'); // Redirect to signup if no userToken is found
            return;
        }

        setLoading(true);
        axiosClient
            .get(`/dashboard`)
            .then((res) => {
                setLoading(false);
                setData(res.data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Failed to fetch dashboard data:", error);
            });
    }, [userToken, navigate]);

    const handleBackClick = () => {
        navigate('/main');
    };

    const handleSurveysClick = () => {
        navigate('/surveys');
    };

    return (
        <PageComponent title="">
            {/* Header Section */}
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    zIndex: 100,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                }}
            >
                {/* Back Button */}
                <button 
                    className="flex items-center space-x-1 p-2 rounded-full"
                    onClick={handleBackClick}
                >
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-600">Back</span>
                </button>

                {/* Logo and Title */}
                <div className="flex items-center justify-center">
                    <img 
                        src='./BranDo.png' 
                        alt="logo" 
                        className="w-16 h-16 object-contain mr-2"  
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>

                {/* Placeholder for alignment */}
                <div style={{ width: '40px' }}></div>
            </div>

            {/* Main Dashboard Content */}
            <div style={{ paddingTop: '80px', textAlign: 'center', minHeight: '100vh' }}>
                <div>
                    {loading && <div className="flex justify-center">Loading...</div>}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
                            <DashboardCard
                                title="Total Surveys"
                                className="order-1 lg:order-2"
                                style={{ animationDelay: '0.1s' }}
                            >
                                <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                                    {data.totalSurveys}
                                </div>
                            </DashboardCard>
                            <DashboardCard
                                title="Total Answers"
                                className="order-2 lg:order-4"
                                style={{ animationDelay: '0.2s' }}
                            >
                                <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                                    {data.totalAnswers}
                                </div>
                            </DashboardCard>
                            <DashboardCard
                                title="Latest Survey"
                                className="order-3 lg:order-1 row-span-2"
                                style={{ animationDelay: '0.2s' }}
                            >
                                {data.latestSurvey && (
                                    <div>
                                        <img
                                            src={data.latestSurvey.image_url}
                                            className="w-[240px] mx-auto"
                                        />
                                        <h3 className="font-bold text-xl mb-3">
                                            {data.latestSurvey.title}
                                        </h3>
                                        <div className="flex justify-between text-sm mb-1">
                                            <div>Create Date:</div>
                                            <div>{data.latestSurvey.created_at}</div>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <div>Expire Date:</div>
                                            <div>{data.latestSurvey.expire_date}</div>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <div>Status:</div>
                                            <div>{data.latestSurvey.status ? "Active" : "Draft"}</div>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <div>Questions:</div>
                                            <div>{data.latestSurvey.questions}</div>
                                        </div>
                                        <div className="flex justify-between text-sm mb-3">
                                            <div>Answers:</div>
                                            <div>{data.latestSurvey.answers}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                                                <PencilIcon className="w-5 h-5 mr-2" />
                                                Edit Survey
                                            </TButton>

                                            <TButton to={`/surveys/${data.latestSurvey.id}/answers`} link>
                                                <EyeIcon className="w-5 h-5 mr-2" />
                                                View Answers
                                            </TButton>
                                        </div>
                                    </div>
                                )}
                                {!data.latestSurvey && (
                                    <div className="text-gray-600 text-center py-16">
                                        You don't have surveys yet
                                    </div>
                                )}
                            </DashboardCard>
                            <DashboardCard
                                title="Latest Answers"
                                className="order-4 lg:order-3 row-span-2"
                                style={{ animationDelay: '0.3s' }}
                            >
                                {data.latestAnswers?.length ? (
                                    <div className="text-left">
                                        {data.latestAnswers.map((answer) => (
                                            <a
                                                href="#"
                                                key={answer.id}
                                                className="block p-2 hover:bg-gray-100/90"
                                            >
                                                <div className="font-semibold">{answer.survey.title}</div>
                                                <small>
                                                    Answer Made at:
                                                    <i className="font-semibold">{answer.end_date}</i>
                                                </small>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-600 text-center py-16">
                                        You don't have answers yet
                                    </div>
                                )}
                            </DashboardCard>
                        </div>
                    )}
                </div>

                {/* Green Gradient Button */}
                <button
                    className="mt-12 px-8 py-4 rounded-full text-white font-bold text-lg"
                    onClick={handleSurveysClick}
                    style={{
                        background: 'linear-gradient(90deg, #00C853 0%, #B2FF59 100%)',
                        boxShadow: '0px 0px 20px rgba(0, 200, 83, 0.5)',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                    }}
                >
                    Go to Surveys
                </button>
            </div>
        </PageComponent>
    );
};

export default Dashboard;
