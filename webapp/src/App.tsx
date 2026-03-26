import './App.css'
import { Theme } from '@mui/material/styles'
import { defaultDark } from './themes/default-dark'
import { Box, Typography } from '@mui/material';
import useMQTTStore from './context/mqtt-store';
import { useEffect, useState } from 'react';
import CircularProgressWithLabel from './circular-progress';

function App() {
  const theme: Theme = defaultDark;
  const { data } = useMQTTStore();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (data) {
      if (typeof data.Value === 'number') {
        setProgress(data.Value);
      }

      if (typeof data.Value === 'string' && data.Value.trim() !== '') {
        let navigationUrl: string = data.Value;
        window.location.href = navigationUrl;
      }
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        color: 'text.primary',
        gap: 3,
      }}
    >
      <CircularProgressWithLabel value={progress} />
      <Typography variant="h4" sx={{ mt: 3, fontWeight: 600, color: 'white' }}>
        Az oldal éppen frissül
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, opacity: 0.7, color: 'white' }}>
        Kérjük, próbáld újra néhány perc múlva!
      </Typography>
    </Box>
  )
}

export default App
