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
  FormControl,
  TablePagination,
  DialogContentText,
} from "@mui/material";
import type { Ship } from "../types/ship";
import ReactFlagsSelect from "react-flags-select";
import shipService from "../api/shipService";

const {
  searchPagedShips, // yeni eklenecek fonksiyon
  addShip,
  updateShip,
  deleteShip,
} = shipService;

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
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [form, setForm] = useState<Ship>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filters, setFilters] = useState<Partial<Ship>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadPagedShips = React.useCallback(async () => {
    const res = await searchPagedShips(page + 1, rowsPerPage, filters);
    setShips(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    loadPagedShips();
  }, [loadPagedShips]);

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpenDeleteConfirmation = () => {
    setOpenDelete(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setOpenDelete(false);
  };
  const handleDeleteConfirmation = () => {
    handleDelete();
    handleCloseDeleteConfirmation();
  };

  const handleOpenUpdateConfirmation = () => {
    setOpenUpdate(true);
  };
  const handleCloseUpdateConfirmation = () => {
    setOpenUpdate(false);
    return;
  };
  const handleUpdateConfirmation = async () => {
    try {
      await updateShip(form.shipId, form);
      setSnackbarMessage("✅ Ship updated successfully.");
      setOpen(false);
      setSelectedIds([]);
      loadPagedShips();
    } catch {
      setSnackbarMessage("❌ An error occurred while saving.");
    } finally {
      setSnackbarOpen(true);
      handleCloseUpdateConfirmation();
    }
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteShip(id);
    }
    setSelectedIds([]);
    loadPagedShips();
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const updatedFilters = {
      ...filters,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    };
    setFilters(updatedFilters);
    setPage(0);
  };

  const handleSave = async () => {
    if (form.imo.trim() === "") {
      setSnackbarMessage("❌ IMO number is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.imo.length > 10) {
      setSnackbarMessage("❌ IMO number cannot exceed 10 characters.");
      setSnackbarOpen(true);
      return;
    }
    // Remove invalid comparison or replace with a valid check
    if (!isEdit && ships.some((ship) => ship.imo === form.imo.trim())) {
      setSnackbarMessage("❌ IMO number already exists.");
      setSnackbarOpen(true);
      return;
    }
    if (form.name.trim() === "") {
      setSnackbarMessage("❌ Ship name is required.");
      setSnackbarOpen(true);
      return;
    }

    if (form.name.length > 100) {
      setSnackbarMessage("❌ Ship name cannot exceed 100 characters.");
      setSnackbarOpen(true);
      return;
    }
    if (form.type.trim() === "") {
      setSnackbarMessage("❌ Ship type is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.type.length > 50) {
      setSnackbarMessage("❌ Ship type cannot exceed 50 characters.");
      setSnackbarOpen(true);
      return;
    }
    if (form.flag === "") {
      setSnackbarMessage("❌ Please select a flag.");
      setSnackbarOpen(true);
      return;
    }
    if (form.yearBuilt < 1800 || form.yearBuilt > new Date().getFullYear()) {
      setSnackbarMessage("❌ Invalid year built.");
      setSnackbarOpen(true);
      return;
    }
    if (isEdit) {
      handleOpenUpdateConfirmation();
    }
    if (!isEdit) {
      try {
        await addShip(form);
        setSnackbarMessage("✅ Ship added successfully.");
        setOpen(false);
        setSelectedIds([]);
        loadPagedShips();
      } catch {
        setSnackbarMessage("❌ An error occurred while saving.");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box p={3}>
      <h1>Ship Management</h1>

      {/* Filters */}
      <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
        {[
          { label: "Ship ID", name: "shipId", type: "number" },
          { label: "IMO", name: "imo" },
          { label: "Name", name: "name" },
          { label: "Type", name: "type" },
          { label: "Flag", name: "flag" },
          { label: "Year Built", name: "yearBuilt", type: "number" },
        ].map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            size="small"
            value={(filters as Partial<Ship>)[field.name as keyof Ship] ?? ""}
            onChange={handleFilterChange}
          />
        ))}
      </Box>
      <Dialog
        open={openDelete}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete those Ships?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Warning: Deleting these ships may affect related data and system
            functionality. Please proceed with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Disagree</Button>
          <Button onClick={handleDeleteConfirmation} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdateConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to update the Ship?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Warning: Updating this ships may affect related data and system
            functionality. Please proceed with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateConfirmation}>Disagree</Button>
          <Button onClick={handleUpdateConfirmation} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Box mb={2}>
        <Button variant="contained" onClick={handleNew}>
          New
        </Button>
        <Button
          variant="contained"
          onClick={handleEdit}
          disabled={selectedIds.length !== 1}
          sx={{ ml: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDeleteConfirmation}
          disabled={selectedIds.length === 0}
          sx={{ ml: 1 }}
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
              <TableCell>Name</TableCell>
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

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

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
          <FormControl fullWidth margin="dense">
            <Box
              sx={{
                mt: 0.5,
                ".ReactFlagsSelect-module_selectBtn__": {
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  padding: "8.5px 14px",
                  fontSize: "16px",
                  width: "100%",
                },
              }}
            >
              <ReactFlagsSelect
                selected={form.flag}
                onSelect={(code) =>
                  handleFormChange({
                    target: {
                      name: "flag",
                      value: code,
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                searchable
                placeholder="Select Flag"
              />
            </Box>
          </FormControl>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}
