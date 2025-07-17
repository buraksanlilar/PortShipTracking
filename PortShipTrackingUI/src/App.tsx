import "./App.css";
import React, { useEffect, useState } from "react";
import api from "./api/api";

interface Ship {
  shipId: number;
  name: string;
  imo: string;
  type: string;
  flag: string;
  yearBuilt: number;
}

function App() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [newShip, setNewShip] = useState<Omit<Ship, "shipId">>({
    name: "",
    imo: "",
    type: "",
    flag: "",
    yearBuilt: new Date().getFullYear(),
  });

  useEffect(() => {
    api.get("/Ships").then((res) => {
      setShips(res.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShip((prev) => ({
      ...prev,
      [name]: name === "yearBuilt" ? parseInt(value) : value,
    }));
  };

  const handleAddShip = () => {
    api.post("/Ships", newShip).then((res) => {
      setShips((prev) => [...prev, res.data]); // yeni gemiyi listeye ekle
      setNewShip({
        name: "",
        imo: "",
        type: "",
        flag: "",
        yearBuilt: new Date().getFullYear(),
      });
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Ship</h2>
      <input
        name="name"
        placeholder="Name"
        value={newShip.name}
        onChange={handleChange}
      />
      <input
        name="imo"
        placeholder="IMO"
        value={newShip.imo}
        onChange={handleChange}
      />
      <input
        name="type"
        placeholder="Type"
        value={newShip.type}
        onChange={handleChange}
      />
      <input
        name="flag"
        placeholder="Flag"
        value={newShip.flag}
        onChange={handleChange}
      />
      <input
        name="yearBuilt"
        type="number"
        placeholder="Year Built"
        value={newShip.yearBuilt}
        onChange={handleChange}
      />
      <button onClick={handleAddShip}>Add Ship</button>

      <h3>Ship List</h3>
      <ol>
        {ships.map((ship) => (
          <li key={ship.shipId}>
            {ship.name} ({ship.imo}) - {ship.type} - {ship.flag} -{" "}
            {ship.yearBuilt}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
