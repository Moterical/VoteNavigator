const fs = require('fs');
const path = require('path');

class VoterService {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/boothDirectory.json');
    this.loadData();
  }

  loadData() {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.db = JSON.parse(rawData);
    } catch (error) {
      console.error('Failed to load booth directory data:', error);
      this.db = { districts: [], constituencies: {}, booths: {} };
    }
  }

  getDistricts() {
    return { success: true, data: this.db.districts };
  }

  getConstituencies(districtId) {
    const data = this.db.constituencies[districtId] || [];
    return { success: true, data };
  }

  getBooths(constituencyId) {
    const data = this.db.booths[constituencyId] || [];
    return { success: true, data };
  }
}

module.exports = new VoterService();
