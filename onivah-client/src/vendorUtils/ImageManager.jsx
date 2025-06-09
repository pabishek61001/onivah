import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardMedia, IconButton,
    TextField, CardActions, Divider, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { apiUrl } from '../Api/Api';



const ImageManager = ({ initialImagesFromDB = {}, vendor = {}, category, categoryId }) => {

    console.log(initialImagesFromDB);

    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderImages, setNewFolderImages] = useState([]);
    console.log(folders);

    useEffect(() => {
        const init = Object.entries(initialImagesFromDB).map(([folderName, urls]) => ({
            id: Date.now() + Math.random(),
            folderName,
            editableName: folderName,
            isEditing: false,
            images: urls.map(url => ({ url, isNew: false }))
        }));
        setFolders(init);
    }, [initialImagesFromDB]);

    const handleImageUpload = (folderId, files) => {
        const fileArray = Array.from(files);
        Promise.all(fileArray.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, url: reader.result, isNew: true });
                };
                reader.readAsDataURL(file);
            });
        })).then(newImages => {
            setFolders(prev => prev.map(folder => {
                if (folder.id === folderId) {
                    if (folder.folderName === 'CoverImage') {
                        return { ...folder, images: [newImages[0]] };
                    } else {
                        return { ...folder, images: [...folder.images, ...newImages] };
                    }
                }
                return folder;
            }));
        });
    };

    const handleRemoveImage = (folderId, index) => {
        setFolders(prev =>
            prev.map(folder => {
                if (folder.id === folderId) {
                    const updated = [...folder.images];
                    updated.splice(index, 1);
                    return { ...folder, images: updated };
                }
                return folder;
            })
        );
    };

    const handleFolderNameEdit = (folderId, editing = true) => {
        setFolders(prev =>
            prev.map(folder =>
                folder.id === folderId ? { ...folder, isEditing: editing } : folder
            )
        );
    };

    const handleFolderNameChange = (folderId, newName) => {
        setFolders(prev =>
            prev.map(folder =>
                folder.id === folderId ? { ...folder, editableName: newName } : folder
            )
        );
    };

    // const handleFinalSave = async () => {
    //     const formData = new FormData();
    //     const folderMap = [];

    //     folders.forEach((folder) => {
    //         folder.images.forEach((imgObj) => {
    //             if (imgObj.isNew && imgObj.file) {
    //                 formData.append("images", imgObj.file);
    //                 folderMap.push({
    //                     fileName: imgObj.file.name,
    //                     folderName: folder.editableName,
    //                 });
    //             } else {
    //                 folderMap.push({
    //                     fileUrl: imgObj.url,
    //                     folderName: folder.editableName,
    //                 });
    //             }
    //         });
    //     });

    //     formData.append("folderMap", JSON.stringify(folderMap));
    //     formData.append("vendorId", vendor?.vendorId || '');
    //     formData.append("category", category || '');
    //     formData.append("categoryId", categoryId || '');


    //     try {
    //         console.log("📤 Uploading to /upload-images...");
    //         const response = await fetch(`${apiUrl}/api/s3/upload-images`, {
    //             method: "POST",
    //             body: formData,
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             console.error("❌ Upload failed:", result.error);
    //             alert("Upload failed: " + result.error);
    //             return;
    //         }

    //         console.log("✅ Upload successful. S3 URLs grouped by folder:", result.groupedUrls);
    //         alert("Images uploaded and saved to S3 successfully!");
    //     } catch (error) {
    //         console.error("🔥 Upload exception:", error);
    //         alert("An unexpected error occurred.");
    //     }
    // };

    const handleFinalSave = async () => {
        const formData = new FormData();
        const folderMap = [];

        folders.forEach((folder) => {
            console.log(folder);
            folder.images.forEach((imgObj) => {
                if (imgObj.isNew && imgObj.file) {
                    formData.append("images", imgObj.file);
                    folderMap.push({
                        fileName: imgObj.file.name,
                        folderName: folder.editableName,
                    });
                } else {
                    folderMap.push({
                        fileUrl: imgObj.url,
                        folderName: folder.editableName,
                    });
                }
            });
        });

        formData.append("folderMap", JSON.stringify(folderMap));
        formData.append("vendorId", vendor?.vendorId || "");
        formData.append("category", category || "");
        formData.append("categoryId", categoryId || "");


        try {
            const uploadResponse = await fetch(`${apiUrl}/api/s3/upload-images`, {
                method: "POST",
                body: formData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                alert("Upload failed: " + uploadResult.error);
                return;
            }

            // Step: Update folders with new image URLs
            const updatedFolders = folders.map(folder => {
                const folderName = folder.editableName;

                // 1. Existing images (fileUrl already exists)
                const existingImages = folder.images
                    .filter(img => !img.isNew)
                    .map(img => ({
                        url: img.url,
                        isNew: false
                    }));

                // 2. Newly uploaded images from groupedUrls
                const newlyUploaded = (uploadResult.groupedUrls[folderName] || []).map(uploaded => ({
                    url: uploaded.url,
                    isNew: false // now it's no longer new
                }));

                // 3. Merge both into the new folder object
                return {
                    ...folder,
                    images: [...existingImages, ...newlyUploaded]
                };
            });

            // Optional: setFolders(updatedFolders) if using state
            console.log("✅ Updated folders after upload:", updatedFolders);
            const folderLog = {};

            updatedFolders.forEach(folder => {
                folderLog[folder.editableName] = folder.images.map(img => img.url);
            });

            console.log("📦 Final image structure:", folderLog);

            const updatePayload = {
                category: category || "",
                categoryId: categoryId || "",
                images: folderLog, // ✅ Entire structure (old + new)
            };


            const updateResponse = await fetch(`${apiUrl}/vendor/update-images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatePayload),
            });

            const updateResult = await updateResponse.json();

            if (!updateResponse.ok) {
                console.error("❌ DB update failed:", updateResult.error);
                alert("Database update failed: " + updateResult.error);
                return;
            }

            console.log("✅ DB updated successfully:", updateResult);
            alert("Images uploaded to S3 and saved to DB successfully!");
        } catch (error) {
            console.error("🔥 Error during upload and DB update:", error);
            alert("An unexpected error occurred during image save.");
        }
    };


    const handleNewFolderImageSelect = (files) => {
        const fileArray = Array.from(files);
        Promise.all(fileArray.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, url: reader.result, isNew: true });
                };
                reader.readAsDataURL(file);
            });
        })).then(setNewFolderImages);
    };

    const createNewFolder = () => {
        if (!newFolderName.trim() || newFolderImages.length === 0) {
            alert("Please enter a folder name and upload at least one image.");
            return;
        }

        const newFolder = {
            id: Date.now() + Math.random(),
            folderName: newFolderName,
            editableName: newFolderName,
            isEditing: false,
            images: newFolderImages
        };

        setFolders(prev => [...prev, newFolder]);
        setNewFolderName('');
        setNewFolderImages([]);
    };

    const handleDeleteFolder = async (folder) => {
        if (window.confirm("Are you sure you want to delete this folder and all its images?")) {
            setFolders(prev => prev.filter(item => item.id !== folder.id));

            try {
                const response = await fetch(`${apiUrl}/vendor/delete-folder`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        category,
                        categoryId,
                        folderName: folder.folderName
                    })
                });

                const result = await response.json();
                if (!response.ok) {
                    alert("Failed to delete folder: " + result.error);
                } else {
                    console.log("✅ Folder deleted from DB");
                }
            } catch (error) {
                console.error("🔥 Delete error:", error);
                alert("Error deleting folder from DB.");
            }
        }
    };



    return (
        <Box p={3}>
            <Divider sx={{ mb: 3 }} />

            {/* ➕ Add New Folder Section */}
            <Box mb={5}>
                <Typography variant="body5" fontWeight={500} component='div' gutterBottom mb={1}>Add New Folder</Typography>
                <Typography variant="caption" color="text.secondary" component='div' mb={2}>
                    <strong>Step 1:</strong> Enter folder name &nbsp;&nbsp;
                    <strong>Step 2:</strong> Upload atleast one image &nbsp;&nbsp;
                    <strong>Step 3:</strong> Click <em>"Create Folder"</em>
                </Typography>


                <Grid container spacing={2} alignItems="center" mb={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Folder Name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            size="small"
                            sx={{ maxWidth: 400 }}

                        />
                    </Grid>

                    <Grid item xs={6} sm='auto'>
                        <Button
                            size="small"
                            component="label"
                            variant="outlined"
                            startIcon={<AddPhotoAlternateIcon />}
                            sx={{ maxWidth: 400 }}
                        >
                            Upload Images
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                                onChange={(e) => handleNewFolderImageSelect(e.target.files)}
                            />
                        </Button>
                    </Grid>

                    <Grid item xs={6} sm='auto'>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={createNewFolder}
                            sx={{ maxWidth: 400 }}
                        >
                            Create Folder
                        </Button>
                    </Grid>
                </Grid>


                {newFolderImages.length > 0 && (
                    <Grid container spacing={2}>
                        {newFolderImages.map((img, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={img.url}
                                        alt={`Preview ${index + 1}`}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Divider sx={{ my: 4 }} />
            </Box>

            {/* 🗂 Existing Folders */}
            {folders.map(folder => (
                <Box key={folder.id} mb={5}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        {folder.folderName === 'CoverImage' ? (
                            <Typography variant="h6">{folder.folderName}</Typography>
                        ) : folder.isEditing ? (
                            <>
                                <TextField
                                    value={folder.editableName}
                                    onChange={(e) => handleFolderNameChange(folder.id, e.target.value)}
                                    size="small"
                                />
                                <Tooltip title="Save Folder Name" arrow>
                                    <IconButton onClick={() => handleFolderNameEdit(folder.id, false)}>
                                        <SaveIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6">{folder.editableName}</Typography>
                                <Tooltip title="Edit Folder Name" arrow>
                                    <IconButton
                                        onClick={() => handleFolderNameEdit(folder.id, true)}
                                        sx={{ bgcolor: "#f4fff8" }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        {folder.folderName !== 'CoverImage' && (
                            <Tooltip title="Delete Folder" arrow>
                                <IconButton
                                    onClick={() => handleDeleteFolder(folder)}
                                    color="default"
                                    sx={{ bgcolor: "#fff4f5" }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>


                    <Box display="flex" justifyContent="end" mb={2}>
                        <Button
                            component="label"
                            startIcon={<AddPhotoAlternateIcon />}
                            sx={{ mb: 2, maxWidth: 300, placeSelf: "end", textTransform: "none" }}
                        >
                            {folder.folderName === 'CoverImage' ? 'Replace Image' : 'Upload Images'}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                multiple={folder.folderName !== 'CoverImage'}
                                onChange={(e) => handleImageUpload(folder.id, e.target.files)}
                            />
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {folder.images.map((img, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Card sx={{ boxShadow: 0, bgcolor: "#f5f5f5" }}>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={img.url}
                                        alt={`Image ${index + 1}`}
                                    />
                                    <CardActions>
                                        <IconButton
                                            onClick={() => handleRemoveImage(folder.id, index)}
                                            disabled={folder.folderName === 'CoverImage'}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

            <Box mt={4} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleFinalSave}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default ImageManager;
