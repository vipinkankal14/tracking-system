"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Avatar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ErrorIcon from "@mui/icons-material/Error"

const ProfileImageUpload = ({ open, onClose, user, onSave }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(user?.profile_image || "")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset states
    setError(null)
    setUploadSuccess(false)

    // Validate file type and size
    if (!file.type.match("image.*")) {
      setError("Only image files are allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const fileInput = document.getElementById("profile-image-upload")
    const file = fileInput.files[0]

    if (!file) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
    setError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append("profile_image", file)

      const endpoint = user?.id
        ? `http://localhost:5000/api/users/${user.id}/profile-image`
        : "http://localhost:5000/api/users/profile-image"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the browser set it
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to upload image")
      }

      if (!result.profile_image) {
        throw new Error("No image URL returned from server")
      }

      setUploadSuccess(true)

      // Call onSave with updated user data
      onSave({
        ...user,
        profile_image: result.profile_image,
      })

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError(err.message || "Failed to upload image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Clean up preview URL if it's an object URL
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
    setPreview(user?.profile_image || "")
    setError(null)
    setUploadSuccess(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>
        {isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Upload Profile Image
            <Button onClick={handleClose} color="inherit" size="small">
              Cancel
            </Button>
          </Box>
        ) : (
          "Upload Profile Image"
        )}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: isMobile ? 2 : 3,
            gap: 2,
          }}
        >
          <Avatar
            src={preview}
            sx={{
              width: isMobile ? 120 : 150,
              height: isMobile ? 120 : 150,
              mb: 2,
              fontSize: preview ? "inherit" : "3rem",
              border: "1px solid #e0e0e0",
            }}
          >
            {!preview && user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image-upload"
            type="file"
            onChange={handleFileChange}
          />

          <label htmlFor="profile-image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
              fullWidth={isMobile}
            >
              Choose Image
            </Button>
          </label>

          {error && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "error.main",
                mt: 2,
                gap: 1,
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                borderRadius: "4px",
              }}
            >
              <ErrorIcon fontSize="small" />
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          {uploadSuccess && (
            <Box
              sx={{
                color: "success.main",
                mt: 2,
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">Image uploaded successfully!</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!isMobile && (
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={loading || !preview || preview === user?.profile_image}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          fullWidth={isMobile}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProfileImageUpload

