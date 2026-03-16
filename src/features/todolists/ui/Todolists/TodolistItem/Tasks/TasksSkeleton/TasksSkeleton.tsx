// features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton.tsx
import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import Paper from "@mui/material/Paper"

const TASKS_CONTAINER_HEIGHT = 200
const TASK_HEIGHT = 48

export const TasksSkeleton = () => (
  <Paper
    variant="outlined"
    sx={{
      height: TASKS_CONTAINER_HEIGHT,
      backgroundColor: "#fff",
      overflow: "hidden",
    }}
  >
    <Box sx={{ p: 0 }}>
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: TASK_HEIGHT,
              px: 2,
              borderBottom: index < 3 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </Box>
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
        ))}
    </Box>
  </Paper>
)
