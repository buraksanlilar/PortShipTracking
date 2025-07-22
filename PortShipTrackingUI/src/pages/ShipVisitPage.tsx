import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import shipVisitService from "../api/shipVisitService";
import shipService from "../api/shipService";
import portService from "../api/portService";
import type { ShipVisit } from "../types/shipVisit";
import type { Ship } from "../types/ship";
import type { Port } from "../types/port";

const defaultForm: ShipVisit = {
  visitId: 0,
  shipId: 0,
  portId: 0,
  arrivalDate: "",
  departureDate: null,
  purpose: "",
};

export default function ShipVisitPage() {
  const [visits, setVisits] = useState<ShipVisit[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form, setForm] = useState<ShipVisit>(defaultForm);
  const [filters, setFilters] = useState<{
    purpose?: string;
    arrivalDate?: Date | null;
    departureDate?: Date | null;
    shipId?: number;
    portId?: number;
  }>({});
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [arrivalDateClear, setArrivalDateClear] = useState(false);
  const [departureDateClear, setDepartureDateClear] = useState(false);

  useEffect(() => {
    let timeoutArrival: number | undefined;
    let timeoutDeparture: number | undefined;

    if (arrivalDateClear) {
      timeoutArrival = window.setTimeout(() => {
        setArrivalDateClear(false);
      }, 1500);
    }

    if (departureDateClear) {
      timeoutDeparture = window.setTimeout(() => {
        setDepartureDateClear(false);
      }, 1500);
    }

    return () => {
      if (timeoutArrival !== undefined) clearTimeout(timeoutArrival);
      if (timeoutDeparture !== undefined) clearTimeout(timeoutDeparture);
    };
  }, [arrivalDateClear, departureDateClear]);

  const loadVisits = useCallback(async () => {
    const res = await shipVisitService.searchPaged(
      page + 1,
      rowsPerPage,
      Object.fromEntries(
        Object.entries(filters)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([key, value]) => [
            key,
            value instanceof Date
              ? value.toISOString()
              : value === null
              ? undefined
              : value,
          ])
      )
    );
    setVisits(res.items);
    setTotalCount(res.totalCount);
  }, [page, rowsPerPage, filters]);

  const loadDropdowns = async () => {
    const shipData = await shipService.getShips();
    const portData = await portService.getPorts();
    setShips(shipData);
    setPorts(portData);
  };

  useEffect(() => {
    loadVisits();
    loadDropdowns();
  }, [loadVisits]);

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
  };

  const handleFilterDateChange = (name: string, value: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name!]: value,
    }));
    setPage(0);
  };

  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!form.shipId || !form.portId || !form.arrivalDate || !form.purpose) {
      setSnackbarMessage("❌ Please fill in required fields.");
      setSnackbarOpen(true);
      return;
    }
    const dto = {
      visitId: form.visitId,
      shipId: form.shipId,
      portId: form.portId,
      arrivalDate: form.arrivalDate,
      departureDate: form.departureDate || null,
      purpose: form.purpose,
    };
    try {
      if (isEdit) {
        await shipVisitService.updateShipVisit(form.visitId, dto);
        setSnackbarMessage("✅ Visit updated successfully.");
      } else {
        await shipVisitService.addShipVisit(dto);
        setSnackbarMessage("✅ Visit added successfully.");
      }
      setOpen(false);
      setSelectedIds([]);
      loadVisits();
    } catch {
      setSnackbarMessage("❌ Error occurred while saving visit.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    for (const id of selectedIds) await shipVisitService.deleteShipVisit(id);
    setSelectedIds([]);
    loadVisits();
    setOpenDelete(false);
    setSnackbarMessage("✅ Visit(s) deleted.");
    setSnackbarOpen(true);
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const visit = visits.find((v) => v.visitId === selectedIds[0]);
      if (visit) {
        setForm(visit);
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

  return (
    <Box p={3}>
      <h1>Ship Visit Management</h1>

      {/* Filters */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Purpose"
          name="purpose"
          value={filters.purpose || ""}
          onChange={handleFilterChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Arrival Date"
            value={filters.arrivalDate ? dayjs(filters.arrivalDate) : null}
            onChange={(value) =>
              handleFilterDateChange(
                "arrivalDate",
                value ? value.toDate() : null
              )
            }
            slotProps={{ textField: { label: "Arrival Date" } }}
          />
          <DesktopDatePicker
            label="Departure Date"
            value={filters.departureDate ? dayjs(filters.departureDate) : null}
            onChange={(value) =>
              handleFilterDateChange(
                "departureDate",
                value ? value.toDate() : null
              )
            }
            slotProps={{ textField: { label: "Departure Date" } }}
          />
        </LocalizationProvider>
        <TextField
          label="Ship ID"
          name="shipId"
          value={filters.shipId || ""}
          onChange={handleFilterChange}
        />
        <TextField
          label="Port ID"
          name="portId"
          value={filters.portId || ""}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Actions */}
      <Box mb={2}>
        <Button variant="contained" onClick={handleNew}>
          New
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 1 }}
          onClick={handleEdit}
          disabled={selectedIds.length !== 1}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 1 }}
          onClick={() => setOpenDelete(true)}
          disabled={selectedIds.length === 0}
        >
          Delete
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Ship</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Purpose</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((v) => (
              <TableRow key={`visit-${v.visitId}`}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(v.visitId)}
                    onChange={() => handleCheckbox(v.visitId)}
                  />
                </TableCell>
                <TableCell>
                  {ships.find((s) => s.shipId === v.shipId)?.name || v.shipId}
                </TableCell>
                <TableCell>
                  {ports.find((p) => p.portId === v.portId)?.name || v.portId}
                </TableCell>
                <TableCell>
                  {v.arrivalDate
                    ? new Date(v.arrivalDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {v.departureDate
                    ? new Date(v.departureDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{v.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Visit" : "Add Visit"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Ship</InputLabel>
            <Select
              name="shipId"
              value={form.shipId}
              onChange={handleFormChange}
            >
              {ships.map((s) => (
                <MenuItem key={s.shipId} value={s.shipId}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Port</InputLabel>
            <Select
              name="portId"
              value={form.portId}
              onChange={(event) =>
                handleFormChange({
                  target: { name: "portId", value: event.target.value },
                })
              }
            >
              {ports.map((p) => (
                <MenuItem key={p.portId} value={p.portId}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Arrival Date"
              value={form.arrivalDate ? dayjs(form.arrivalDate) : null}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  arrivalDate: value ? value.toDate().toISOString() : "",
                }))
              }
              slotProps={{
                textField: { fullWidth: true, margin: "dense" },
                field: {
                  clearable: true,
                  onClear: () => setArrivalDateClear(true),
                },
              }}
            />

            <DesktopDatePicker
              label="Departure Date"
              value={form.departureDate ? dayjs(form.departureDate) : null}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  departureDate: value ? value.toDate().toISOString() : null,
                }))
              }
              slotProps={{
                textField: { fullWidth: true, margin: "dense" },
                field: {
                  clearable: true,
                  onClear: () => setDepartureDateClear(true),
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            label="Purpose"
            name="purpose"
            value={form.purpose}
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

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>
          Are you sure you want to delete selected visits?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
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
