import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import state from '../store';
import { AuthButton } from '../components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation // Import slideAnimation correctly here
} from '../config/motion';
import '../styles.css';  // Ensure the correct path

export const Landing = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    state.intro = false;
  };

  const handleAnimationComplete = () => {
    if (!snap.intro) {
      navigate('/signup');
    }
  };

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section 
          className="home relative flex justify-between items-center landing-background" 
          style={{ paddingLeft: '0.5rem', marginLeft: '0' }} 
          {...slideAnimation('left')}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Blob shapes added directly in the JSX */}
          <div className="decorative-shape1"></div>
          <div className="decorative-shape2"></div>
          <div className="decorative-shape3"></div>
          
          <motion.header className="flex items-center" {...slideAnimation("down")}>
            <img 
              src='./BranDo.png'
              alt="logo"
              className="w-20 h-20 object-contain"  
            />
            <img 
              src='./BranDoTitle.png'  
              alt="logo title"
              className="w-24 h-24 object-contain ml-0.5"
            />
          </motion.header>

          <div className="flex w-full items-center">
            {/* Left Container for Text */}
            <motion.div className="flex-grow max-w-1/2" {...headContainerAnimation}>
              <motion.div {...headTextAnimation}>
                <h1 className="head-text">
                  BranDo <br className="xl:block hidden" />INC.
                </h1>
                <p className="max-w-md font-normal text-gray-600 text-base mt-2">
                  <strong> We bring your Brand Idea to life by Surveys & Merch Design.
                  Build your Business, unleash your imagination & define your own style.</strong>
                </p>
                <AuthButton 
                  type="filled"
                  title="Start Now"
                  handleClick={handleStartNowClick}
                  customStyles="w-fit px-4 py-2.5 font-bold text-sm mt-4"
                />
              </motion.div>
            </motion.div>

            {/* Right Container for Image with Bouncy Animation */}
            <motion.div 
              className="flex-none max-w-1/2 ml-auto"  
              {...headContainerAnimation}
            >
              <motion.img 
                src='./landing.png'
                alt="landing"
                className="w-full h-auto object-contain"  
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                  duration: 0.8,
                }}
              />
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
