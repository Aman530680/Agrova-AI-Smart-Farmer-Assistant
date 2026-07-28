import datetime

class CropService:
    # 10 Crops timeline rules, agricultural tasks, water needs, and fertilizer recommendations
    CROP_METADATA = {
        "rice": [
            {"stage": "Sowing & Nursery", "days": 20, "task": "Prepare nursery bed, select healthy certified seeds.", "water": "High", "fertilizer": "Apply organic manure"},
            {"stage": "Transplanting", "days": 35, "task": "Transplant 25-30 days old seedlings to puddled field.", "water": "Submerged (5cm)", "fertilizer": "Urea (Nitrogen) basal dose"},
            {"stage": "Tillering & Vegetative", "days": 70, "task": "Keep fields weed-free, monitor for stem borers.", "water": "Moderate", "fertilizer": "Urea top dressing"},
            {"stage": "Panicle & Flowering", "days": 100, "task": "Ensure soil stays saturated, protect from blast disease.", "water": "High", "fertilizer": "Potash application"},
            {"stage": "Maturity & Harvesting", "days": 135, "task": "Drain water 10 days before harvest. Cut and dry.", "water": "None", "fertilizer": "None"}
        ],
        "wheat": [
            {"stage": "Sowing & Germination", "days": 15, "task": "Till soil to fine tilth, treat seeds with fungicide.", "water": "Moderate", "fertilizer": "DAP (Diammonium Phosphate)"},
            {"stage": "Crown Root Initiation (CRI)", "days": 25, "task": "Critical watering phase. Apply first irrigation.", "water": "High", "fertilizer": "Urea top dressing"},
            {"stage": "Tillering & Jointing", "days": 60, "task": "Weed management, apply second irrigation.", "water": "Moderate", "fertilizer": "Urea second top dressing"},
            {"stage": "Flowering & Milking", "days": 100, "task": "Irrigate to support grain filling, check for rust spores.", "water": "High", "fertilizer": "N/A"},
            {"stage": "Harvesting", "days": 130, "task": "Harvest when grains are hard and straw turns golden.", "water": "None", "fertilizer": "None"}
        ],
        "cotton": [
            {"stage": "Sowing", "days": 10, "task": "Sow in rows, treat seeds against sucking pests.", "water": "Moderate", "fertilizer": "NPK base dose"},
            {"stage": "Vegetative Growth", "days": 45, "task": "Thin out seedlings, perform weeding, monitor bollworms.", "water": "Moderate", "fertilizer": "Urea top dressing"},
            {"stage": "Square Formation & Flowering", "days": 90, "task": "Ensure uniform moisture, apply growth regulators if needed.", "water": "High", "fertilizer": "Apply Potassium"},
            {"stage": "Boll Development", "days": 140, "task": "Irrigate at dry spells, check for pink bollworm.", "water": "Moderate", "fertilizer": "N/A"},
            {"stage": "Picking & Harvesting", "days": 170, "task": "Pick cotton from fully opened bolls on sunny dry days.", "water": "None", "fertilizer": "None"}
        ],
        "sugarcane": [
            {"stage": "Planting & Germination", "days": 30, "task": "Select healthy 3-bud setts, treat with fungicide.", "water": "High", "fertilizer": "NPK base mixture"},
            {"stage": "Tillering & Formative Stage", "days": 120, "task": "Perform earthing up, irrigate every 10-12 days.", "water": "High", "fertilizer": "Nitrogenous fertilizer dose"},
            {"stage": "Grand Growth", "days": 270, "task": "Propping/tying of canes to prevent lodging, check borer.", "water": "High", "fertilizer": "Potash top dressing"},
            {"stage": "Maturity & Harvesting", "days": 360, "task": "Stop watering 15 days before harvest. Cut at ground level.", "water": "None", "fertilizer": "None"}
        ],
        "banana": [
            {"stage": "Planting & Establishment", "days": 60, "task": "Plant healthy sword suckers, apply organic mulch.", "water": "High", "fertilizer": "Farmyard manure + NPK"},
            {"stage": "Vegetative growth", "days": 180, "task": "Prune excess suckers, carry out weeding and soil earthing.", "water": "High", "fertilizer": "Monthly nitrogen split dose"},
            {"stage": "Inflorescence & Flowering", "days": 270, "task": "Provide support (propping) for pseudostem, check sigatoka.", "water": "High", "fertilizer": "Potash split dose"},
            {"stage": "Fruit Development", "days": 330, "task": "Cover fruit bunches with perforated plastic bags.", "water": "Moderate", "fertilizer": "N/A"},
            {"stage": "Harvesting", "days": 365, "task": "Harvest green bunches when fruits become plump/round.", "water": "None", "fertilizer": "None"}
        ],
        "tomato": [
            {"stage": "Nursery & Sowing", "days": 25, "task": "Sow seeds in trays, protect from damping-off.", "water": "Moderate", "fertilizer": "Organic compost"},
            {"stage": "Transplanting", "days": 40, "task": "Transplant seedlings to ridges, set up staking supports.", "water": "Moderate", "fertilizer": "NPK split dose"},
            {"stage": "Flowering & Fruit Set", "days": 75, "task": "Prune side shoots, monitor for early blight and fruit borer.", "water": "High", "fertilizer": "Calcium and Boron spray"},
            {"stage": "Fruit Ripening & Harvest", "days": 110, "task": "Harvest firm ripe red tomatoes at morning hours.", "water": "Low", "fertilizer": "None"}
        ],
        "onion": [
            {"stage": "Nursery & Sowing", "days": 45, "task": "Sow seeds in raised nursery beds, hand-weed.", "water": "Moderate", "fertilizer": "NPK base mixture"},
            {"stage": "Transplanting", "days": 65, "task": "Transplant seedlings to flat beds, irrigate immediately.", "water": "Moderate", "fertilizer": "Urea splits"},
            {"stage": "Bulb Development", "days": 120, "task": "Bulb enlargement phase. Avoid dry spells to prevent split bulbs.", "water": "High", "fertilizer": "Potash top dressing"},
            {"stage": "Harvesting & Curing", "days": 150, "task": "Harvest when 50% tops collapse. Cure in shade for 10 days.", "water": "None", "fertilizer": "None"}
        ],
        "groundnut": [
            {"stage": "Sowing & Emergence", "days": 15, "task": "Sow seeds at 5cm depth, treat seeds with Rhizobium.", "water": "Moderate", "fertilizer": "Single Super Phosphate (SSP)"},
            {"stage": "Flowering & Pegging", "days": 55, "task": "Perform light soil hoeing, avoid deep weeding during pegging.", "water": "High", "fertilizer": "Gypsum application (Calcium)"},
            {"stage": "Pod Development", "days": 95, "task": "Maintain moderate soil dampness, monitor leaf spots.", "water": "Moderate", "fertilizer": "N/A"},
            {"stage": "Harvesting", "days": 120, "task": "Uproot plants when pod shells show dark linings inside.", "water": "None", "fertilizer": "None"}
        ],
        "maize": [
            {"stage": "Sowing & Germination", "days": 15, "task": "Sow in lines at 4cm depth, check cutworms.", "water": "Moderate", "fertilizer": "DAP + Zinc Sulfate"},
            {"stage": "Knee-High Stage", "days": 45, "task": "Perform weeding and earthing up, control stem borer.", "water": "Moderate", "fertilizer": "Urea top dressing"},
            {"stage": "Tasseling & Silking", "days": 75, "task": "Critical moisture stage. Ensure stress-free watering.", "water": "High", "fertilizer": "NPK top dose"},
            {"stage": "Maturity & Harvesting", "days": 110, "task": "Harvest when husk covers turn yellow-dry and grains are hard.", "water": "None", "fertilizer": "None"}
        ],
        "millets": [
            {"stage": "Sowing & Germination", "days": 10, "task": "Sow seeds thinly, ensure proper soil contact.", "water": "Low", "fertilizer": "Nitrogenous base"},
            {"stage": "Vegetative Growth", "days": 40, "task": "Thin seedlings to keep spacing, perform one weeding.", "water": "Low", "fertilizer": "Urea split"},
            {"stage": "Flowering & Grain Development", "days": 75, "task": "Irrigate only if severe drought occurs, protect from birds.", "water": "Moderate", "fertilizer": "N/A"},
            {"stage": "Harvesting", "days": 95, "task": "Cut earheads when grains are dry and mature, thrash and dry.", "water": "None", "fertilizer": "None"}
        ]
    }

    @classmethod
    def generate_calendar(cls, crop_key: str, sowing_date: datetime.date) -> list:
        """
        Creates list of agricultural stages, scheduling dates from base sowing date.
        """
        crop_key_lower = crop_key.lower()
        if crop_key_lower not in cls.CROP_METADATA:
            crop_key_lower = "rice"
            
        stages = cls.CROP_METADATA[crop_key_lower]
        calendar_events = []
        
        current_date_offset = 0
        for stage in stages:
            start_offset = current_date_offset
            end_offset = stage["days"]
            
            start_date = sowing_date + datetime.timedelta(days=start_offset)
            end_date = sowing_date + datetime.timedelta(days=end_offset)
            
            calendar_events.append({
                "stage": stage["stage"],
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
                "task": stage["task"],
                "water_requirement": stage["water"],
                "fertilizer_recommendation": stage["fertilizer"],
                "status": "upcoming"
            })
            current_date_offset = end_offset
            
        return calendar_events
