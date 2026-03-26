import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';

export interface CircularProgressWithLabelProps {
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                size={70}
                thickness={5}

                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: 'white', fontWeight: 500, fontSize: '15px' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel;