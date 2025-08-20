"use client"

import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { Image, Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

import { useServerFn } from '@tanstack/react-start';
import { uploadAsset, getFolderWithLastAsset } from "~/integrations/webflow/assets/services";
import type { FormData } from "~/components/form/types";

type FileUploadProps = {
    formData?: any;
    updateFormData: (data: Partial<FormData>) => void;
    onFilesChange?: (fileCount: number) => void;
}

type UploadedFile = {
    file: File;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    result?: any;
    error?: string;
}

type UploadedFiles = UploadedFile[];

export type FileUploadRef = {
    uploadAllFiles: () => Promise<{ success: boolean; urls: string[] }>;
    hasFiles: () => boolean;
    getUploadedFiles: () => UploadedFiles;
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>((props, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>([]);

    const [isTestingFolder, setIsTestingFolder] = useState(false);
    const [folderResult, setFolderResult] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const uploadAssetFn = useServerFn(uploadAsset);
    const getFolderWithLastAssetFn = useServerFn(getFolderWithLastAsset);

    // Expose upload function to parent component
    useImperativeHandle(ref, () => ({
        uploadAllFiles: async () => {
            const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
            console.log('Pending files to upload:', pendingFiles);
            if (pendingFiles.length === 0) return { success: true, urls: [] };

            let allSuccessful = true;
            const uploadedUrls: string[] = [];

            // Upload all pending files and collect URLs directly from results
            for (let i = 0; i < uploadedFiles.length; i++) {
                if (uploadedFiles[i].status === 'pending') {
                    console.log(`Attempting to upload file ${i}:`, uploadedFiles[i].file.name);
                    const result = await uploadFile(i);
                    console.log(`Upload result for file ${i}:`, result);
                    
                    if (!result.success) {
                        console.error(`Failed to upload file ${i}:`, result.error);
                        allSuccessful = false;
                    } else {
                        // Get the URL directly from the upload result
                        if (result.asset?.hostedUrl) {
                            console.log(`Successfully got hostedUrl for file ${i}:`, result.asset.hostedUrl);
                            uploadedUrls.push(result.asset.hostedUrl);
                        } else {
                            console.error(`No hostedUrl in result for file ${i}:`, result);
                        }
                    }
                }
            }

            console.log('Final collected URLs:', uploadedUrls);
            console.log('Upload success status:', allSuccessful);

            return { success: allSuccessful, urls: uploadedUrls };
        },
        hasFiles: () => uploadedFiles.length > 0,
        getUploadedFiles: () => uploadedFiles
    }));

    // Test folder with last asset function
    const handleTestFolder = async () => {
        setIsTestingFolder(true);
        setFolderResult(null);
        
        try {
            const response = await getFolderWithLastAssetFn({});
            console.log('Folder with last asset response:', response);
            setFolderResult(response);
        } catch (error) {
            console.error('Error calling getFolderWithLastAsset:', error);
            setFolderResult({ success: false, error: 'Failed to call server function' });
        } finally {
            setIsTestingFolder(false);
        }
    };

    const validateFile = (file: File): string | null => {
        // Check file type (images only)
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only image files (PNG, JPEG, GIF, SVG, WebP) are allowed';
        }

        // Check file size (4MB limit for images)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
            return 'File size must be less than 4MB';
        }

        return null;
    };

    // file selection
    const handleFiles = useCallback((files: FileList) => {
        const newFiles: UploadedFile[] = [];
        const currentFileCount = uploadedFiles.length;
        const maxFiles = 3;

        // Check if adding new files would exceed the limit
        if (currentFileCount >= maxFiles) {
            setError(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
            return;
        }

        const availableSlots = maxFiles - currentFileCount;
        const filesToProcess = Math.min(files.length, availableSlots);

        if (files.length > availableSlots) {
            setError(`Can only add ${availableSlots} more file(s). Maximum ${maxFiles} files allowed.`);
        } else {
            setError(null); // Clear any previous errors
        }

        Array.from(files).slice(0, filesToProcess).forEach((file) => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                console.error(`File ${file.name}: ${validationError}`);
                return;
            }

            const preview = URL.createObjectURL(file);
            newFiles.push({
                file,
                preview,
                status: 'pending'
            });
        });

        if (newFiles.length > 0) {
            setUploadedFiles(prev => {
                const newList = [...prev, ...newFiles];
                // Notify parent of file count change
                props.onFilesChange?.(newList.length);
                return newList;
            });
        }
    }, [uploadedFiles.length, props]);

    // upload individual file
    const uploadFile = async (fileIndex: number): Promise<any> => {
        const fileData = uploadedFiles[fileIndex];
        if (!fileData || fileData.status === 'uploading') return { success: false };

        console.log(`Starting upload for file ${fileIndex}:`, {
            name: fileData.file.name,
            type: fileData.file.type,
            size: fileData.file.size
        });

        // Update status to uploading
        setUploadedFiles(prev => prev.map((f, i) => 
            i === fileIndex ? { ...f, status: 'uploading' } : f
        ));

        try {
            // Convert file to ArrayBuffer
            const arrayBuffer = await fileData.file.arrayBuffer();
            console.log(`Converted file ${fileIndex} to ArrayBuffer, size:`, arrayBuffer.byteLength);
            
            // Convert ArrayBuffer to base64 string for serialization
            const bytes = new Uint8Array(arrayBuffer);
            let binaryString = '';
            for (let i = 0; i < bytes.length; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }
            const base64String = btoa(binaryString);
            console.log(`Converted file ${fileIndex} to base64, length:`, base64String.length);
            
            console.log(`Calling uploadAssetFn for file ${fileIndex}`);
            const result = await uploadAssetFn({
                data: {
                    fileName: fileData.file.name,
                    fileBuffer: base64String,
                    contentType: fileData.file.type,
                }
            });
            console.log(`Upload result for file ${fileIndex}:`, result);

            // Update status based on result
            setUploadedFiles(prev => prev.map((f, i) => 
                i === fileIndex ? { 
                    ...f, 
                    status: result.success ? 'success' : 'error',
                    result: result.success ? result : undefined,
                    error: result.success ? undefined : result.message
                } : f
            ));

            return result;

        } catch (error) {
            console.error(`Error uploading file ${fileIndex}:`, error);
            setUploadedFiles(prev => prev.map((f, i) => 
                i === fileIndex ? { 
                    ...f, 
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Upload failed'
                } : f
            ));
            return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
        }
    };

    // Remove file
    const removeFile = (index: number) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            // Notify parent of file count change
            props.onFilesChange?.(newFiles.length);
            return newFiles;
        });
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }, [handleFiles]);

    // File input change handler
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-3">
                <Image size={28} className="text-red-300" />
                <h2 className="text-2xl font-bold text-red-100">
                    Upload Proof of Piece
                </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-red-100/80 mb-6">
                At least one image must include a piece of paper with your name on it, shown alongside your piece.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">

                {/* Test GET Folder with Last Asset */}
                {/* <Button
                    onClick={handleTestFolder}
                    disabled={isTestingFolder}
                    className="bg-red-600 hover:bg-red-500 text-red-50 mb-4"
                >
                    {isTestingFolder ? 'Testing...' : 'Test GET Folder with Last Asset'}
                </Button>

                {folderResult && (
                    <div className="mb-4 p-4 rounded-lg bg-blue-950/40 border border-blue-400/30">
                        <h3 className="text-blue-200 font-semibold mb-2">Folder with Last Asset Result:</h3>
                        <div className="text-blue-100 text-sm space-y-2">
                            <div>
                                <strong>Status:</strong> {folderResult.success ? 'Success' : 'Failed'}
                            </div>
                            <div>
                                <strong>Message:</strong> {folderResult.message}
                            </div>
                            
                            {folderResult.success && folderResult.folder && (
                                <div className="mt-4 p-3 bg-blue-950/30 border border-blue-400/20 rounded">
                                    <h4 className="text-blue-200 font-medium mb-2">Folder Info:</h4>
                                    <div className="text-sm space-y-1">
                                        <div><strong>Name:</strong> {folderResult.folder.displayName}</div>
                                        <div><strong>ID:</strong> {folderResult.folder.id}</div>
                                        <div><strong>Total Assets:</strong> {folderResult.totalAssets}</div>
                                        <div><strong>Asset IDs in Folder:</strong> {folderResult.folder.totalAssetIds}</div>
                                        <div><strong>Unique Asset IDs:</strong> {folderResult.folder.uniqueAssetIds}</div>
                                    </div>
                                </div>
                            )}

                            {folderResult.success && folderResult.lastAsset && (
                                <div className="mt-4 p-3 bg-blue-950/30 border border-blue-400/20 rounded">
                                    <h4 className="text-blue-200 font-medium mb-2">Last Uploaded Asset:</h4>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={folderResult.lastAsset.hostedUrl}
                                                alt={folderResult.lastAsset.displayName}
                                                className="w-24 h-24 object-cover rounded-lg border border-blue-400/30"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0 text-sm space-y-1">
                                            <div><strong>Display Name:</strong> {folderResult.lastAsset.displayName}</div>
                                            <div><strong>Original Name:</strong> {folderResult.lastAsset.originalFileName}</div>
                                            <div><strong>Size:</strong> {(folderResult.lastAsset.size / 1024 / 1024).toFixed(2)} MB</div>
                                            <div><strong>Type:</strong> {folderResult.lastAsset.contentType}</div>
                                            <div><strong>Created:</strong> {new Date(folderResult.lastAsset.createdOn).toLocaleDateString()}</div>
                                            <a 
                                                href={folderResult.lastAsset.hostedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-300 hover:text-blue-100 underline"
                                            >
                                                View Full Image
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {folderResult.invalidAssetIds && folderResult.invalidAssetIds.length > 0 && (
                                <div className="mt-4 p-3 bg-red-950/30 border border-red-400/20 rounded">
                                    <h4 className="text-red-200 font-medium mb-2">Invalid Asset IDs:</h4>
                                    <div className="text-sm text-red-100">
                                        {folderResult.invalidAssetIds.join(', ')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )} */}
                {/* END Test GET Folder with Last Asset */}

                {/* Drag and Drop Area */}
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                        ${isDragOver 
                            ? 'border-red-400 bg-red-950/50' 
                            : 'border-red-400/30 bg-red-950/20 hover:bg-red-950/30'
                        }
                        ${uploadedFiles.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => uploadedFiles.length < 3 && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={uploadedFiles.length >= 3}
                    />
                    
                    <Upload size={48} className="mx-auto mb-4 text-red-300" />
                    {uploadedFiles.length >= 3 ? (
                        <>
                            <p className="text-red-100 text-lg font-medium mb-2">
                                Maximum files reached (3/3)
                            </p>
                            <p className="text-red-200/80 text-sm">
                                Remove files to add more
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-red-100 text-lg font-medium mb-2">
                                Drop your proof of pieces images here
                            </p>
                            <p className="text-red-200/80 text-sm">
                                or click to browse files
                            </p>
                            <p className="text-red-300/60 text-xs mt-2">
                                Supports: PNG, JPEG, GIF, SVG, WebP (max 4MB each)
                            </p>
                            <p className="text-red-300/60 text-xs">
                                At least 1 file required • Maximum 3 files ({uploadedFiles.length}/3 selected)
                            </p>
                        </>
                    )}
                </div>

                {/* Uploaded Files */}
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {uploadedFiles.map((fileData, index) => (
                            <motion.div
                                key={`${fileData.file.name}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-red-950/30 border border-red-400/20 rounded-lg p-4"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Image Preview */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={fileData.preview}
                                            alt={fileData.file.name}
                                            className="w-20 h-20 object-cover rounded-lg border border-red-400/30"
                                        />
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-grow min-w-0">
                                        <h4 className="text-red-100 font-medium truncate">
                                            {fileData.file.name}
                                        </h4>
                                        <p className="text-red-200/60 text-sm">
                                            {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        
                                        {/* Status */}
                                        <div className="flex items-center gap-2 mt-2">
                                            {fileData.status === 'pending' && (
                                                <div className="flex items-center gap-2 text-red-200">
                                                    <CheckCircle size={16} className="text-red-300" />
                                                    <span className="text-sm">Ready to upload</span>
                                                </div>
                                            )}
                                            
                                            {fileData.status === 'uploading' && (
                                                <div className="flex items-center gap-2 text-red-200">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span className="text-sm">Uploading...</span>
                                                </div>
                                            )}
                                            
                                            {fileData.status === 'success' && (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle size={16} />
                                                    <span className="text-sm">Uploaded successfully</span>
                                                </div>
                                            )}
                                            
                                            {fileData.status === 'error' && (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <AlertCircle size={16} />
                                                    <span className="text-sm">{fileData.error}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeFile(index)}
                                        className="flex-shrink-0 text-red-300 hover:text-red-100 hover:bg-red-800/50"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {error && (
                    <div className="text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {uploadedFiles.length === 0 && (
                    <div className="text-red-400 text-sm text-center">
                        At least one image of your piece is required to proceed. <br />The image must include a piece of paper with your name on it, shown alongside your piece.
                    </div>
                )}

                {uploadedFiles.length > 0 && (
                    <div className="text-red-200/80 text-sm text-center">
                        Files will be uploaded when you submit the form
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;