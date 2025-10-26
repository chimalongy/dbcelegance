import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SizeManager({
  sizes,
  onUpdateSizes,
  isSaving: externalSaving, // optional: parent can control saving
  accessoryName,
}) {
  const [sizeslocal, setSizesLocal] = useState(sizes || []);
  const [editingSize, setEditingSize] = useState(null);
  const [formData, setFormData] = useState({
    size: "",
    sku: "",
    price: "",
    inventory: "",
  });
  const [skuEdited, setSkuEdited] = useState(false);

  // add modal states
  const [addingSize, setAddingSize] = useState(false);
  const [newSizeData, setNewSizeData] = useState({
    size: "",
    sku: "",
    price: "",
    inventory: "",
  });
  const [newSkuEdited, setNewSkuEdited] = useState(false);

  // save changes button state
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  // Update local state when sizes prop changes
  useEffect(() => {
    setSizesLocal(sizes || []);
  }, [sizes]);

  // Auto SKU for edit modal
  useEffect(() => {
    if (!skuEdited && formData.size) {
      const autoSku = `${slugify(accessoryName)}-${slugify(formData.size)}`;
      setFormData((prev) => ({ ...prev, sku: autoSku }));
    }
  }, [formData.size, accessoryName, skuEdited]);

  // Auto SKU for add modal
  useEffect(() => {
    if (!newSkuEdited && newSizeData.size) {
      const autoSku = `${slugify(accessoryName)}-${slugify(newSizeData.size)}`;
      setNewSizeData((prev) => ({ ...prev, sku: autoSku }));
    }
  }, [newSizeData.size, accessoryName, newSkuEdited]);

  const validateSize = (sizeObj) => {
    if (
      !sizeObj.size ||
      !sizeObj.sku ||
      sizeObj.price === "" ||
      sizeObj.inventory === ""
    ) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleEdit = (sizeObj, index) => {
    setEditingSize(index);
    setFormData(sizeObj);
    setSkuEdited(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sku") setSkuEdited(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!validateSize(formData)) return;
    const updatedSizes = [...sizeslocal];
    updatedSizes[editingSize] = formData;
    setSizesLocal(updatedSizes);
    onUpdateSizes(updatedSizes);
    setEditingSize(null);
    setHasChanges(true);
    toast.success("Size updated");
  };

  const handleDelete = (index) => {
    const updatedSizes = sizeslocal.filter((_, i) => i !== index);
    setSizesLocal(updatedSizes);
    onUpdateSizes(updatedSizes);
    setHasChanges(true);
    toast.success("Size deleted");
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    if (name === "sku") setNewSkuEdited(true);
    setNewSizeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSave = () => {
    if (!validateSize(newSizeData)) return;
    const updatedSizes = [...sizeslocal, newSizeData];
    setSizesLocal(updatedSizes);
    onUpdateSizes(updatedSizes);
    setNewSizeData({ size: "", sku: "", price: "", inventory: "" });
    setNewSkuEdited(false);
    setAddingSize(false);
    setHasChanges(true);
    toast.success("Size added");
  };

  // API call to save changes
  const handleSaveChanges = async () => {
    try {
    
    //   await axios.post("/api/sizes/update", { sizes: sizeslocal });
    //   setHasChanges(false);
    //   toast.success("Changes saved successfully");

    setIsSaving(true);
    await onUpdateSizes(sizeslocal)
    setHasChanges(false);
      
    
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Toaster />
      <h1 className="p-4">SizeManager</h1>

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setAddingSize(true)}
        >
          Add Size
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {(sizeslocal || []).map((size, index) => (
          <div key={index} className="bg-blue-100 p-2 rounded">
            <div>
              <p>Size: {size.size}</p>
              <p>SKU: {size.sku}</p>
              <div className="flex gap-3 justify-evenly">
                <p className="flex-1">Price: {size.price}</p>
                <p className="flex-1">Inventory: {size.inventory}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-between items-center mt-2">
              <button
                className="border p-2 flex-1 rounded bg-yellow-200"
                onClick={() => handleEdit(size, index)}
              >
                Edit
              </button>
              <button
                className="border p-2 flex-1 rounded bg-red-200"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Changes Button */}
      {hasChanges && (
        <div className="mt-6">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`px-6 py-3 rounded text-white ${
              isSaving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingSize !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Size</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Size"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                placeholder="Inventory"
                className="border p-2 rounded"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSize(null)}
                className="bg-gray-300 px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addingSize && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add New Size</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="size"
                value={newSizeData.size}
                onChange={handleNewChange}
                placeholder="Size"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="sku"
                value={newSizeData.sku}
                onChange={handleNewChange}
                placeholder="SKU"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={newSizeData.price}
                onChange={handleNewChange}
                placeholder="Price"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="inventory"
                value={newSizeData.inventory}
                onChange={handleNewChange}
                placeholder="Inventory"
                className="border p-2 rounded"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddSave}
                className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setAddingSize(false)}
                className="bg-gray-300 px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
