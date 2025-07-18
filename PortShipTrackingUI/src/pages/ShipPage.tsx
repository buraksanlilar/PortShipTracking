import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
} from "@mui/material";
import type { Ship } from "../types/ship";
import shipService from "../api/shipService";

const { getShips, addShip, updateShip, deleteShip } = shipService;

const defaultForm: Ship = {
  shipId: 0,
  imo: "",
  name: "",
  type: "",
  flag: "",
  yearBuilt: new Date().getFullYear(),
};

export default function ShipPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Ship>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    loadShips();
  }, []);

  const loadShips = async () => {
    const res = await getShips();
    setShips(res);
  };

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteShip(id);
    }
    setSelectedIds([]);
    loadShips();
    setSnackbarMessage("✅ Ship(s) deleted successfully.");
    setSnackbarOpen(true);
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const ship = ships.find((s) => s.shipId === selectedIds[0]);
      if (ship) {
        setForm(ship);
        setIsEdit(true);
        setOpen(true);
      }
    }
  };

  const handleNew = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // IMO benzersiz olmalı (sadece yeni gemide kontrol edilir)
    if (!isEdit && ships.some((s) => s.imo.trim() === form.imo.trim())) {
      setSnackbarMessage("❌ A ship with this IMO number already exists.");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isEdit) {
        await updateShip(form.shipId, form);
        setSnackbarMessage("✅ Ship updated successfully.");
      } else {
        await addShip(form);
        setSnackbarMessage("✅ Ship added successfully.");
      }
      setOpen(false);
      setSelectedIds([]);
      loadShips();
    } catch {
      setSnackbarMessage("❌ An error occurred while saving.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box p={3}>
      <h1>Ship Management</h1>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={handleNew}>
          New
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleEdit}
          disabled={selectedIds.length !== 1}
          style={{ marginLeft: 8 }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={selectedIds.length === 0}
          style={{ marginLeft: 8 }}
        >
          Delete
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Ship ID</TableCell>
              <TableCell>IMO</TableCell>
              <TableCell>Ship Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Flag</TableCell>
              <TableCell>Year Built</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ships.map((ship) => (
              <TableRow key={ship.shipId}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(ship.shipId)}
                    onChange={() => handleCheckbox(ship.shipId)}
                  />
                </TableCell>
                <TableCell>{ship.shipId}</TableCell>
                <TableCell>{ship.imo}</TableCell>
                <TableCell>{ship.name}</TableCell>
                <TableCell>{ship.type}</TableCell>
                <TableCell>{ship.flag}</TableCell>
                <TableCell>{ship.yearBuilt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Ship" : "Add New Ship"}</DialogTitle>
        <DialogContent>
          <TextField
            label="IMO"
            name="imo"
            value={form.imo}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Ship Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Type"
            name="type"
            value={form.type}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Flag"
            name="flag"
            value={form.flag}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Year Built"
            name="yearBuilt"
            type="number"
            value={form.yearBuilt}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}
