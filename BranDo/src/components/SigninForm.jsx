import { Button, Stack, TextField, Typography, colors } from '@mui/material';
import React, { useState } from 'react';
import axiosClient from '../axios.js';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from "../context/ContextProvider.jsx";
import { ScreenMode } from '../pages/Signup';

const SigninForm = ({ onSwitchMode }) => {
  const { setCurrentUser, setUserToken } = useStateContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ __html: "" });

  const handleSignIn = () => {
    console.log("Attempting to sign in with:", email, password);

    axiosClient
      .post('/login', {
        email,
        password,
      })
      .then(({ data }) => {
        console.log("Login successful:", data);
        localStorage.setItem('TOKEN', data.token); // Ensure correct key is used
        setCurrentUser(data.user);
        setUserToken(data.token);
        navigate('/main');  // Redirect to /home after successful sign-in
      })
      .catch(error => {
        console.error("Login error:", error);
        if (error.response && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).join('<br>');
          setError({ __html: errors });
        } else {
          setError({ __html: 'Incorrect email or password.' });
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
            Welcome back
          </Typography>
          <Typography color={colors.grey[600]}>
            Log in to your account
          </Typography>
        </Stack>

        <Stack spacing={3}>
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
              placeholder="Enter your password" 
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
            onClick={handleSignIn}
          >
            Sign in
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Typography>Forgot your Password?</Typography>
          <Typography
            onClick={() => onSwitchMode(ScreenMode.RESET)}
            fontWeight={600}
            sx={{
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            Reset Password
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Typography>Don't have an account?</Typography>
          <Typography
            onClick={() => onSwitchMode(ScreenMode.SIGN_UP)}
            fontWeight={600}
            sx={{
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            Sign up now
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SigninForm;
