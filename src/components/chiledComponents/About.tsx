import { FC, useEffect, useState } from "react";
import { getItems, addItem, deleteItem } from "../../services/apiService";
import "./About.scss";

const About: FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const fetchItems = async () => {
    try {
      const response = await getItems();
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



  return (
    <div className="app-container">
       <h1>About Page</h1>;
    </div>
  );
};

export default About;
