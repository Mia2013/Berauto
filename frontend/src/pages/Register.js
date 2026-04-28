import React from 'react'
import { Box, Container } from '@mui/material'
import UserForm from "../components/UserForm";

const Register = () => {
    return (
        <Box>
            <Container>
                <UserForm IsRegisterForm={true} />
            </Container>
        </Box>
    )
}
export default Register;