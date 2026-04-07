import './App.css'
import { Theme } from '@mui/material/styles'
import { defaultDark } from './themes/default-dark'
import { Box, Typography } from '@mui/material';
import useMQTTStore from './context/mqtt-store';
import { useEffect, useState } from 'react';
import CircularProgressWithLabel from './circular-progress';
import { useNavigate } from 'react-router-dom';

function App() {
  const theme: Theme = defaultDark;
  const { data } = useMQTTStore();
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      if (typeof data.Value === 'number') {
        setProgress(data.Value);
      }

      if (typeof data.Value === 'string' && data.Value.trim() !== '') {
        navigate(-1);
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
      <Typography variant="h6" sx={{ mt: 0, opacity: 0.7, color: 'white' }}>
        Ne lépjenek el az oldalról!
      </Typography>
    </Box>
  )
}

export default App
