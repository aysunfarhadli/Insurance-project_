// Mock companies data
export const mockCompanies = [
  {
    _id: "company1",
    code: "mega",
    name: "Mega Sığorta",
    logo_url: "",
    active: true,
    contact_info: {
      phone: "+994 12 123 45 67",
      email: "info@megasigorta.az"
    }
  },
  {
    _id: "company2",
    code: "pasha",
    name: "Paşa Sığorta",
    logo_url: "",
    active: true,
    contact_info: {
      phone: "+994 12 234 56 78",
      email: "info@pashasigorta.az"
    }
  },
  {
    _id: "company3",
    code: "asco",
    name: "ASCO Sığorta",
    logo_url: "",
    active: true,
    contact_info: {
      phone: "+994 12 345 67 89",
      email: "info@ascosigorta.az"
    }
  },
  {
    _id: "company4",
    code: "atesgah",
    name: "Atəşgah Sığorta",
    logo_url: "",
    active: true,
    contact_info: {
      phone: "+994 12 456 78 90",
      email: "info@atesgahsigorta.az"
    }
  }
];

// Get companies by category
export const getMockCompaniesByCategory = (categoryId) => {
  // Return all companies for now (in real app, filter by category)
  return mockCompanies;
};

