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
  TablePagination,
  DialogContentText,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import crewMemberService from "../api/crewMemberService";
import type { CrewMember } from "../types/crewMember";

const {
  searchPagedCrewMembers,
  addCrewMember,
  updateCrewMember,
  deleteCrewMember,
} = crewMemberService;

const defaultForm: CrewMember = {
  crewId: 0,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  role: "",
};

export default function CrewMemberPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [form, setForm] = useState<CrewMember>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filters, setFilters] = useState<Partial<CrewMember>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadPagedCrewMembers = React.useCallback(async () => {
    const res = await searchPagedCrewMembers(page + 1, rowsPerPage, filters);
    setCrewMembers(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    loadPagedCrewMembers();
  }, [loadPagedCrewMembers]);

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
    setFilters({ ...filters, [name]: value });
    setPage(0);
  };

  const handleNew = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpen(true);
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const crew = crewMembers.find((c) => c.crewId === selectedIds[0]);
      if (crew) {
        setForm(crew);
        setIsEdit(true);
        setOpen(true);
      }
    }
  };

  const handleOpenDeleteConfirmation = () => {
    setOpenDelete(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDelete(false);
  };

  const handleDeleteConfirmation = async () => {
    for (const id of selectedIds) {
      await deleteCrewMember(id);
    }
    setSelectedIds([]);
    loadPagedCrewMembers();
    setSnackbarMessage("✅ Crew Member(s) deleted successfully.");
    setSnackbarOpen(true);
    handleCloseDeleteConfirmation();
  };

  const handleOpenUpdateConfirmation = () => setOpenUpdate(true);
  const handleCloseUpdateConfirmation = () => setOpenUpdate(false);

  const handleUpdateConfirmation = async () => {
    try {
      await updateCrewMember(form.crewId, form);
      setSnackbarMessage("✅ Crew Member updated successfully.");
      setOpen(false);
      setSelectedIds([]);
      loadPagedCrewMembers();
    } catch {
      setSnackbarMessage("❌ An error occurred while updating.");
    } finally {
      setSnackbarOpen(true);
      handleCloseUpdateConfirmation();
    }
  };

  const handleSave = async () => {
    if (form.firstName.trim() === "") {
      setSnackbarMessage("❌ Name is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.firstName.trim().length > 50) {
      setSnackbarMessage("❌ First Name must be at most 50 characters long.");
      setSnackbarOpen(true);
      return;
    }
    if (form.lastName.trim() === "") {
      setSnackbarMessage("❌ Last Name is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.lastName.trim().length > 50) {
      setSnackbarMessage("❌ Last Name must be at most 50 characters long.");
      setSnackbarOpen(true);
      return;
    }
    if (form.email.trim() === "") {
      setSnackbarMessage("❌ Email is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.email.trim().length > 100) {
      setSnackbarMessage("❌ email must be at most 100 characters long.");
      setSnackbarOpen(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setSnackbarMessage("❌ Please enter a valid email address.");
      setSnackbarOpen(true);
      return;
    }
    if (form.phoneNumber.trim() === "") {
      setSnackbarMessage("❌ Phone Number is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.phoneNumber.trim().length < 3) {
      setSnackbarMessage("❌ Last Name must be at most 50 characters long.");
      setSnackbarOpen(true);
      return;
    }
    if (form.phoneNumber.trim().length > 20) {
      setSnackbarMessage("❌ Phone Number must be at most 20 characters long.");
      setSnackbarOpen(true);
      return;
    }
    if (form.role.trim() === "") {
      setSnackbarMessage("❌ Role is required.");
      setSnackbarOpen(true);
      return;
    }
    if (form.role.length > 50) {
      setSnackbarMessage("❌ Role must be at most 50 characters long.");
      setSnackbarOpen(true);
      return;
    }

    if (isEdit) {
      handleOpenUpdateConfirmation();
    } else {
      try {
        await addCrewMember(form);
        setSnackbarMessage("✅ Crew Member added successfully.");
        setOpen(false);
        setSelectedIds([]);
        loadPagedCrewMembers();
      } catch {
        setSnackbarMessage("❌ An error occurred while saving.");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box p={3}>
      <h1>Crew Member Management</h1>

      {/* Filters */}
      <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
        {[
          { label: "Crew Member ID", name: "crewId", type: "number" },
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Email", name: "email" },
          { label: "Role", name: "role" },
        ].map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            size="small"
            value={filters[field.name as keyof CrewMember] ?? ""}
            onChange={handleFilterChange}
          />
        ))}
        <MuiTelInput
          label="Phone Number"
          name="phoneNumber"
          defaultCountry="TR"
          value={filters.phoneNumber || ""}
          onChange={(value) => setFilters({ ...filters, phoneNumber: value })}
          size="small"
        />
      </Box>

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
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crewMembers.map((c) => (
              <TableRow key={c.crewId}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(c.crewId)}
                    onChange={() => handleCheckbox(c.crewId)}
                  />
                </TableCell>
                <TableCell>{c.crewId}</TableCell>
                <TableCell>{c.firstName}</TableCell>
                <TableCell>{c.lastName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phoneNumber}</TableCell>
                <TableCell>{c.role}</TableCell>
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {isEdit ? "Edit Crew Member" : "Add New Crew Member"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="FirstName"
            name="firstName"
            value={form.firstName}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="LastName"
            name="lastName"
            value={form.lastName}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            error={
              form.email !== "" &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            }
            helperText={
              form.email !== "" &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                ? "Please enter a valid email address"
                : ""
            }
          />
          <MuiTelInput
            label="Phone Number"
            name="phoneNumber"
            defaultCountry="TR"
            value={form.phoneNumber}
            onChange={(value) => setForm({ ...form, phoneNumber: value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Role"
            name="role"
            value={form.role}
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected crew member(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation */}
      <Dialog open={openUpdate} onClose={handleCloseUpdateConfirmation}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this crew member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateConfirmation}>Cancel</Button>
          <Button onClick={handleUpdateConfirmation} variant="contained">
            Update
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
