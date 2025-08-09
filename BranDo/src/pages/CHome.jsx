import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { CustomButton } from '../components';
import { 
  headContainerAnimation, 
  headContentAnimation, 
  headTextAnimation, 
  slideAnimation 
} from '../config/motion';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react'; // Import useEffect for running side effects
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useStateContext } from '../context/ContextProvider'; // Import context for user state

const CHome = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const { userToken } = useStateContext(); // Access the user token from context

  useEffect(() => {
    if (!userToken) {
      navigate('/signup'); // Redirect to signup if no userToken is found
    }
  }, [userToken, navigate]);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home relative" {...slideAnimation('left')}>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-40 w-64 h-64 rounded-full absolute top-10 left-10 filter blur-2xl"></div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 opacity-40 w-64 h-64 rounded-full absolute top-32 right-10 filter blur-2xl"></div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 opacity-40 w-64 h-64 rounded-full absolute bottom-10 left-1/3 filter blur-2xl"></div>
          </div>
      
          <motion.header className="relative z-10">
            <div className="relative" style={{ pointerEvents: 'auto' }}>
              <ArrowLeftIcon 
                className="w-8 h-8 cursor-pointer absolute z-50" 
                style={{ top: '20px', left: '20px', pointerEvents: 'auto' }} 
                onClick={() => (window.location.href = '/main')}
              />
              <motion.img 
                src="./BranDo.png" 
                alt="logo" 
                className="w-24 h-24 object-contain ml-16"
              />
            </div>
          </motion.header>
      
          <motion.div className="home-content z-10 relative" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                TShirt<br className="xl:block hidden" /> Studio
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-gray-600 text-base">
                Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Unleash your imagination</strong>{" "} and get your band merch started.
              </p>
              <CustomButton 
                type="filled"
                title="Customize It"
                handleClick={() => state.intro = false}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default CHome;
