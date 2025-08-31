const { validationResult } = require("express-validator");
const TripInfo = require("../models/insurer");

// 🔹 Yeni trip əlavə
exports.createTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      startDate,
      endDate,
      multiEntry,
      entriesCount,
      coverageScope,
      coverageAmount,
      currency,
      covidCoverage,
      embassy,
    } = req.body;

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ✅ Başlama tarixi ən azı sabah olmalıdır
    if (start <= today) {
      return res.status(400).json({ error: "Başlama tarixi ən azı sabah olmalıdır." });
    }

    // ✅ Bitmə tarixi ≥ başlama tarixi
    if (end < start) {
      return res.status(400).json({ error: "Bitmə tarixi başlama tarixindən kiçik ola bilməz." });
    }

    // ✅ Max 1 illik polis
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays > 365) {
      return res.status(400).json({ error: "Sığorta müddəti 1 ildən çox ola bilməz." });
    }

    // ✅ multiEntry = true → entriesCount = MULTIPLE
    if (multiEntry && entriesCount !== "MULTIPLE") {
      return res.status(400).json({ error: "multiEntry = true olduqda entriesCount = MULTIPLE olmalıdır." });
    }

    // ✅ Schengen üçün minimum coverage = 30,000
    if (coverageScope === "SCHENGEN" && coverageAmount < 30000) {
      return res.status(400).json({ error: "Schengen üçün minimum coverage 30,000 olmalıdır." });
    }

    // ✅ Currency qaydası
    if (currency === "AZN" && coverageScope !== "REGIONAL_TR") {
      return res.status(400).json({ error: "AZN yalnız REGIONAL_TR üçün keçərlidir." });
    }

    // ✅ Worldwide üçün covidCoverage məcburi FULL
    if (coverageScope === "WORLDWIDE" && covidCoverage !== "FULL") {
      return res.status(400).json({ error: "WORLDWIDE üçün COVID coverage FULL olmalıdır." });
    }

    // ✅ Duplicate yoxlama
    const exists = await TripInfo.findOne({ embassy, startDate, endDate });
    if (exists) {
      return res.status(400).json({ error: "Bu tarixlərdə artıq sığorta mövcuddur." });
    }

    const trip = new TripInfo(req.body);
    await trip.save();

    res.status(201).json({ message: "Trip info yaradıldı", data: trip });
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};

// 🔹 Qiymət hesablaması (yalnız preview üçün)
exports.calculatePrice = (req, res) => {
  try {
    const { startDate, endDate, coverageAmount } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate || !coverageAmount) {
      return res.status(400).json({ error: "startDate, endDate və coverageAmount vacibdir" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ error: "Bitmə tarixi başlama tarixindən sonra olmalıdır." });
    }

    // Sadə hesablamaya misal (sonradan dəyişilə bilər)
    const dailyRate = coverageAmount / 1000 * 0.5;
    const price = dailyRate * days;

    res.json({ days, price });
  } catch (err) {
    res.status(500).json({ error: "Qiymət hesablamasında xəta", details: err.message });
  }
};

// 🔹 Bütün trip-ləri al (pagination + filter)
exports.getTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, embassy } = req.query;
    const filter = embassy ? { embassy } : {};

    const trips = await TripInfo.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};

// 🔹 Trip update
exports.updateTrip = async (req, res) => {
  try {
    const trip = await TripInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).json({ error: "Trip tapılmadı" });
    res.json({ message: "Trip yeniləndi", data: trip });
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};

// 🔹 Trip delete
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await TripInfo.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip tapılmadı" });
    res.json({ message: "Trip silindi" });
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};
