const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class CivicService {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/civicDirectory.json');
    this.loadData();
  }

  loadData() {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.db = JSON.parse(rawData);
    } catch (error) {
      console.error('Failed to load civic directory data:', error);
      this.db = {};
    }
  }

  getRepresentative(constituencyId) {
    const data = this.db[constituencyId];
    if (data) {
      return { success: true, data };
    } else {
      return { success: false, message: "Representative data not available for this area yet." };
    }
  }

  async generateComplaintDraft(issueDescription, repName, areaName) {
    try {
      const prompt = `
        You are a helpful civic assistant. A citizen wants to report a local issue to their elected representative (MLA).
        
        Details:
        - Representative Name: ${repName}
        - Area/Constituency: ${areaName}
        - The Issue: "${issueDescription}"
        
        Write a short, polite, and formal email draft that the citizen can send to their MLA. 
        It should be concise (max 3-4 sentences). Do not include any placeholder brackets except for [Your Name] and [Your Phone Number] at the very bottom.
        
        Output ONLY the email text. Do not include subject lines or conversational filler.
      `;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.3,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { success: true, draft: response.text().trim() };
    } catch (error) {
      console.error('Gemini Draft Generation Error:', error);
      // Fallback template if AI fails
      const fallbackDraft = `Dear ${repName},\n\nI am a resident of ${areaName}. I am writing to urgently bring your attention to the following issue: ${issueDescription}.\n\nPlease look into this matter as it affects the safety and wellbeing of our community.\n\nRegards,\n[Your Name]\n[Your Phone Number]`;
      return { success: true, draft: fallbackDraft };
    }
  }
}

module.exports = new CivicService();
