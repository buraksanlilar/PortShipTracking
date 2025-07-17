import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
/*
const [newShip, setNewShip] = useState<Omit<Ship, "shipId">>({
    name: "",
    imo: "",
    type: "",
    flag: "",
    yearBuilt: new Date().getFullYear(),
  });

  const [shipList, setShipList] = useState<Ship[]>([]);

  useEffect(() => {
    shipService.getShips().then((ships) => setShipList(ships));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShip((prev) => ({
      ...prev,
      [name]: name === "yearBuilt" ? parseInt(value) : value,
    }));
  };

  const handleAddShip = async () => {
    await shipService.addShip({
      ...newShip,
      shipId: 0,
    });
    const updatedShips = await shipService.getShips();
    setShipList(updatedShips);
  };
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
        {shipList.map((ship) => (
          <li key={ship.shipId}>
            {ship.name} ({ship.imo}) - {ship.type} - {ship.flag} -{" "}
            {ship.yearBuilt}
          </li>
        ))}
      </ol>
    </div>
*/
