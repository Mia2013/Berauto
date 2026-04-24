import React from 'react'
import { Box, Container } from '@mui/material'
import UserForm from '../components/UserForm';

const Profile = () => {
    return (
        <Box sx={{ py: 3 }}>
            <Container>
                <UserForm />
            </Container>
        </Box>
    )
}
export default Profile;