const Company = require("../models/companies");

// ✅ Yeni şirkət yaratmaq
exports.createCompany = async (req, res) => {
  try {
    const { code, name, active, logo_url, contact_info } = req.body;

    const exists = await Company.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Bu code artıq mövcuddur" });
    }

    const company = new Company({ code, name, active, logo_url, contact_info });
    await company.save();

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Bütün şirkətləri gətirmək
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ID ilə tapmaq
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Şirkət tapılmadı" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Yeniləmək
exports.updateCompany = async (req, res) => {
  try {
    const { name, active, logo_url, contact_info } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name, active, logo_url, contact_info },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Şirkət tapılmadı" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Silmək
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Şirkət tapılmadı" });
    res.json({ message: "Şirkət silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
