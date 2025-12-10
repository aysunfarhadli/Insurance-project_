const Company = require("../models/companies");
const CompanyInsuranceType = require("../models/companyInsType");
const Category = require("../models/insCategory");

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

    // Şirkəti bütün kateqoriyalar üçün aktiv et
    if (active !== false) {
      try {
        // Bütün kateqoriyaları gətir (aktiv və qeyri-aktiv)
        let categories = await Category.find();
        
        console.log(`📋 Found ${categories.length} categories in database`);
        
        // Əgər kateqoriya yoxdursa, default kateqoriyaları yarat
        if (categories.length === 0) {
          console.log("⚠️ No categories found, creating default categories...");
          const defaultCategories = [
            { code: "vehicle_liability", name: "Avtonəqliyyat Mülki Məsuliyyət", active: true },
            { code: "property_insurance", name: "Daşınmaz Əmlakın İcbari Sığortası", active: true },
            { code: "property_liability", name: "Əmlakın İstismarı üzrə Məsuliyyət", active: true },
            { code: "employer_liability", name: "İşəgötürənin Məsuliyyəti", active: true },
            { code: "passenger_accident", name: "Sərnişinlərin Qəza Sığortası", active: true },
            { code: "hazardous_liability", name: "Təhlükəli Obyektlərin Məsuliyyəti", active: true }
          ];
          
          for (const catData of defaultCategories) {
            const existing = await Category.findOne({ code: catData.code });
            if (!existing) {
              const newCat = await Category.create(catData);
              console.log(`✅ Created category: ${newCat.code} (${newCat._id})`);
            }
          }
          
          // Yenidən kateqoriyaları gətir
          categories = await Category.find();
          console.log(`📋 Now have ${categories.length} categories after creation`);
        }
        
        // Bütün kateqoriyalar üçün şirkət-kateqoriya əlaqəsi yarat
        let createdCount = 0;
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
        
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          const index = i % 4; // 4 fərqli variant üçün
          
          // Əgər artıq mövcud deyilsə, yeni record yarat
          const existing = await CompanyInsuranceType.findOne({
            company_id: company._id,
            category_id: category._id
          });
          
          if (!existing) {
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
            createdCount++;
            console.log(`✅ Created CompanyInsuranceType for company ${company.code} and category ${category.code}`);
          } else {
            console.log(`ℹ️ CompanyInsuranceType already exists for company ${company.code} and category ${category.code}`);
          }
        }
        console.log(`📊 Created ${createdCount} new CompanyInsuranceType records for company ${company.code}`);
      } catch (linkErr) {
        // Əgər link yaratma xətası olsa, şirkət yaradıldığına görə davam et
        console.error("❌ Şirkət-kateqoriya əlaqəsi yaradılarkən xəta:", linkErr);
      }
    }

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

// ✅ Mövcud şirkətlər üçün bütün kateqoriyalar üçün record yaratmaq
exports.syncCompanyCategories = async (req, res) => {
  try {
    const { company_id } = req.body;
    
    if (!company_id) {
      return res.status(400).json({ message: "company_id tələb olunur" });
    }
    
    const company = await Company.findById(company_id);
    if (!company) {
      return res.status(404).json({ message: "Şirkət tapılmadı" });
    }
    
    // Bütün kateqoriyaları gətir
    let categories = await Category.find();
    
    // Əgər kateqoriya yoxdursa, default kateqoriyaları yarat
    if (categories.length === 0) {
      const defaultCategories = [
        { code: "vehicle_liability", name: "Avtonəqliyyat Mülki Məsuliyyət", active: true },
        { code: "property_insurance", name: "Daşınmaz Əmlakın İcbari Sığortası", active: true },
        { code: "property_liability", name: "Əmlakın İstismarı üzrə Məsuliyyət", active: true },
        { code: "employer_liability", name: "İşəgötürənin Məsuliyyəti", active: true },
        { code: "passenger_accident", name: "Sərnişinlərin Qəza Sığortası", active: true },
        { code: "hazardous_liability", name: "Təhlükəli Obyektlərin Məsuliyyəti", active: true }
      ];
      
      for (const catData of defaultCategories) {
        const existing = await Category.findOne({ code: catData.code });
        if (!existing) {
          await Category.create(catData);
        }
      }
      
      categories = await Category.find();
    }
    
    // Bütün kateqoriyalar üçün şirkət-kateqoriya əlaqəsi yarat
    let createdCount = 0;
    for (const category of categories) {
      const existing = await CompanyInsuranceType.findOne({
        company_id: company._id,
        category_id: category._id
      });
      
      if (!existing) {
        await CompanyInsuranceType.create({
          company_id: company._id,
          category_id: category._id,
          active: true
        });
        createdCount++;
      }
    }
    
    res.json({ 
      message: `${createdCount} yeni CompanyInsuranceType record yaradıldı`,
      company: company.code,
      total_categories: categories.length,
      created: createdCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
