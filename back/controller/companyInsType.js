const CompanyInsuranceType = require("../models/companyInsType");
const Company = require("../models/companies");
const Category = require("../models/insCategory");

// ✅ Əlavə et
exports.addCompanyInsuranceType = async (req, res) => {
  try {
    const { 
      company_id, 
      category_id, 
      active,
      monthly_price,
      coverage_amount,
      processing_time_hours,
      rating,
      reviews_count,
      badge,
      features
    } = req.body;

    // Check if company exists
    const company = await Company.findById(company_id);
    if (!company) return res.status(404).json({ message: "Şirkət tapılmadı" });

    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Kateqoriya tapılmadı" });

    const record = new CompanyInsuranceType({ 
      company_id, 
      category_id, 
      active,
      monthly_price,
      coverage_amount,
      processing_time_hours,
      rating,
      reviews_count,
      badge,
      features
    });
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
    const { category_id } = req.query;
    let query = { active: true }; // Yalnız aktiv recordları gətir
    
    // Əgər category_id verilibsə, yalnız o kateqoriya üçün şirkətləri gətir
    if (category_id) {
      query.category_id = category_id;
    }
    
    console.log("🔍 getCompanyInsuranceTypes query:", JSON.stringify(query, null, 2));
    
    const records = await CompanyInsuranceType.find(query)
      .populate("company_id", "name code active logo_url contact_info")
      .populate("category_id", "name code active");
    
    console.log(`📊 Found ${records.length} CompanyInsuranceType records`);
    
    // Əgər category_id verilibsə və record tapılmadısa, bütün aktiv şirkətlər üçün record yarat
    if (category_id && records.length === 0) {
      console.log(`⚠️ No records found for category_id: ${category_id}, attempting to sync...`);
      
      try {
        const category = await Category.findById(category_id);
        if (category && category.active !== false) {
          // Bütün aktiv şirkətləri gətir
          const companies = await Company.find({ active: true });
          console.log(`📋 Found ${companies.length} active companies to sync`);
          
          for (const company of companies) {
            const existing = await CompanyInsuranceType.findOne({
              company_id: company._id,
              category_id: category._id
            });
            
            if (!existing) {
              const defaultBadges = ["Ən Populyar", "Ən Sürətli", "Premium", "Budget"];
              const defaultPrices = [45, 38, 52, 32];
              const defaultCoverages = [50000, 40000, 75000, 30000];
              const defaultProcessingTimes = [2, 1, 3, 4];
              const defaultRatings = [4.8, 4.6, 4.7, 4.5];
              const defaultReviews = [2341, 1876, 1234, 987];
              const defaultFeatures = [
                ["24/7 Dəstək", "Tez Ödəniş", "Beynəlxalq əhatə"],
                ["Online Xidmət", "Sürətli Qeydiyyat", "Mobil Tətbiq"],
                ["Premium Xidmət", "VIP Dəstək", "Genişləndirilmiş əhatə"],
                ["Əsas əhatə", "Standart Dəstək", "Sənədləşmə"]
              ];
              const companyIndex = companies.findIndex(c => c._id.toString() === company._id.toString());
              const index = companyIndex >= 0 ? companyIndex % 4 : 0;
              
              await CompanyInsuranceType.create({
                company_id: company._id,
                category_id: category._id,
                active: true,
                monthly_price: defaultPrices[index],
                coverage_amount: defaultCoverages[index],
                processing_time_hours: defaultProcessingTimes[index],
                rating: defaultRatings[index],
                reviews_count: defaultReviews[index],
                badge: defaultBadges[index],
                features: defaultFeatures[index]
              });
              console.log(`✅ Created CompanyInsuranceType for company ${company.code} and category ${category.code}`);
            }
          }
          
          // Yenidən recordları gətir
          const newRecords = await CompanyInsuranceType.find(query)
            .populate("company_id", "name code active logo_url contact_info")
            .populate("category_id", "name code active");
          
          const filteredNewRecords = newRecords.filter(record => 
            record.company_id && 
            record.company_id.active !== false && 
            record.category_id && 
            record.category_id.active !== false
          );
          
          console.log(`✅ After sync, found ${filteredNewRecords.length} active records`);
          return res.json(filteredNewRecords);
        }
      } catch (syncErr) {
        console.error("❌ Error syncing records:", syncErr);
        // Davam et, boş array qaytar
      }
    }
    
    // Yalnız aktiv şirkət və aktiv kateqoriya olan recordları qaytar
    const filteredRecords = records.filter(record => 
      record.company_id && 
      record.company_id.active !== false && 
      record.category_id && 
      record.category_id.active !== false
    );
    
    console.log(`✅ Filtered to ${filteredRecords.length} active records`);
    
    res.json(filteredRecords);
  } catch (err) {
    console.error("❌ getCompanyInsuranceTypes error:", err);
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
    const { 
      active,
      monthly_price,
      coverage_amount,
      processing_time_hours,
      rating,
      reviews_count,
      badge,
      features
    } = req.body;
    
    const updateData = {};
    if (active !== undefined) updateData.active = active;
    if (monthly_price !== undefined) updateData.monthly_price = monthly_price;
    if (coverage_amount !== undefined) updateData.coverage_amount = coverage_amount;
    if (processing_time_hours !== undefined) updateData.processing_time_hours = processing_time_hours;
    if (rating !== undefined) updateData.rating = rating;
    if (reviews_count !== undefined) updateData.reviews_count = reviews_count;
    if (badge !== undefined) updateData.badge = badge;
    if (features !== undefined) updateData.features = features;
    
    const record = await CompanyInsuranceType.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("company_id", "name code active logo_url contact_info")
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
