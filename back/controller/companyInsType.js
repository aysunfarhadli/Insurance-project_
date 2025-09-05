const CompanyInsuranceType = require("../models/companyInsType");
const Company = require("../models/companies");
const Category = require("../models/insCategory");

// ✅ Əlavə et
exports.addCompanyInsuranceType = async (req, res) => {
  try {
    const { company_id, category_id, active } = req.body;

    // Check if company exists
    const company = await Company.findById(company_id);
    if (!company) return res.status(404).json({ message: "Şirkət tapılmadı" });

    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Kateqoriya tapılmadı" });

    const record = new CompanyInsuranceType({ company_id, category_id, active });
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Bu şirkət bu kateqoriya üzrə artıq mövcuddur" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hamısını gətir (şirkət + kateqoriya məlumatı ilə)
exports.getCompanyInsuranceTypes = async (req, res) => {
  try {
    const records = await CompanyInsuranceType.find()
      .populate("company_id", "name code active")
      .populate("category_id", "name code active");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ID ilə tap
exports.getCompanyInsuranceTypeById = async (req, res) => {
  try {
    const record = await CompanyInsuranceType.findById(req.params.id)
      .populate("company_id", "name code active")
      .populate("category_id", "name code active");

    if (!record) return res.status(404).json({ message: "Tapılmadı" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Yenilə
exports.updateCompanyInsuranceType = async (req, res) => {
  try {
    const { active } = req.body;
    const record = await CompanyInsuranceType.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    )
      .populate("company_id", "name code active")
      .populate("category_id", "name code active");

    if (!record) return res.status(404).json({ message: "Tapılmadı" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Sil
exports.deleteCompanyInsuranceType = async (req, res) => {
  try {
    const record = await CompanyInsuranceType.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Tapılmadı" });
    res.json({ message: "Silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
