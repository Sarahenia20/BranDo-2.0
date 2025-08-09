import { Box, Grid, colors } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import assets from "../assets/index.jsx";
import SigninForm from '../components/SigninForm';
import SignupForm from '../components/SignupForm';
import ResetForm from '../components/ResetForm.jsx';

export const ScreenMode = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  RESET: "RESET"
};

export const Signup = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState("unset");
  const [width, setWidth] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(assets.images.signinBg);
  const [currMode, setCurrMode] = useState(ScreenMode.SIGN_IN);

  const onSwitchMode = (mode) => {
    setWidth(100);

    const timeout1 = setTimeout(() => {
      setCurrMode(mode);
      if (mode === ScreenMode.SIGN_IN) {
        setBackgroundImage(assets.images.signinBg);
      } else if (mode === ScreenMode.SIGN_UP) {
        setBackgroundImage(assets.images.signupBg);
      } else if (mode === ScreenMode.RESET) {
        setBackgroundImage(assets.images.resetBg); 
      }
    }, 1100);

    const timeout2 = setTimeout(() => {
      setLeft("unset");
      setRight(0);
      setWidth(0);
    }, 1200);

    const timeout3 = setTimeout(() => {
      setRight("unset");
      setLeft(0);
    }, 2500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };

  const bounceAnimation = {
    initial: { y: -20, opacity: 0 },
    animate: { y: [0, -10, 0], opacity: 1 },
    transition: { duration: 0.6, ease: "easeInOut" }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={4} sx={{ position: "relative", padding: 3 }}>
        <motion.div {...bounceAnimation}>
          {currMode === ScreenMode.SIGN_IN && <SigninForm onSwitchMode={onSwitchMode} />}
          {currMode === ScreenMode.SIGN_UP && <SignupForm onSwitchMode={onSwitchMode} />}
          {currMode === ScreenMode.RESET && <ResetForm onSwitchMode={onSwitchMode} />}
        </motion.div>
        <Box sx={{
          position: "absolute",
          top: 0,
          left: left,
          right: right,
          width: `${width}%`,
          height: "100%",
          bgcolor: colors.grey[800],
          transition: "all 1s ease-in-out"
        }} />
      </Grid>
      <Grid item xs={8} sx={{
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}>
        <motion.div {...bounceAnimation}>
          <Box sx={{
            position: "absolute",
            top: 0,
            left: left,
            right: right,
            width: `${width}%`,
            height: "100%",
            bgcolor: colors.common.white,
            transition: "all 1s ease-in-out"
          }} />
        </motion.div>
      </Grid>
    </Grid>
  );
};
