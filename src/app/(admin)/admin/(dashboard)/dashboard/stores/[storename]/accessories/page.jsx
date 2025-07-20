"use client"
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiChevronUp, FiChevronDown, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AccessoryManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: null,
    previewImage: null
  });
  
  const [accessoryForm, setAccessoryForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    sku: '',
    categoryId: '',
    images: [],
    previewImages: []
  });

  // Fetch data on component mount
  useEffect(() => {
    // TODO: Fetch categories and accessories from API
    // Mock data for demonstration
    setCategories([
      { id: 1, name: 'Jewelry', description: 'Necklaces, bracelets, rings', image_url: 'jewelry.jpg' },
      { id: 2, name: 'Bags', description: 'Handbags, clutches, backpacks', image_url: 'bags.jpg' }
    ]);
    
    setAccessories([
      { id: 1, name: 'Silver Necklace', description: 'Elegant silver necklace', price: 49.99, stockQuantity: 25, sku: 'ACC-001', categoryId: 1, images: ['necklace1.jpg', 'necklace2.jpg'] },
      { id: 2, name: 'Leather Tote', description: 'Premium leather tote bag', price: 129.99, stockQuantity: 10, sku: 'ACC-002', categoryId: 2, images: ['tote1.jpg'] }
    ]);
  }, []);

  // Filter items based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAccessories = accessories.filter(accessory => 
    accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category handlers
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    // TODO: API call to create/update category
    if (currentItem) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === currentItem.id ? { ...cat, ...categoryForm } : cat
      ));
      toast.success('Category updated successfully');
    } else {
      // Add new category
      const newCategory = {
        id: categories.length + 1,
        ...categoryForm
      };
      setCategories([...categories, newCategory]);
      toast.success('Category added successfully');
    }
    setIsCategoryModalOpen(false);
    resetForms();
  };

  const handleEditCategory = (category) => {
    setCurrentItem(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      image: null,
      previewImage: category.image_url
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    // TODO: Confirm deletion and check if category has accessories
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Category deleted successfully');
  };

  // Accessory handlers
  const handleAccessorySubmit = (e) => {
    e.preventDefault();
    // TODO: API call to create/update accessory
    if (currentItem) {
      // Update existing accessory
      setAccessories(accessories.map(acc => 
        acc.id === currentItem.id ? { ...acc, ...accessoryForm } : acc
      ));
      toast.success('Accessory updated successfully');
    } else {
      // Add new accessory
      const newAccessory = {
        id: accessories.length + 1,
        ...accessoryForm
      };
      setAccessories([...accessories, newAccessory]);
      toast.success('Accessory added successfully');
    }
    setIsAccessoryModalOpen(false);
    resetForms();
  };

  const handleEditAccessory = (accessory) => {
    setCurrentItem(accessory);
    setAccessoryForm({
      name: accessory.name,
      description: accessory.description,
      price: accessory.price,
      stockQuantity: accessory.stockQuantity,
      sku: accessory.sku,
      categoryId: accessory.categoryId,
      images: [],
      previewImages: accessory.images
    });
    setIsAccessoryModalOpen(true);
  };

  const handleDeleteAccessory = (id) => {
    // TODO: Confirm deletion
    setAccessories(accessories.filter(acc => acc.id !== id));
    toast.success('Accessory deleted successfully');
  };

  // Image handlers
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryForm({
        ...categoryForm,
        image: file,
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const handleAccessoryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    
    setAccessoryForm({
      ...accessoryForm,
      images: [...accessoryForm.images, ...files],
      previewImages: [...accessoryForm.previewImages, ...newPreviewImages]
    });
  };

  const removeAccessoryImage = (index) => {
    const updatedImages = [...accessoryForm.images];
    const updatedPreviews = [...accessoryForm.previewImages];
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setAccessoryForm({
      ...accessoryForm,
      images: updatedImages,
      previewImages: updatedPreviews
    });
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    
    const updatedImages = [...accessoryForm.images];
    const updatedPreviews = [...accessoryForm.previewImages];
    
    // Swap with previous image
    [updatedImages[index], updatedImages[index - 1]] = [updatedImages[index - 1], updatedImages[index]];
    [updatedPreviews[index], updatedPreviews[index - 1]] = [updatedPreviews[index - 1], updatedPreviews[index]];
    
    setAccessoryForm({
      ...accessoryForm,
      images: updatedImages,
      previewImages: updatedPreviews
    });
  };

  const moveImageDown = (index) => {
    if (index === accessoryForm.images.length - 1) return;
    
    const updatedImages = [...accessoryForm.images];
    const updatedPreviews = [...accessoryForm.previewImages];
    
    // Swap with next image
    [updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]];
    [updatedPreviews[index], updatedPreviews[index + 1]] = [updatedPreviews[index + 1], updatedPreviews[index]];
    
    setAccessoryForm({
      ...accessoryForm,
      images: updatedImages,
      previewImages: updatedPreviews
    });
  };

  // Reset forms
  const resetForms = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: null,
      previewImage: null
    });
    
    setAccessoryForm({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      sku: '',
      categoryId: '',
      images: [],
      previewImages: []
    });
    
    setCurrentItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Accessory Management</h1>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'accessories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('accessories')}
        >
          Accessories
        </button>
      </div>
      
      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => {
            resetForms();
            activeTab === 'categories' ? setIsCategoryModalOpen(true) : setIsAccessoryModalOpen(true);
          }}
        >
          <FiPlus className="mr-2" />
          Add {activeTab === 'categories' ? 'Category' : 'Accessory'}
        </button>
      </div>
      
      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Accessories Tab */}
      {activeTab === 'accessories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccessories.map((accessory) => (
                <tr key={accessory.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{accessory.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{accessory.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(c => c.id === accessory.categoryId)?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${accessory.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accessory.stockQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accessory.sku || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditAccessory(accessory)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteAccessory(accessory.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentItem ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 flex items-center">
                    <FiImage className="mr-2" />
                    {categoryForm.image ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      required={!currentItem}
                    />
                  </label>
                  {categoryForm.previewImage && (
                    <div className="ml-4 relative">
                      <img
                        src={categoryForm.previewImage}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentItem ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Accessory Modal */}
      {isAccessoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentItem ? 'Edit Accessory' : 'Add New Accessory'}
              </h2>
              <button onClick={() => setIsAccessoryModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAccessorySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={accessoryForm.name}
                    onChange={(e) => setAccessoryForm({...accessoryForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={accessoryForm.categoryId}
                    onChange={(e) => setAccessoryForm({...accessoryForm, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={accessoryForm.description}
                  onChange={(e) => setAccessoryForm({...accessoryForm, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={accessoryForm.price}
                    onChange={(e) => setAccessoryForm({...accessoryForm, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={accessoryForm.stockQuantity}
                    onChange={(e) => setAccessoryForm({...accessoryForm, stockQuantity: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={accessoryForm.sku}
                    onChange={(e) => setAccessoryForm({...accessoryForm, sku: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Images *</label>
                <div className="flex items-center mb-2">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 flex items-center">
                    <FiImage className="mr-2" />
                    Add Images
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAccessoryImagesChange}
                      multiple
                      required={accessoryForm.previewImages.length === 0}
                    />
                  </label>
                </div>
                
                {accessoryForm.previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {accessoryForm.previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full object-cover rounded-md border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                            disabled={index === 0}
                          >
                            <FiChevronUp className={index === 0 ? 'text-gray-400' : 'text-gray-700'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                            disabled={index === accessoryForm.previewImages.length - 1}
                          >
                            <FiChevronDown className={index === accessoryForm.previewImages.length - 1 ? 'text-gray-400' : 'text-gray-700'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAccessoryImage(index)}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                          >
                            <FiX className="text-red-600" />
                          </button>
                        </div>
                        <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAccessoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentItem ? 'Update' : 'Create'} Accessory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessoryManagement;