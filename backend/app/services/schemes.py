class SchemesService:
    # High-quality realistic national agriculture schemes dataset
    SCHEMES_DATABASE = [
        {
            "id": "s1",
            "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "authority": "Central Government",
            "category": "Financial Support",
            "eligibility": "All landholding farmers families across the country.",
            "benefits": "Direct income support of Rs. 6,000 per year, paid in three equal installments of Rs. 2,000 directly into the bank accounts of farmers.",
            "documents": "Aadhaar Card, Land ownership records, Bank Passbook details.",
            "official_link": "https://pmkisan.gov.in/"
        },
        {
            "id": "s2",
            "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
            "authority": "Central Government",
            "category": "Crop Insurance",
            "eligibility": "All farmers including tenant farmers growing notified food crops and oilseeds.",
            "benefits": "Low premium insurance covering yield losses due to dry spells, floods, pests, and natural accidents.",
            "documents": "Land records, sowing certificate/self-declaration, bank account details, photo ID card.",
            "official_link": "https://pmfby.gov.in/"
        },
        {
            "id": "s3",
            "name": "SHC (Soil Health Card Scheme)",
            "authority": "Central/State Governments",
            "category": "Infrastructure & Farming",
            "eligibility": "All operational landholder farmers across India.",
            "benefits": "Receive a detailed soil health card analysis every 2 years indicating deficiencies, pH ratings, and custom fertilizer recommendations.",
            "documents": "Aadhaar card, Land survey number documents.",
            "official_link": "https://soilhealth.dac.gov.in/"
        },
        {
            "id": "s4",
            "name": "PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)",
            "authority": "Central Government",
            "category": "Irrigation",
            "eligibility": "Farmers of all categories who own cultivable land.",
            "benefits": "Up to 55% financial subsidy for installing micro-irrigation systems (drip/sprinklers) to optimize water usage.",
            "documents": "Aadhaar card, Land ownership certificate, electricity connection proof (if pumps installed), bank book.",
            "official_link": "https://pmksy.gov.in/"
        },
        {
            "id": "s5",
            "name": "KCC (Kisan Credit Card)",
            "authority": "Central Government / Public Sector Banks",
            "category": "Financial Support",
            "eligibility": "All farmers, tenant farmers, sharecroppers, and joint-liability groups.",
            "benefits": "Direct credit access card for purchasing seeds, fertilizers, and equipment. Interest rates subsidized down to 4%.",
            "documents": "Land verification record, voter ID or Aadhaar, address verification, passport photo.",
            "official_link": "https://www.india.gov.in/"
        }
    ]

    @classmethod
    async def get_schemes(cls, category: str = None) -> list:
        """
        Returns list of agricultural schemes matching optional category tags.
        """
        schemes = cls.SCHEMES_DATABASE
        if category:
            schemes = [s for s in schemes if category.lower() in s["category"].lower()]
        return schemes
