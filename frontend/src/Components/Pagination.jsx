import { Pagination as MuiPagination, Box } from "@mui/material"

const Pagination = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 5,
      }}
      className="pagination-container"
    >
      <MuiPagination count={8} color="primary" shape="rounded" className="pagination" />
    </Box>
  )
}

export default Pagination

