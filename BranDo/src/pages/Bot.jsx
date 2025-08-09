import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeftIcon, HashtagIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';
import { useStateContext } from '../context/ContextProvider'; // Importing the context to manage state

// LightBlob component
const LightBlob = ({ position, color, scale }) => {
  return (
    <Sphere args={[1, 32, 32]} scale={scale} position={position}>
      <meshStandardMaterial attach="material" color={color} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
};

// LightBlobs component with additional yellow blob
const LightBlobs = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <LightBlob position={[-6, 2, -10]} color="lightblue" scale={[8, 8, 8]} />
      <LightBlob position={[6, -3, -12]} color="pink" scale={[10, 10, 10]} />
      <LightBlob position={[-4, -1, -8]} color="lightyellow" scale={[6, 6, 6]} />
      <LightBlob position={[4, 3, -14]} color="lightpink" scale={[9, 9, 9]} />
      <LightBlob position={[0, 0, -15]} color="yellow" scale={[7, 7, 7]} /> {/* New yellow blob */}
    </>
  );
};

const Bot = () => {
    const { userToken } = useStateContext(); // Access the userToken from the context
    const [messages, setMessages] = useState([
        {
            content: "Let's Build your Brand and expand your business with BranDo! Ask me about anything.",
            role: "assistant"
        }
    ]);
    const [input, setInput] = useState('');
    const [generatingAnswer, setGeneratingAnswer] = useState(false);
    const navigate = useNavigate();

    // Check if userToken exists and redirect if not
    useEffect(() => {
        if (!userToken) {
            navigate('/signup');
        }
    }, [userToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = {
            content: input,
            role: "user"
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setGeneratingAnswer(true);

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_BRANDO_GEMINI_API_KEY}`,
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    contents: [{ parts: [{ text: userMessage.content }] }],
                },
            });
        
            const assistantMessage = {
                content: response.data.candidates[0].content.parts[0].text,
                role: "assistant"
            };

            setMessages([...newMessages, assistantMessage]);

        } catch (error) {
            console.error("Error:", error);
            setMessages([...newMessages, { role: "assistant", content: "Sorry - Something went wrong. Please try again!" }]);
        } finally {
            setGeneratingAnswer(false);
        }
    };

    const handleBackClick = () => {
        if (userToken) { // Ensure userToken exists before navigating
            navigate('/main');
        } else {
            navigate('/signup'); // Redirect to signup if the token is not present
        }
    };

    const handleSocialMediaClick = () => {
        navigate('/social-media');
    };

    return (
        <div className="relative w-full h-full">
            {/* Canvas for the animated blobs */}
            <Canvas className="absolute inset-0 z-[-1]">
                <LightBlobs />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {/* Parent Container for Navigation Icons */}
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
                    zIndex: 1000,  // Ensure this is on top
                }}
            >
                {/* Back Button */}
                <button 
                    className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-200"
                    onClick={handleBackClick}
                >
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-600">Back</span>
                </button>

                {/* Social Media Button */}
                <button 
                    className="flex items-center space-x-1 p-2 rounded-full hover:bg-blue-100 border border-blue-200"
                    onClick={handleSocialMediaClick}
                    title="Social Media Manager"
                >
                    <HashtagIcon className="h-6 w-6 text-blue-600" />
                    <span className="text-blue-600 font-medium">Social Hub</span>
                </button>
            </div>

            <motion.section 
                className='mx-auto p-5 fixed inset-0 max-w-[1024px] overflow-hidden'
                {...headContainerAnimation}
                style={{ zIndex: 2, paddingTop: '3rem' }} // Adjust padding top so content doesn't overlap with header
            >
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={slideAnimation}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginLeft: '1rem'  // Adjust margin to align with chat box
                    }}
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

                <div className="mockup-window border bg-white w-full h-[70vh] flex flex-col">
                    <div className='p-5 pb-8 flex-grow overflow-auto'>
                        {messages.length && messages.map((msg, i) => (
                            <div className={`chat ${msg.role === 'assistant' ? 'chat-start' : 'chat-end'}`} key={'chatKey' + i}>
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={msg.role === 'assistant' ? '/images/gptFemale.jpg' : '/images/anakin.webp'} alt="avatar"/>
                                    </div>
                                </div>
                                <div className="chat-bubble">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form 
                        className="form-control m-5 items-center justify-center w-full max-w-full input-container-on-top" 
                        onSubmit={handleSubmit}
                    >
                        <div className="flex items-center w-full max-w-[800px] relative">
                            {generatingAnswer && <small className='absolute -top-5 left-0.5 animate-pulse'>BranDo Assistant is generating a response...</small>}
                            <input 
                                type="text" 
                                placeholder="Type a question for BranDo Assistant, ask anything!" 
                                className="input input-bordered flex-grow" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                required 
                                disabled={generatingAnswer}
                            />
                            <button className="btn btn-square flex-shrink-0 ml-2" type="submit" disabled={generatingAnswer}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </motion.section>
        </div>
    );    
};

export default Bot;
