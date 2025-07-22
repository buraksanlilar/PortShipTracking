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
  TableRow,
  TextField,
  Checkbox,
  TablePagination,
} from "@mui/material";
import type { Port } from "../types/port";
import portService from "../api/portService";

const { searchPagedPorts, addPort, updatePort, deletePort } = portService;

const defaultForm: Port = {
  portId: 0,
  name: "",
  country: "",
  city: "",
};

export default function PortPage() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form, setForm] = useState<Port>(defaultForm);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [filters, setFilters] = useState<
    Record<keyof Port, string | undefined>
  >({
    portId: undefined,
    name: undefined,
    country: undefined,
    city: undefined,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadPagedPorts = React.useCallback(async () => {
    const res = await searchPagedPorts(page + 1, rowsPerPage, {
      ...filters,
      portId: filters.portId ? Number(filters.portId) : undefined,
    });
    setPorts(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    loadPagedPorts();
  }, [loadPagedPorts]);

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
    setPage(0);
  };

  const handleSave = async () => {
    if (!form.name || !form.country || !form.city) {
      setSnackbarMessage("❌ Please fill in all fields.");
      setSnackbarOpen(true);
      return;
    }
    if (isEdit) {
      handleOpenUpdateConfirmation();
    } else {
      try {
        await addPort(form);
        setSnackbarMessage("✅ Port added successfully.");
        setOpen(false);
        setSelectedIds([]);
        loadPagedPorts();
      } catch {
        setSnackbarMessage("❌ Error occurred while adding port.");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deletePort(id);
    }
    setSelectedIds([]);
    loadPagedPorts();
    setSnackbarMessage("✅ Port(s) deleted successfully.");
    setSnackbarOpen(true);
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const port = ports.find((p) => p.portId === selectedIds[0]);
      if (port) {
        setForm(port);
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
      await updatePort(form.portId, form);
      setSnackbarMessage("✅ Port updated successfully.");
      setOpen(false);
      setSelectedIds([]);
      loadPagedPorts();
    } catch {
      setSnackbarMessage("❌ Error occurred while updating port.");
    } finally {
      setSnackbarOpen(true);
      handleCloseUpdateConfirmation();
    }
  };

  return (
    <Box p={3}>
      <h1>Port Management</h1>

      {/* Filters */}
      <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
        {[
          { label: "Port ID", name: "portId" },
          { label: "Name", name: "name" },
          { label: "Country", name: "country" },
          { label: "City", name: "city" },
        ].map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            size="small"
            value={(filters as Partial<Port>)[field.name as keyof Port] ?? ""}
            onChange={handleFilterChange}
          />
        ))}
      </Box>

      {/* Action Buttons */}
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

      {/* Port Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Port ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ports.map((port) => (
              <TableRow key={port.portId}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(port.portId)}
                    onChange={() => handleCheckbox(port.portId)}
                  />
                </TableCell>
                <TableCell>{port.portId}</TableCell>
                <TableCell>{port.name}</TableCell>
                <TableCell>{port.country}</TableCell>
                <TableCell>{port.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Port" : "Add New Port"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            name="city"
            value={form.city}
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

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>
          Are you sure you want to delete selected ports?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Warning: Deleting ports may affect other data in the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation */}
      <Dialog open={openUpdate} onClose={handleCloseUpdateConfirmation}>
        <DialogTitle>Are you sure you want to update this port?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Warning: Changes may affect other parts of the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateConfirmation}>Cancel</Button>
          <Button onClick={handleUpdateConfirmation} autoFocus>
            Update
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
