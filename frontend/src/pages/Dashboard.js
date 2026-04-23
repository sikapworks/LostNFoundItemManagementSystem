import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    contactInfo: ""
  });

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    const res = await axios.get("https://lostnfounditemmanagementsystem.onrender.com/api/items");
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`https://lostnfounditemmanagementsystem.onrender.com/api/items/${editingId}`, form, {
        headers: { Authorization: token }
      });
      setEditingId(null);
    } else {
      await axios.post("https://lostnfounditemmanagementsystem.onrender.com/api/items", form, {
        headers: { Authorization: token }
      });
    }

    setForm({
      itemName: "",
      description: "",
      type: "Lost",
      location: "",
      contactInfo: ""
    });

    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`https://lostnfounditemmanagementsystem.onrender.com/api/items/${id}`, {
      headers: { Authorization: token }
    });
    fetchItems();
  };

  const editItem = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const searchItems = async () => {
    const res = await axios.get(`https://lostnfounditemmanagementsystem.onrender.com/api/items/search?name=${search}`);
    setItems(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h3>Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>

      {/* Search */}
      <div className="input-group my-3">
        <input
          className="form-control"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={searchItems}>
          Search
        </button>
        <button className="btn btn-outline-secondary" onClick={fetchItems}>
          Reset
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-3 mb-3 shadow">
        <input name="itemName" placeholder="Item Name" className="form-control mb-2" value={form.itemName} onChange={handleChange} required />
        <input name="description" placeholder="Description" className="form-control mb-2" value={form.description} onChange={handleChange} />
        
        <select name="type" className="form-control mb-2" value={form.type} onChange={handleChange}>
          <option>Lost</option>
          <option>Found</option>
        </select>

        <input name="location" placeholder="Location" className="form-control mb-2" value={form.location} onChange={handleChange} />
        <input name="contactInfo" placeholder="Contact Info" className="form-control mb-2" value={form.contactInfo} onChange={handleChange} />

        <button className="btn btn-success">
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Items */}
      {items.map((item) => (
        <div key={item._id} className="card p-3 mb-2 shadow-sm">
          <h5>{item.itemName}</h5>
          <p>{item.description}</p>
          <p><strong>{item.type}</strong> | {item.location}</p>

          <div>
            <button className="btn btn-sm btn-warning me-2" onClick={() => editItem(item)}>
              Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;