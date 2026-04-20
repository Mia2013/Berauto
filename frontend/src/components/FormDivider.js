import {
    Typography, Divider
} from "@mui/material";

const FormDivider = ({ text }) => {
    return (
        <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.disabled">{text}</Typography>
        </Divider>)
}

export default FormDivider