export const suggestedPrompts = [
  'What fertilizer should I use?',
  'Why are my tomato leaves yellow?',
  'Will it rain tomorrow?',
  "What is today's tomato price?",
  'When should I irrigate my crop?',
]

export function mockKisanReply(prompt: string) {
  const q = prompt.toLowerCase()

  if (q.includes('yellow') && (q.includes('tomato') || q.includes('leaf') || q.includes('leaves'))) {
    return {
      text: `Yellowing tomato leaves can be caused by nutrient deficiency, overwatering, poor drainage, or early disease symptoms.

Start by checking soil moisture and inspect the underside of the leaves.`,
      causes: [
        'Nitrogen or magnesium deficiency, especially on older leaves',
        'Overwatering or poor drainage around the root zone',
        'Early blight or leaf spot beginning on lower canopy',
        'Whiteflies or mites stressing the plant',
      ],
      actions: [
        'Feel the soil 8 cm down — irrigate only if dry',
        'Remove severely yellow lower leaves and keep them out of the field',
        'Apply a balanced feed with extra potassium during fruiting',
        'If concentric spots appear, begin an organic copper or neem program',
      ],
      prevention: [
        'Drip irrigate in the morning and keep foliage dry',
        'Stake plants for airflow',
        'Rotate solanaceous crops and mulch to reduce soil splash',
      ],
    }
  }

  if (q.includes('fertilizer')) {
    return {
      text: 'For fruiting tomatoes on day 42, shift from high nitrogen to a potassium-forward program. A typical field dose is a water-soluble 12-12-36 or a farm mix of compost plus sulphate of potash, applied after irrigation.',
      causes: ['Excess nitrogen delays fruit and invites disease'],
      actions: ['Apply potassium in the next two irrigations', 'Keep a light calcium spray if blossom-end rot appears'],
      prevention: ['Soil-test once a season and split fertilizers rather than dumping urea'],
    }
  }

  if (q.includes('rain')) {
    return {
      text: 'Coimbatore has a 35% chance of light evening rain tomorrow. Temperatures stay near 29°C. Hold foliar sprays after 4 PM and keep drip irrigation shorter if showers arrive.',
      causes: ['Local convective clouds typical of late afternoon'],
      actions: ['Finish field work in the morning', 'Check drainage in low plots'],
      prevention: ['Do not leave harvested tomatoes in open crates overnight'],
    }
  }

  if (q.includes('price') || q.includes('tomato')) {
    return {
      text: 'Today’s tomato modal price at Mettupalayam mandi is ₹2,850 per quintal (range ₹2,400–₹3,200), up 8.2% this week. Coimbatore is slightly lower. If fruit is firm and graded, Mettupalayam is the better window.',
      causes: ['Firm urban demand and slightly tighter arrivals'],
      actions: ['Send graded A-quality fruit tomorrow morning', 'Hold overripe lots for local sale'],
      prevention: ['Set a price alert at ₹3,000 / quintal in Market Prices'],
    }
  }

  if (q.includes('irrigat')) {
    return {
      text: 'Irrigate tomatoes at first light when the top 8 cm of soil is dry. On day 42 (fruiting), a 25–30 minute drip cycle is usually enough. Avoid evening irrigation — wet leaves overnight raise early blight risk.',
      causes: ['Fruiting crops use more water but hate waterlogged roots'],
      actions: ['Run drip before 8 AM', 'Skip a cycle if rain probability exceeds 50%'],
      prevention: ['Mulch ridges to slow evaporation'],
    }
  }

  return {
    text: 'I can help with fertilizer, irrigation, pests, weather, and mandi prices. Share the crop, location, and what you are seeing in the field for a precise next step.',
    causes: ['Many field issues look similar without a photo or growth stage'],
    actions: ['Tell me the crop and symptoms, or open AI Crop Doctor to scan a leaf'],
    prevention: ['Weekly scouting plus weather checks prevent most losses'],
  }
}

export const earlyBlightDiagnosis = {
  disease_detected: 'Early Blight',
  symptoms:
    'Concentric brown lesions on older tomato leaves, yellowing around spots, and possible stem lesions near the soil line. Fruit may show leathery dark spots near the stem.',
  treatment:
    'Remove infected lower leaves, improve airflow, switch to morning drip irrigation, and begin a protectant spray program. Avoid working the crop when wet.',
  organic_solution:
    'Neem oil (3 ml/L) plus a copper-based organic fungicide at label rate. Compost tea only if drainage is already corrected.',
  chemical_solution:
    'Chlorothalonil or mancozeb as a protectant; rotate with a strobilurin if pressure is high. Follow label interval and pre-harvest interval.',
  recommended_pesticides: ['Mancozeb', 'Chlorothalonil', 'Azoxystrobin (rotate)'],
  warning: 'Confirm with a local agri officer before spraying. This prototype result is for demonstration when live diagnosis is unavailable.',
  confidence: 94,
  severity: 'Moderate',
  crop: 'Tomato',
  prevention:
    'Stake plants, mulch to stop soil splash, rotate away from tomato/potato for two seasons, and keep nitrogen moderate during fruiting.',
}
