import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import shipVisitService from "../api/shipVisitService";
import shipService from "../api/shipService";
import portService from "../api/portService";
import type { ShipVisit } from "../types/shipVisit";
import type { Ship } from "../types/ship";
import type { Port } from "../types/port";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Autocomplete from "@mui/material/Autocomplete";
import "dayjs/locale/tr";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("tr");
dayjs.tz.setDefault("Europe/Istanbul");

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
    visitId: number;
    purpose?: string;
    arrivalDate?: dayjs.Dayjs | null;
    departureDate?: dayjs.Dayjs | null;
    shipId?: number;
    portId?: number;
    shipName?: string;
    portName?: string;
  }>({ visitId: 0 });
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
    const queryFilters: Record<string, string | number | undefined> = {};

    if (filters.purpose) queryFilters.purpose = filters.purpose;
    if (filters.shipId) queryFilters.shipId = filters.shipId;
    if (filters.portId) queryFilters.portId = filters.portId;
    if (filters.visitId) queryFilters.visitId = filters.visitId;

    if (filters.arrivalDate) {
      const selected = filters.arrivalDate;
      let granularity: "year" | "month" | "day" | "minute" = "minute";
      if (
        selected.date() === 1 &&
        selected.hour() === 0 &&
        selected.minute() === 0
      ) {
        if (selected.month() === 0) {
          granularity = "year";
        } else {
          granularity = "month";
        }
      } else if (selected.hour() === 0 && selected.minute() === 0) {
        granularity = "day";
      }
      queryFilters.arrivalDateStart = selected
        .startOf(granularity)
        .toISOString();
      queryFilters.arrivalDateEnd = selected.endOf(granularity).toISOString();
    }

    if (filters.departureDate) {
      const selected = filters.departureDate;
      queryFilters.departureDateStart = selected
        .startOf("minute")
        .toISOString();
      queryFilters.departureDateEnd = selected.endOf("minute").toISOString();
    }
    if (filters.departureDate) {
      const selected = dayjs(filters.departureDate);
      queryFilters.departureDateStart = selected
        .startOf("minute")
        .toISOString();
      queryFilters.departureDateEnd = selected.endOf("minute").toISOString();
    }

    const res = await shipVisitService.searchPaged(
      page + 1,
      rowsPerPage,
      queryFilters
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

  const handleFilterDateChange = (name: string, value: dayjs.Dayjs | null) => {
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

  const handleNew = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={"bold"}>
        Ship Visit Management
      </Typography>

      {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
          {[
            { label: "Ship ID", name: "shipId", type: "number" },
            {
              label: "Ship Name",
              name: "shipName",
              type: "autocomplete",
              options: ships.map((s) => s.name),
            },
            { label: "Port ID", name: "portId", type: "number" },
            {
              label: "Port Name",
              name: "portName",
              type: "autocomplete",
              options: ports.map((p) => p.name),
            },
            { label: "Purpose", name: "purpose", type: "text" },
          ].map((field) =>
            field.type === "autocomplete" ? (
              <Autocomplete
                key={field.name}
                options={field.options || []}
                value={(filters as Record<string, unknown>)[field.name] || ""}
                onChange={(_, newValue) => {
                  if (field.name === "shipName") {
                    const selected = ships.find((s) => s.name === newValue);
                    setFilters((prev) => ({
                      ...prev,
                      shipName: typeof newValue === "string" ? newValue : "",
                      shipId: selected?.shipId || undefined,
                    }));
                  } else if (field.name === "portName") {
                    const selected = ports.find((p) => p.name === newValue);
                    setFilters((prev) => ({
                      ...prev,
                      portName: typeof newValue === "string" ? newValue : "",
                      portId: selected?.portId || undefined,
                    }));
                  }
                  setPage(0);
                }}
                renderInput={(params) => (
                  <TextField {...params} label={field.label} size="small" />
                )}
                sx={{ minWidth: 200 }}
              />
            ) : (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                size="small"
                value={(filters as Record<string, unknown>)[field.name] ?? ""}
                onChange={handleFilterChange}
                sx={{ minWidth: 200 }}
              />
            )
          )}

          {[
            {
              label: "Arrival Date & Time",
              name: "arrivalDate",
              pickerType: "datetime",
              otherProps: {
                maxDateTime: filters.departureDate
                  ? dayjs(filters.departureDate)
                  : undefined,
              },
            },
            {
              label: "Departure Date & Time",
              name: "departureDate",
              pickerType: "datetime",
              otherProps: {
                minDateTime: filters.arrivalDate
                  ? dayjs(filters.arrivalDate)
                  : undefined,
              },
            },
          ].map(({ label, name, otherProps }) => (
            <DateTimePicker
              key={name}
              label={label}
              format="DD.MM.YYYY"
              value={
                dayjs.isDayjs(filters[name as keyof typeof filters])
                  ? (filters[name as keyof typeof filters] as dayjs.Dayjs)
                  : null
              }
              onChange={(value) => {
                const otherDate =
                  name === "arrivalDate"
                    ? filters.departureDate
                    : filters.arrivalDate;
                const isSameDay =
                  value && otherDate && value.isSame(otherDate, "day");
                const isInvalid =
                  value &&
                  otherDate &&
                  ((name === "arrivalDate" &&
                    value.isAfter(otherDate) &&
                    isSameDay) ||
                    (name === "departureDate" &&
                      value.isBefore(otherDate) &&
                      isSameDay));
                if (isInvalid) {
                  alert(
                    name === "arrivalDate"
                      ? "Arrival time must be before departure time."
                      : "Departure time must be after arrival time."
                  );
                  return;
                }
                handleFilterDateChange(name, value);
              }}
              slotProps={{
                textField: { size: "small" },
                actionBar: { actions: ["clear"] },
              }}
              sx={{ minWidth: 250 }}
              {...otherProps}
            />
          ))}
          {/* Actions */}
          <Box display="flex" mb={2}>
            <Button
              sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
              onClick={handleNew}
              variant="contained"
            >
              New
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenDelete(true)}
              disabled={selectedIds.length === 0}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

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
                Port
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Arrival
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Departure
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Purpose
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
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
                  {(ships.find((s) => s.shipId === v.shipId)?.name || "") +
                    (" " + v.shipId) || v.shipId}
                </TableCell>
                <TableCell>
                  {(ports.find((p) => p.portId === v.portId)?.name || "") +
                    (" " + v.portId) || v.portId}
                </TableCell>
                <TableCell>
                  {v.arrivalDate
                    ? new Date(v.arrivalDate).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>

                <TableCell>
                  {v.departureDate
                    ? new Date(v.departureDate).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>

                <TableCell>{v.purpose}</TableCell>
                <TableCell>
                  <Button
                    sx={{ bgcolor: "#456882", color: "white" }}
                    variant="outlined"
                    onClick={() => {
                      setForm(v);
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
            <Autocomplete
              options={ships}
              getOptionLabel={(option) => option.name}
              value={ships.find((s) => s.shipId === form.shipId) || null}
              onChange={(_, newValue) => {
                setForm((prev) => ({
                  ...prev,
                  shipId: newValue ? newValue.shipId : 0,
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Ship" fullWidth margin="dense" />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <Autocomplete
              options={ports}
              getOptionLabel={(option) => option.name}
              value={ports.find((p) => p.portId === form.portId) || null}
              onChange={(_, newValue) => {
                setForm((prev) => ({
                  ...prev,
                  portId: newValue ? newValue.portId : 0,
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Port" fullWidth margin="dense" />
              )}
            />
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Arrival Date & Time"
              format="DD.MM.YYYY"
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

            <DatePicker
              label="Departure Date & Time"
              format="DD.MM.YYYY"
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
          <Button
            onClick={() => setOpen(false)}
            sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ mr: 1, bgcolor: "#456882", color: "white" }}
          >
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
