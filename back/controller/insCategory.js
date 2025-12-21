const Category = require("../models/insCategory");

// ✅ Yeni kateqoriya yaratmaq
exports.createCategory = async (req, res) => {
  try {
    const { code, name, active } = req.body;

    // Debug: Check schema enum values
    const schema = Category.schema.path('code');
    console.log('Category code enum values:', schema.enumValues);

    const exists = await Category.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Bu code artıq mövcuddur" });
    }

    const category = new Category({ code, name, active });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error('Category creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Bütün kateqoriyaları gətirmək
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ID ilə tapmaq
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Tapılmadı" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Yeniləmək
exports.updateCategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, active },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Tapılmadı" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Silmək
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Tapılmadı" });
    res.json({ message: "Silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
