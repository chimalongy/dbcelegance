import React, { useState } from 'react';
import {
  FiTrash2,
  FiEdit,
  FiLoader,
  FiChevronLeft,
  FiX,
  FiImage,
  FiPlus,
  FiClock,
  FiPackage,
  FiCheck,
  FiSave,
  FiEye,
  FiSliders,
  FiBox,
  FiLayers,
  FiDollarSign,
  FiTag,
  FiGrid,
  FiShoppingCart,
  FiCopy,
} from "react-icons/fi";

export default function MediaGallery({ media, onPreview, onDelete, onAdd }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validFiles = [];
    
    files.forEach(file => {
      // Check if file is image or video
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        errors.push({
          fileName: file.name,
          error: "Invalid file type. Only images and videos are allowed."
        });
        return;
      }
      
      // Check file size based on type
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
        errors.push({
          fileName: file.name,
          error: "Image size exceeds 2MB limit."
        });
        return;
      }
      
      if (file.type.startsWith('video/') && file.size > 3 * 1024 * 1024) {
        errors.push({
          fileName: file.name,
          error: "Video size exceeds 3MB limit."
        });
        return;
      }
      
      validFiles.push(file);
    });
    
    setSelectedFiles(validFiles);
    setFileErrors(errors);
  };

  const handleUpload = async () => {
    setUploading(true);
   
   
      const newMediaItems = selectedFiles.map(file => ({
          url:URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        file
      }))
      
      onAdd(newMediaItems);
      setSelectedFiles([]);
      setFileErrors([]);
      setShowUploadModal(false);
      setUploading(false);
    
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeError = (index) => {
    setFileErrors(prev => prev.filter((_, i) => i !== index));
  };

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiImage className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No media yet
        </h3>
        <p className="text-gray-400 mb-6">Add images to showcase your accessory</p>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
        >
          <FiPlus className="mr-2" />
          Add Media
        </button>
        
        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            onClose={() => {
              setShowUploadModal(false);
              setSelectedFiles([]);
              setFileErrors([]);
            }}
            onFileSelect={handleFileSelect}
            selectedFiles={selectedFiles}
            onUpload={handleUpload}
            onRemoveFile={removeSelectedFile}
            uploading={uploading}
            fileErrors={fileErrors}
            onRemoveError={removeError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Add Media Card */}
        <div 
          className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-400/70"
          onClick={() => setShowUploadModal(true)}
        >
          <FiPlus className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Add Media</span>
        </div>
        
        {/* Media Items */}
        {media.map((item, index) => (
          <MediaItem 
            key={index} 
            item={item} 
            index={index}
            onPreview={onPreview}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
            setFileErrors([]);
          }}
          onFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          onUpload={handleUpload}
          onRemoveFile={removeSelectedFile}
          uploading={uploading}
          fileErrors={fileErrors}
          onRemoveError={removeError}
        />
      )}
    </div>
  );
}

// Media Item Component
function MediaItem({ item, index, onPreview, onDelete }) {
  return (
    <div key={index} className="relative group">
      <div
        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:ring-2 hover:ring-blue-400/50"
        onClick={() => onPreview(index)}
      >
        {item.type === "video" ? (
          <div className="relative w-full h-full">
            <video src={item.url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FiEye className="text-white text-lg" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={item.url}
            alt={`Accessory image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
              e.target.className =
                "w-full h-full flex items-center justify-center bg-gray-100";
            }}
          />
        )}
      </div>

      {/* Mobile touch buttons - always visible on mobile */}
      <div className="md:hidden absolute top-2 right-2">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(index);
            }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
            title="View media"
          >
            <FiEye className="text-gray-600 text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item, index);
            }}
            className="bg-red-100/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
            title="Delete media"
          >
            <FiTrash2 className="text-red-600 text-sm" />
          </button>
        </div>
      </div>

      {/* Desktop hover buttons - only visible on hover for desktop */}
      <div className="hidden md:block absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(index);
            }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition-colors"
            title="View media"
          >
            <FiEye className="text-gray-600 text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item, index);
            }}
            className="bg-red-100/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:bg-red-200 transition-colors"
            title="Delete media"
          >
            <FiTrash2 className="text-red-600 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({ 
  onClose, 
  onFileSelect, 
  selectedFiles, 
  onUpload, 
  onRemoveFile, 
  uploading, 
  fileErrors, 
  onRemoveError 
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add Media</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              onChange={onFileSelect}
              className="hidden"
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <FiImage className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm mt-1">SVG, PNG, JPG, GIF or MP4</p>
              <p className="text-gray-400 text-xs mt-2">
                Max: 2MB for images, 3MB for videos
              </p>
            </label>
          </div>
          
          {/* Error messages */}
          {fileErrors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-red-600 mb-3">Invalid Files</h3>
              <div className="space-y-3">
                {fileErrors.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <FiX className="h-4 w-4 text-red-500 mr-2" />
                      <div className="text-sm">
                        <div className="font-medium text-red-800">{error.fileName}</div>
                        <div className="text-red-600">{error.error}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveError(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Selected Files</h3>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {file.type.startsWith('image/') ? (
                        <FiImage className="h-5 w-5 text-blue-500 mr-3" />
                      ) : (
                        <FiVideo className="h-5 w-5 text-purple-500 mr-3" />
                      )}
                      <div className="text-sm">
                        <div className="truncate max-w-xs">{file.name}</div>
                        <div className="text-gray-500 text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveFile(index)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// FiVideo icon component
function FiVideo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  );
}

