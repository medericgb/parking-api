const express = require("express");
const app = express();
const port = 8080;

// Middleware
app.use(express.json());

// Dump data
const parkings = require("./parkings.json");
const reservations = require("./reservations.json");

app.get("/parkings", (req, res) => {
  res.status(200).json(parkings);
});

// Get single parking by id
app.get("/parkings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const parking = parkings.find((p) => p.id === id);
  if (!parking) {
    return res.status(404).json({ message: "Parking not found" });
  }
  res.status(200).json(parking);
});

// Create new parking
app.post("/parkings", (req, res) => {
  const { name, type, city } = req.body;
  const parking = { id: parkings.length + 1, name, type, city };
  parkings.push(parking);
  res.status(201).json(parking);
});

// Update parking
app.put("/parkings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type, city } = req.body;
  const parking = parkings.find((p) => p.id === id);
  if (!parking) {
    return res.status(404).json({ message: "Parking not found" });
  }
  parking.name = name;
  parking.type = type;
  parking.city = city;
  res.status(200).json(parking);
});

// Delete parking
app.delete("/parkings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = parkings.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Parking not found" });
  }
  parkings.splice(index, 1);
  res.status(200).json({ message: "Parking deleted successfully" });
});

// Get reservations
app.get("/reservations", (req, res) => {
  res.status(200).json(reservations);
});

// Get all reservations for a parkings
app.get("/parkings/:id/reservations", (req, res) => {
  const id = parseInt(req.params.id);
  const parkingReservations = reservations.filter((r) => r.parkingId === id);
  res.status(200).json(parkingReservations);
});

// Add a reservation for a parking
app.post("/parkings/:parkingId/reservations", (req, res) => {
  const id = parseInt(req.params.parkingId);
  const { clientName, vehicle, licensePlate, checkin, checkout } = req.body;
  const reservation = {
    id: reservations.length + 1,
    parkingId: id,
    clientName,
    vehicle,
    licensePlate,
    checkin,
    checkout,
  };
  reservations.push(reservation);
  res.status(201).json(reservation);
});

// Update a reservation for a parking
app.put("/parkings/:parkingId/reservations/:id", (req, res) => {
  const parkingId = parseInt(req.params.parkingId);
  const reservationId = parseInt(req.params.id);
  const { clientName, vehicle, licensePlate, checkin, checkout } = req.body;
  const reservation = reservations.find(
    (r) => r.parkingId === parkingId && r.id === reservationId
  );
  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }
  reservation.clientName = clientName;
  reservation.vehicle = vehicle;
  reservation.licensePlate = licensePlate;
  reservation.checkin = checkin;
  reservation.checkout = checkout;
  res.status(200).json(reservation);
});

// Delete a reservation
app.delete("/parkings/:parkingId/reservations/:id", (req, res) => {
  const parkingId = parseInt(req.params.parkingId);
  const reservationId = parseInt(req.params.id);
  const index = reservations.findIndex(
    (r) => r.parkingId === parkingId && r.id === reservationId
  );
  if (index === -1) {
    return res.status(404).json({ message: "Reservation not found" });
  }
  reservations.splice(index, 1);
  res.status(200).json({ message: "Reservation deleted successfully" });
});

app.listen(port, () => console.log(`Parking app listening on port ${port}!`));
