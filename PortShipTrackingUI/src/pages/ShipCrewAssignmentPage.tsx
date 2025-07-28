import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import shipCrewAssignmentService from "../api/shipCrewAssignmentService";
import type { ShipCrewAssignment } from "../types/shipCrewAssignment";
import crewMemberService from "../api/crewMemberService";
import shipService from "../api/shipService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const {
  searchPaged,
  addShipCrewAssignment,
  updateShipCrewAssignment,
  deleteShipCrewAssignment,
} = shipCrewAssignmentService;

const defaultForm: ShipCrewAssignment = {
  assignmentId: 0,
  shipId: 0,
  crewId: 0,
  assignmentDate: "",
};

export default function ShipCrewAssignmentPage() {
  const [assignments, setAssignments] = useState<ShipCrewAssignment[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ShipCrewAssignment>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [filters, setFilters] = useState<Partial<ShipCrewAssignment>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [ships, setShips] = useState<{ shipId: number; name: string }[]>([]);
  const [crewMembers, setCrewMembers] = useState<
    {
      crewId: number;
      firstName: string;
      lastName: string;
    }[]
  >([]);

  const loadAssignments = useCallback(async () => {
    const queryFilters: Record<string, string | number | undefined> = {};
    if (filters.assignmentId) queryFilters.assignmentId = filters.assignmentId;
    if (filters.shipId) queryFilters.shipId = filters.shipId;
    if (filters.crewId) queryFilters.crewId = filters.crewId;
    if (filters.assignmentDate)
      queryFilters.assignmentDate = filters.assignmentDate;

    const res = await searchPaged(page + 1, rowsPerPage, queryFilters);
    setAssignments(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  const loadDropdowns = async () => {
    const shipData = await shipService.getShips();
    const crewMemberData = await crewMemberService.getCrewMembers();
    setShips(shipData);
    setCrewMembers(crewMemberData);
  };

  useEffect(() => {
    loadAssignments();
    loadDropdowns();
  }, [loadAssignments]);

  const getShipLabel = (shipId: number) => {
    const ship = ships.find((s) => s.shipId === shipId);
    return ship ? `${ship.shipId} - ${ship.name}` : shipId;
  };

  const getCrewLabel = (crewId: number) => {
    const crew = crewMembers.find((c) => c.crewId === crewId);
    return crew
      ? `${crew.crewId} - ${crew.firstName} ${crew.lastName}`
      : crewId;
  };

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  */

  const handleNew = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpen(true);
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteShipCrewAssignment(id);
    }
    setSelectedIds([]);
    loadAssignments();
    setSnackbarMessage("✅ Assignment(s) deleted successfully.");
    setSnackbarOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        assignmentDate: new Date(form.assignmentDate).toISOString(),
      };

      if (isEdit) {
        await updateShipCrewAssignment(form.assignmentId, payload);
        setSnackbarMessage("✅ Assignment updated.");
      } else {
        await addShipCrewAssignment(payload);
        setSnackbarMessage("✅ Assignment created.");
      }

      setOpen(false);
      setSelectedIds([]);
      loadAssignments();
    } catch {
      setSnackbarMessage("❌ Error while saving.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={"bold"}>
        Ship Crew Assignments
      </Typography>
      {
        // Filters Section
      }
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          mb={2}
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Autocomplete
            options={ships}
            getOptionLabel={(option) => `${option.shipId} - ${option.name}`}
            onChange={(_, newValue) => {
              setFilters((prev) => ({
                ...prev,
                shipId: newValue?.shipId ?? undefined,
              }));
              setPage(0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ship"
                size="small"
                sx={{ minWidth: 200 }}
              />
            )}
            value={ships.find((s) => s.shipId === filters.shipId) ?? null}
            sx={{ flexGrow: 1 }}
          />

          <Autocomplete
            options={crewMembers}
            getOptionLabel={(option) =>
              `${option.crewId} - ${option.firstName} ${option.lastName}`
            }
            onChange={(_, newValue) => {
              setFilters((prev) => ({
                ...prev,
                crewId: newValue?.crewId ?? undefined,
              }));
              setPage(0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Crew Member"
                size="small"
                sx={{ minWidth: 200 }}
              />
            )}
            value={crewMembers.find((c) => c.crewId === filters.crewId) ?? null}
            sx={{ flexGrow: 1 }}
          />

          <DatePicker
            label="Assignment Date"
            value={
              filters.assignmentDate ? dayjs(filters.assignmentDate) : null
            }
            onChange={(newValue) => {
              setFilters((prev) => ({
                ...prev,
                assignmentDate: newValue ? newValue.toISOString() : undefined,
              }));
              setPage(0);
            }}
            slotProps={{ textField: { size: "small", sx: { minWidth: 220 } } }}
          />
          <Box mb={2}>
            <Button
              variant="contained"
              onClick={handleNew}
              sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
            >
              New
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 1 }}
              disabled={selectedIds.length === 0}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Ship</TableCell>
              <TableCell>Crew Member</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((row) => (
              <TableRow key={row.assignmentId}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(row.assignmentId)}
                    onChange={() => handleCheckbox(row.assignmentId)}
                  />
                </TableCell>
                <TableCell>{getShipLabel(row.shipId)}</TableCell>
                <TableCell>{getCrewLabel(row.crewId)}</TableCell>
                <TableCell>
                  {new Date(row.assignmentDate).toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
                    onClick={() => {
                      setForm(row);
                      setIsEdit(true);
                      setOpen(true);
                    }}
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
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {isEdit ? "Edit Assignment" : "New Assignment"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            options={ships}
            getOptionLabel={(option) => `${option.shipId} - ${option.name}`}
            value={ships.find((s) => s.shipId === form.shipId) ?? null}
            onChange={(_, newValue) => {
              setForm((prev) => ({
                ...prev,
                shipId: newValue?.shipId ?? 0,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="dense" label="Ship" />
            )}
          />

          <Autocomplete
            options={crewMembers}
            getOptionLabel={(option) =>
              `${option.crewId} - ${option.firstName} ${option.lastName}`
            }
            value={crewMembers.find((c) => c.crewId === form.crewId) ?? null}
            onChange={(_, newValue) => {
              setForm((prev) => ({
                ...prev,
                crewId: newValue?.crewId ?? 0,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                label="Crew Member"
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Assignment Date"
              value={form.assignmentDate ? dayjs(form.assignmentDate) : null}
              onChange={(newValue) => {
                setForm((prev) => ({
                  ...prev,
                  assignmentDate: newValue ? newValue.toISOString() : "",
                }));
              }}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
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
