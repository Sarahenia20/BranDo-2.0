import { Button, Stack, TextField, Typography, colors } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { ScreenMode } from '../pages/Signup';

const ResetForm = ({ onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/password/email', { email });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Stack
      component="form" // Make the Stack a form element
      onSubmit={handleSubmit} // Attach the submit handler
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        color: colors.grey[800],
        width: "100%",
        maxWidth: "700px", // Match the width from SigninForm
        paddingTop: '2rem', // Aligns with the SigninForm
      }}
    >
      {/* Logo Section */}
      <Stack 
        direction="row" 
        alignItems="center" 
        sx={{ marginBottom: '1rem', width: '100%' }}
        justifyContent="flex-start" // Ensure the logo is left-aligned
      >
        <img 
          src='./BranDo.png'
          alt="logo"
          className="w-20 h-20 object-contain"  
        />
        <img 
          src='./BranDoTitle.png'  
          alt="logo title"
          className="w-32 h-20 object-contain ml-2" // Adjust width and add margin to position next to the logo
        />
      </Stack>

      <Stack spacing={3} sx={{ width: "100%" }}>
        <Stack>
          <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
            Reset Your Password
          </Typography>
          <Typography color={colors.grey[600]}>
            In case you have forgotten your password or want to update it.
          </Typography>
        </Stack>

        {message && (
          <Typography color="green">{message}</Typography>
        )}
        {error && (
          <Typography color="red">{error}</Typography>
        )}

        <Stack spacing={3}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography color={colors.grey[800]}>Email</Typography>
              <TextField 
                placeholder="Enter your email" 
                fullWidth 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Handle input change
                required // Make the field required
              />
            </Stack>
          </Stack>
          <Button
            type="submit" // Make this a submit button
            variant='contained'
            size='large'
            fullWidth
            sx={{
              bgcolor: colors.grey[800],
              "&:hover": {
                bgcolor: colors.grey[600]
              }
            }}
          >
            Send Reset Link
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Typography>Log in to your account?</Typography>
          <Typography
            onClick={() => onSwitchMode(ScreenMode.SIGN_IN)}
            fontWeight={600}
            sx={{
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            Go to Sign In
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ResetForm;
