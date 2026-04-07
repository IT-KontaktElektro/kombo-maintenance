import './App.css'
import { Theme } from '@mui/material/styles'
import { defaultDark } from './themes/default-dark'
import { Box, Typography } from '@mui/material';
import useMQTTStore from './context/mqtt-store';
import { useEffect, useRef, useState } from 'react';
import CircularProgressWithLabel from './circular-progress';
import { useNavigate } from 'react-router-dom';

const PROGRESS_STEPS = [29, 59, 89, 99];
const MQTT_STEPS = [30, 60, 90, 100];

function App() {
  const theme: Theme = defaultDark;
  const { data } = useMQTTStore();
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (data && typeof data.Value === 'number' && data.Value === 1 && !started) {
      setProgress(1);
      setStarted(true);
    }
  }, [data, started]);

  useEffect(() => {
    if (!started) return;
    if (step < PROGRESS_STEPS.length) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < PROGRESS_STEPS[step]) {
            return prev + 1;
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [step, started]);

  useEffect(() => {
    if (data) {
      if (step < MQTT_STEPS.length && progress >= PROGRESS_STEPS[step]) {
        setProgress(MQTT_STEPS[step]);
        setStep((s) => s + 1);
      }

      if (typeof data.Value === 'string' && data.Value.trim() === 'navigate') {
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
