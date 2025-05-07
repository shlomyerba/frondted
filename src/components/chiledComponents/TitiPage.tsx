import { FC, useEffect, useState } from "react";
import { getItems, addItem, deleteItem } from "../../services/apiService";
import "./TitiPage.scss";

const TitiPage: FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const fetchItems = async () => {
    try {
      const response = await getItems();
      console.log(response)
      if (response.success) {
        setItems(response.items);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const trimmedName = newItemName.trim();
    if (!trimmedName) return;

    try {
      const response = await addItem({ name: trimmedName });
      if (response.success) {
        await fetchItems();
        setNewItemName("");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (itemName: string) => {
    try {
      const trimmedName = itemName.trim();
      const response = await deleteItem(trimmedName);
      if (response.success) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Items</h1>
      <ul className="items-list">
        {items.map((item, index) => (
          <li key={index} className="item-row">
            <span>{item}</span>
            <button
              onClick={() => handleDeleteItem(item)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddItem} className="add-form">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item"
          className="add-input"
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default TitiPage;
