import {
    Typography, Divider
} from "@mui/material";

const FormDivider = ({ text }) => {
    return (
        <Divider>
            <Typography variant="caption" color="text.disabled">{text}</Typography>
        </Divider>)
}

export default FormDivider