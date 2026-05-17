const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    const url = 'https://kla.kar.nic.in/assembly/member/lsmembers.htm';
    console.log(`Fetching ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const members = [];
    // The previous tool output showed triplets. Let's try to find the table.
    $('table tr').each((i, el) => {
      if (i === 0) return; // Skip header
      
      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const name = $(tds[1]).text().trim();
        const party = $(tds[2]).text().trim();
        const constituency = $(tds[3]).text().trim();
        
        if (name && party && constituency) {
          members.push({ name, party, constituency });
        }
      }
    });

    console.log('Scraped first 5 members:');
    console.log(members.slice(0, 5));
    console.log(`Total members found: ${members.length}`);
  } catch (error) {
    console.error('Scrape failed:', error.message);
  }
}

testScrape();
