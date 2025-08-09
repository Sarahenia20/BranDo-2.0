import { Button, Stack, TextField, Typography, colors } from '@mui/material';
import React, { useState } from 'react';
import axiosClient from '../axios.js';
import { useStateContext } from "../context/ContextProvider.jsx";
import { ScreenMode } from '../pages/Signup';

const SignupForm = ({ onSwitchMode }) => {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ __html: "" });

  const handleSignUp = () => {
    axiosClient
      .post('/signup', {
        name: fullName,
        email,
        password,
      })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
        onSwitchMode(ScreenMode.SIGN_IN);
      })
      .catch(error => {
        if (error.response && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).join('<br>');
          setError({ __html: errors });
        } else {
          setError({ __html: 'An unexpected error occurred. Please try again.' });
        }
      });
  };

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        height: "100%",
        color: colors.grey[800],
        width: "100%",
        maxWidth: "700px",
        paddingTop: '1rem',
      }}
    >
      {/* Logo Section */}
      <Stack 
        direction="row" 
        alignItems="center" 
        sx={{ marginBottom: '1rem', width: '100%' }}
        justifyContent="flex-start"
      >
        <img 
          src='./BranDo.png'
          alt="logo"
          className="w-20 h-20 object-contain"  
        />
        <img 
          src='./BranDoTitle.png'  
          alt="logo title"
          className="w-32 h-20 object-contain ml-1"
        />
      </Stack>

      {error.__html && (
        <div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>
        </div>
      )}

      <Stack spacing={3} sx={{ width: "100%" }}>
        <Stack>
          <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
            Create an account
          </Typography>
          <Typography color={colors.grey[600]}>
            Sign up to get started
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color={colors.grey[800]}>Name</Typography>
            <TextField 
              placeholder="Enter your name" 
              fullWidth 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography color={colors.grey[800]}>Email</Typography>
            <TextField 
              placeholder="Enter your email" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography color={colors.grey[800]}>Password</Typography>
            <TextField 
              type='password' 
              placeholder="Create a password" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          <Button
            variant='contained'
            size='large'
            fullWidth
            sx={{
              bgcolor: colors.grey[800],
              "&:hover": {
                bgcolor: colors.grey[600]
              }
            }}
            onClick={handleSignUp}
          >
            Sign up
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Typography>Already have an account?</Typography>
          <Typography
            onClick={() => onSwitchMode(ScreenMode.SIGN_IN)}  // Switch mode to SIGN_IN
            fontWeight={600}
            sx={{
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            Sign in
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
