import './App.css'
import { Theme } from '@mui/material/styles'
import { defaultDark } from './themes/default-dark'
import { Box, Typography } from '@mui/material';
import useMQTTStore from './context/mqtt-store';
import { useEffect, useRef, useState } from 'react';
import CircularProgressWithLabel from './circular-progress';
import { useNavigate } from 'react-router-dom';

const TOTAL_DURATION_MS = 3.5 * 60 * 1000; // 3.5 perc milliszekundumban
const INTERVAL_MS = 100; // progress frissítés gyakorisága

function App() {
  const theme: Theme = defaultDark;
  const { data } = useMQTTStore();
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [hasErrorOccured, setHasErrorOccured] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (data && typeof data.Value === 'number' && data.Value === 1 && (!started || hasErrorOccured)) {
      setProgress(0);
      setStarted(true);
      setHasErrorOccured(false);
      startTimeRef.current = Date.now();
    }
  }, [data]);

  useEffect(() => {
    if (!started) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        let newProgress = Math.min((elapsed / TOTAL_DURATION_MS) * 100, 99);
        setProgress(newProgress);
      }
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started]);

  useEffect(() => {
    if (data) {
      if (typeof data.Value === "string" && data.Value.trim() === "error") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);
        setHasErrorOccured(true);
        setStarted(false);
        startTimeRef.current = null;
      } else if (typeof data.Value === 'number' && started && !hasErrorOccured) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setStarted(false);
        startTimeRef.current = null;
      } else if (typeof data.Value === 'string' && data.Value.trim() === 'navigate') {
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
      {hasErrorOccured ? (
        <>
          <Typography variant="h4" sx={{ mt: 3, fontWeight: 600, color: 'red' }}>
            Leállás történt!
          </Typography>
          <Typography variant="h6" sx={{ mt: 0, opacity: 0.7, color: 'white' }}>
            Kérjük, próbáld újra később.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4" sx={{ mt: 3, fontWeight: 600, color: 'white' }}>
            Az oldal éppen frissül
          </Typography>
          <Typography variant="h6" sx={{ mt: 0, opacity: 0.7, color: 'white' }}>
            Ne lépjenek el az oldalról!
          </Typography>
        </>
      )}
    </Box>
  )
}

export default App
