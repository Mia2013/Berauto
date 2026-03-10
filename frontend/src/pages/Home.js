import React, { useState, useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { getData } from '../API/apiCalls';

const Home = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    getData("WeatherForecast").then((data_) => setData(data_));
  }, [])

  return (
    <Box sx={{ mt: 3 }}>
      <Container>
        <div>Home</div>
        <Typography>backend válasz próba:</Typography>
        {data.length > 0 && data.map(item => (
          <Typography>{item?.date}</Typography>
        ))}

      </Container>
    </Box>
  )
}

export default Home;