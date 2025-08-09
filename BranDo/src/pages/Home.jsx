import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { motion } from 'framer-motion';
import { Menu, MenuItem, Typography } from '@mui/material';
import { UserCircleIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios'; // Import axiosClient for making API calls
import { useStateContext } from '../context/ContextProvider'; // Import context for user state

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, userToken, setUserToken } = useStateContext(); // Access currentUser from context

  useEffect(() => {
    if (!userToken) {
      console.log("No token found, redirecting to signup.");
      navigate('/signup');
      return;
    }

    console.log("Token found, staying on the home page.");
    console.log("Current User:", currentUser);
    console.log("User Token:", userToken);

    // Only fetch user data if `currentUser` is not already populated
    if (!currentUser || Object.keys(currentUser).length === 0) {
      axiosClient.get('/me')
        .then(({ data }) => {
          console.log("Fetched User:", data);
          setCurrentUser(data);
        })
        .catch(() => {
          // Handle error, possibly log out or reset token
          setCurrentUser({});
          setUserToken(null);
          navigate('/signup');
        });
    }
  }, [userToken, currentUser, setCurrentUser, setUserToken, navigate]);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    setAnchorEl(null);
    navigate('/settings'); // Navigate to the Settings page
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout'); // Optionally, you can call an API to invalidate the token on the server side.
      setCurrentUser({});
      setUserToken(null);
      localStorage.removeItem('userToken'); // Ensure token is removed from local storage
      window.location.replace('/signup'); // Use replace to prevent going back to the previous page
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const cards = [
    {
      title: 'Surveys',
      description: 'Gather valuable insights and opinions through our intuitive product survey tool.',
      imageUrl: 'https://img.freepik.com/premium-vector/modern-3d-illustration-clipboard-with-checklist-concept_145666-1738.jpg?w=900',
      link: '/surveyspace',
    },
    {
      title: 'Chat Space',
      description: 'Connect with one of the best GPTs to get business tips and productive chats from one of our pilots.',
      imageUrl: 'https://wallpapercave.com/wp/wp10299436.jpg',
      link: '/chat',
    },
    {
      title: 'Tshirt Customizer',
      description: 'Customize your products with our easy-to-use design tool, perfect for creating unique merch.',
      imageUrl: 'https://img.freepik.com/free-psd/3d-rendering-graphic-design_23-2149642690.jpg?w=996&t=st=1723909101~exp=1723909701~hmac=c7152ad2329053d1b4831b52bd542c60e2d735fbafbcb10c64b618483d1429a0',
      link: '/studio',
    },
  ];

  // Animation configurations
  const bounceAnimation = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.8,
    },
  };

  const blobAnimation = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'mirror',
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 h-96 w-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        initial="initial"
        animate="animate"
        variants={blobAnimation}
      />
      <motion.div
        className="absolute top-40 -right-20 h-96 w-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        initial="initial"
        animate="animate"
        variants={blobAnimation}
        transition={{
          ...blobAnimation.transition,
          duration: 3,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-20 h-96 w-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        initial="initial"
        animate="animate"
        variants={blobAnimation}
        transition={{
          ...blobAnimation.transition,
          duration: 4,
        }}
      />

      {/* Logo and Logo Title with User Dropdown */}
      <motion.header className="flex items-center justify-between p-6" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <div className="flex items-center">
          <img 
            src='./BranDo.png'
            alt="logo"
            className="w-20 h-20 object-contain"  
          />
          <img 
            src='./BranDoTitle.png'  
            alt="logo title"
            className="w-16 h-16 object-contain ml-0.5"
          />
        </div>
        <div>
          <button 
            className="flex items-center p-2 rounded-full hover:bg-gray-200"
            onClick={handleUserMenuClick}
          >
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
          </button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {/* Display user name and email */}
            <Typography variant="subtitle1" className="px-4 py-1">
              {currentUser.name || "No Name"}
            </Typography>
            <Typography variant="subtitle2" className="px-4 py-1 text-gray-500">
              {currentUser.email || "No Email"}
            </Typography>
            <MenuItem onClick={handleSettingsClick}>
              <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-800" />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-800" />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </motion.header>

      {/* Main Content - Cards */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial="initial"
              animate="animate"
              variants={bounceAnimation}
            >
              <Card
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                link={card.link}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
