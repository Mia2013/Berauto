import React from 'react'
import { Box, Container } from '@mui/material'
import UserForm from '../components/UserForm';

const Profile = () => {
    return (
        <Box  >
            <Container>
                <UserForm IsRegisterForm={false}/>
            </Container>
        </Box>
    )
}
export default Profile;