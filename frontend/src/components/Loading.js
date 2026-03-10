import { Typography, Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
      }}
    >
      <CircularProgress size="3rem" />
      <Typography variant="h3">Betöltés...</Typography>
    </Box>
  );
}
