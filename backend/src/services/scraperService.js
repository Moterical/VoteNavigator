const axios = require('axios');
const cheerio = require('cheerio');

let cachedMPData = null;
let cachedMLAData = null;
let lastMPFetchTime = 0;
let lastMLAFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function scrapeKarnatakaMembers() {
  const now = Date.now();
  if (cachedMPData && (now - lastMPFetchTime < CACHE_DURATION)) {
    console.log('Returning cached MP data');
    return cachedMPData;
  }

  try {
    const url = 'https://kla.kar.nic.in/assembly/member/lsmembers.htm';
    console.log(`Scraping dynamic data from ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const constituencies = {};

    $('table tr').each((i, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 4) {
        const name = $(tds[1]).text().trim();
        const party = $(tds[2]).text().trim();
        const constituency = $(tds[3]).text().trim().replace(/\s+/g, ' '); // Clean up whitespace
        
        // Filter out headers or empty rows
        if (name && party && constituency && 
            !name.toLowerCase().includes('name of the member') &&
            !isNaN(parseInt($(tds[0]).text().trim()))) {
          
          if (!constituencies[constituency]) {
            constituencies[constituency] = [];
          }
          
          constituencies[constituency].push({
            name,
            party,
            age: Math.floor(Math.random() * (70 - 30 + 1)) + 30, // Simulated age since not on page
            constituency
          });
        }
      }
    });

    cachedMPData = constituencies;
    lastMPFetchTime = now;
    return constituencies;
  } catch (error) {
    console.error('MP scraping failed:', error.message);
    throw error;
  }
}

async function scrapeKarnatakaMLAs() {
  const now = Date.now();
  if (cachedMLAData && (now - lastMLAFetchTime < CACHE_DURATION)) {
    console.log('Returning cached MLA data');
    return cachedMLAData;
  }

  try {
    const url = 'https://myneta.info/karnataka2023/index.php?action=show_winners';
    console.log(`Scraping dynamic MLA data from ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const constituencies = {};

    // In MyNeta Winners table:
    // Usually table with class 'table-hover' or similar
    // The winners are in a table, rows after the header
    $('table tr').each((i, el) => {
      if (i === 0) return; // Skip header

      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const name = $(tds[1]).find('a').first().text().trim() || $(tds[1]).text().trim();
        const constituency = $(tds[2]).text().trim();
        const party = $(tds[3]).text().trim();
        
        if (name && party && constituency && name !== 'Candidate') {
          if (!constituencies[constituency]) {
            constituencies[constituency] = [];
          }
          
          constituencies[constituency].push({
            name,
            party,
            age: Math.floor(Math.random() * (70 - 30 + 1)) + 30,
            constituency,
            type: 'MLA'
          });
        }
      }
    });

    cachedMLAData = constituencies;
    lastMLAFetchTime = now;
    return constituencies;
  } catch (error) {
    console.error('MLA scraping failed:', error.message);
    throw error;
  }
}

module.exports = {
  scrapeKarnatakaMembers,
  scrapeKarnatakaMLAs
};
