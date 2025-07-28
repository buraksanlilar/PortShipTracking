import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Checkbox,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import type { Cargo } from "../types/cargo";
import type { Ship } from "../types/ship";
import cargoService from "../api/cargoService";
import shipService from "../api/shipService";

const { searchPagedCargo, addCargo, updateCargo, deleteCargo } = cargoService;

const defaultForm: Cargo = {
  cargoId: 0,
  shipId: 0,
  description: "",
  weightTon: 0,
  cargoType: "",
};

export default function CargoPage() {
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form, setForm] = useState<Cargo>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filters, setFilters] = useState<
    Partial<Cargo & { shipName?: string }>
  >({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadPagedCargo = React.useCallback(async () => {
    const res = await searchPagedCargo(page + 1, rowsPerPage, filters);
    setCargoList(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    loadPagedCargo();
    (async () => {
      const shipList = await shipService.getShips();
      setShips(shipList);
    })();
  }, [loadPagedCargo]);

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters({
      ...filters,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    });
    setPage(0);
  };

  const handleNew = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpen(true);
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteCargo(id);
    }
    setSelectedIds([]);
    loadPagedCargo();
    setSnackbarMessage("✅ Cargo(s) deleted successfully.");
    setSnackbarOpen(true);
  };

  const handleOpenDeleteConfirmation = () => setOpenDelete(true);
  const handleCloseDeleteConfirmation = () => setOpenDelete(false);
  const handleDeleteConfirmation = () => {
    handleDelete();
    handleCloseDeleteConfirmation();
  };

  const handleOpenUpdateConfirmation = () => setOpenUpdate(true);
  const handleCloseUpdateConfirmation = () => setOpenUpdate(false);
  const handleUpdateConfirmation = async () => {
    try {
      await updateCargo(form.cargoId, form);
      setSnackbarMessage("✅ Cargo updated successfully.");
      setOpen(false);
      setSelectedIds([]);
      loadPagedCargo();
    } catch {
      setSnackbarMessage("❌ An error occurred while updating.");
    } finally {
      setSnackbarOpen(true);
      handleCloseUpdateConfirmation();
    }
  };

  const handleSave = async () => {
    if (form.description.trim() === "") {
      setSnackbarMessage("❌ Description is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.cargoType.trim() === "") {
      setSnackbarMessage("❌ Cargo type is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.weightTon <= 0) {
      setSnackbarMessage("❌ Weight must be greater than 0.");
      setSnackbarOpen(true);
      return;
    }
    if (form.shipId <= 0) {
      setSnackbarMessage("❌ Invalid Ship ID.");
      setSnackbarOpen(true);
      return;
    }

    if (isEdit) {
      handleOpenUpdateConfirmation();
    } else {
      try {
        await addCargo(form);
        setSnackbarMessage("✅ Cargo added successfully.");
        setOpen(false);
        setSelectedIds([]);
        loadPagedCargo();
      } catch {
        setSnackbarMessage("❌ An error occurred while saving.");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={"bold"}>
        Cargo Management
      </Typography>

      {/* Filters */}
      <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
        <Autocomplete
          options={ships}
          getOptionLabel={(option) => `${option.name} (ID: ${option.shipId})`}
          value={ships.find((s) => s.shipId === filters.shipId) || null}
          onChange={(_, newValue) => {
            setFilters({ ...filters, shipId: newValue?.shipId ?? undefined });
            setPage(0);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Ship" size="small" />
          )}
          isOptionEqualToValue={(option, value) =>
            option.shipId === value.shipId
          }
          sx={{ minWidth: 250 }}
        />

        {[
          { label: "Description", name: "description" },
          { label: "Weight (Ton)", name: "weightTon", type: "number" },
          { label: "Type", name: "cargoType" },
        ].map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            size="small"
            value={(filters as Record<string, unknown>)[field.name] ?? ""}
            onChange={handleFilterChange}
          />
        ))}
        {/* Actions */}
        <Box mb={2}>
          <Button
            variant="contained"
            onClick={handleNew}
            sx={{ bgcolor: "#456882", color: "white" }}
          >
            New
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={selectedIds.length === 0}
            onClick={handleOpenDeleteConfirmation}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Dialogs */}
      <Dialog open={openDelete} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Delete Cargo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? Deleting cargo may affect other records.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdateConfirmation}>
        <DialogTitle>Update Cargo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this cargo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateConfirmation}>Cancel</Button>
          <Button onClick={handleUpdateConfirmation} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#456882" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ship
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Weight (Ton)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargoList.map((cargo) => (
              <TableRow key={cargo.cargoId}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(cargo.cargoId)}
                    onChange={() => handleCheckbox(cargo.cargoId)}
                  />
                </TableCell>
                <TableCell>
                  {(ships.find((s) => s.shipId === cargo.shipId)?.name || "") +
                    (" " + cargo.shipId) || cargo.shipId}
                </TableCell>
                <TableCell>{cargo.description}</TableCell>
                <TableCell>{cargo.weightTon}</TableCell>
                <TableCell>{cargo.cargoType}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setForm(cargo);
                      setIsEdit(true);
                      setOpen(true);
                    }}
                    sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Cargo" : "Add New Cargo"}</DialogTitle>
        <DialogContent>
          <Autocomplete
            disablePortal
            options={ships}
            getOptionLabel={(option) => `${option.name} (ID: ${option.shipId})`}
            value={ships.find((s) => s.shipId === form.shipId) || null}
            onChange={(_, newValue) => {
              setForm({ ...form, shipId: newValue?.shipId || 0 });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Ship" size="small" />
            )}
            isOptionEqualToValue={(option, value) =>
              option.shipId === value.shipId
            }
            sx={{ minWidth: 250 }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Weight (Ton)"
            name="weightTon"
            type="number"
            value={form.weightTon}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Type"
            name="cargoType"
            value={form.cargoType}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            sx={{ bgcolor: "#456882", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: "#456882", color: "white" }}
          >
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
