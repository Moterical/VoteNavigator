-- ============================================================
-- VoteNavigator Seed Data
-- All content sourced from official ECI / Government sources
-- Last verified: April 2025
-- Source: https://eci.gov.in | https://voters.eci.gov.in
-- ============================================================

-- ============================================================
-- KNOWLEDGE BASE (merged civic concepts + glossary)
-- ============================================================
INSERT INTO knowledge_base (concept_key, title, abbreviation, full_form, short_description, full_explanation, example, can_citizens_vote, category, source_url) VALUES

-- Election Types
('lok_sabha', 'Lok Sabha (House of the People)', NULL, NULL,
  'The lower house of India''s Parliament. Citizens directly vote to elect Members of Parliament (MPs).',
  'The Lok Sabha is the lower house of the Parliament of India. It consists of 543 elected seats. Citizens aged 18 and above who are registered voters can directly vote for their Member of Parliament (MP) from their constituency. Elections are held every 5 years unless dissolved earlier. The party or coalition with a majority forms the government.',
  'In the 2024 Lok Sabha election, voters across India chose 543 MPs.',
  TRUE, 'election_type', 'https://eci.gov.in'),

('vidhan_sabha', 'Vidhan Sabha (State Legislative Assembly)', NULL, NULL,
  'The state-level legislature. Citizens directly vote to elect Members of the Legislative Assembly (MLAs).',
  'The Vidhan Sabha is the lower house of a state legislature in India. Citizens who are registered voters in a state can directly vote for their Member of the Legislative Assembly (MLA) from their Assembly Constituency. State elections are held every 5 years. The MLA represents your local area at the state level.',
  'Maharashtra has 288 Vidhan Sabha seats. Citizens vote for their local MLA.',
  TRUE, 'election_type', 'https://eci.gov.in'),

('rajya_sabha', 'Rajya Sabha (Council of States)', NULL, NULL,
  'The upper house of Parliament. Citizens do NOT directly vote in Rajya Sabha elections.',
  'The Rajya Sabha is the upper house of the Parliament of India. It is a permanent body and is not subject to dissolution. IMPORTANT: Citizens do not directly vote for Rajya Sabha members. Rajya Sabha members are elected by the elected members of State Legislative Assemblies (MLAs) and Union Territories through a system of proportional representation. As a voter, you cannot cast your ballot in a Rajya Sabha election.',
  'Your MLA votes to elect Rajya Sabha members — you do not.',
  FALSE, 'election_type', 'https://eci.gov.in'),

('local_body', 'Local Body Elections', NULL, NULL,
  'Municipal and Panchayat elections. Citizens vote for local representatives like councillors and ward members.',
  'Local body elections include Municipal Corporation elections (for urban areas) and Gram Panchayat / Panchayat Samiti elections (for rural areas). Citizens vote directly for their local ward councillor, sarpanch, or gram panchayat member. These elections are conducted by the State Election Commission (not the Election Commission of India) and are held separately from Lok Sabha and Vidhan Sabha elections.',
  'In a Municipal Corporation election, you vote for your local ward councillor.',
  TRUE, 'election_type', 'https://eci.gov.in'),

('by_election', 'By-Election (उपचुनाव)', NULL, NULL,
  'A special election held to fill a vacancy created by the resignation, death, or disqualification of a sitting MP or MLA.',
  'A by-election (also called a bye-election or supplementary election) is held when a seat in the Lok Sabha or Vidhan Sabha becomes vacant before the end of the term. This happens due to the death, resignation, expulsion, or court-ordered disqualification of the elected member. Citizens in that specific constituency vote to fill the vacant seat. By-elections do not affect other constituencies.',
  'If an MP resigns, only voters in that Parliamentary Constituency participate in the by-election.',
  TRUE, 'election_type', 'https://eci.gov.in'),

-- Voting Process & Terminology
('evm', 'EVM — Electronic Voting Machine', 'EVM', 'Electronic Voting Machine',
  'The machine used to cast your vote at the polling booth. It replaced paper ballots in Indian elections.',
  'An Electronic Voting Machine (EVM) is the official device used to cast votes in Indian elections. It consists of two units: the Control Unit (with the Polling Officer) and the Balloting Unit (with the voter). The balloting unit shows candidate names and party symbols with buttons next to them. You press the button next to your chosen candidate to cast your vote. EVMs have been used in all constituencies since 2004.',
  'You press the button next to your candidate on the EVM to cast your vote.',
  NULL, 'terminology', 'https://eci.gov.in'),

('vvpat', 'VVPAT — Voter Verifiable Paper Audit Trail', 'VVPAT', 'Voter Verifiable Paper Audit Trail',
  'A machine connected to the EVM that prints a paper slip showing your vote for 7 seconds so you can verify it.',
  'VVPAT (Voter Verifiable Paper Audit Trail) is a device attached to the EVM that provides a paper trail of your vote. After you press a button on the EVM, a paper slip is printed inside the VVPAT glass case showing the candidate name, party symbol, and serial number. This slip is visible for 7 seconds and then falls into a sealed box. It allows you to confirm your vote was registered correctly. VVPATs were introduced nationwide in 2019.',
  'After voting, check the VVPAT slip to confirm your vote was recorded correctly.',
  NULL, 'voting_process', 'https://eci.gov.in'),

('nota', 'NOTA — None of the Above', 'NOTA', 'None of the Above',
  'An option on the EVM that allows you to reject all candidates without spoiling your ballot.',
  'NOTA (None of the Above) is an option available on all EVMs that allows a voter to formally express rejection of all candidates contesting from their constituency. It appears as the last option on the balloting unit. NOTA was introduced following a Supreme Court of India order on September 27, 2013. Pressing NOTA means your vote is counted but not credited to any candidate. Even if NOTA gets the most votes, the candidate with the next highest votes wins.',
  'If you do not wish to vote for any candidate, press the NOTA button on the EVM.',
  NULL, 'voting_process', 'https://eci.gov.in'),

('epic', 'EPIC — Electoral Photo Identity Card', 'EPIC', 'Electoral Photo Identity Card',
  'Your official Voter ID card issued by the Election Commission of India. Used as the primary ID at the polling booth.',
  'EPIC (Electoral Photo Identity Card) is the official identity card issued by the Election Commission of India to registered voters. It is commonly known as the Voter ID card. It contains your name, photo, address, and a unique EPIC number (format: 3 letters + 7 digits, e.g., ABC1234567). The EPIC number is the primary unique identifier used to look up your voter registration status, constituency, and polling booth. An e-EPIC (digital version) can be downloaded from voters.eci.gov.in.',
  'EPIC number format: ABC1234567 (3 letters + 7 digits).',
  NULL, 'terminology', 'https://voters.eci.gov.in'),

('e_epic', 'e-EPIC — Electronic Voter ID Card', 'e-EPIC', 'Electronic Electoral Photo Identity Card',
  'The digital version of your Voter ID card. Downloadable from voters.eci.gov.in on your phone.',
  'The e-EPIC is the digital/PDF version of the Electoral Photo Identity Card (EPIC). It can be downloaded from voters.eci.gov.in using your registered mobile number or EPIC number. It is legally valid as a photo ID at the polling booth. You do not need to print it — showing it on your phone is sufficient.',
  'Download your e-EPIC from voters.eci.gov.in using your EPIC number or registered mobile number.',
  NULL, 'terminology', 'https://voters.eci.gov.in'),

('mcc', 'Model Code of Conduct', 'MCC', 'Model Code of Conduct',
  'A set of rules that political parties and candidates must follow from the date of election announcement until results.',
  'The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India that regulates the conduct of political parties and candidates during elections. It comes into force from the date of announcement of elections and remains in effect until the declaration of results. During MCC, the government cannot announce new welfare schemes, make major policy decisions, or use government resources for campaigning. It ensures a level playing field for all parties.',
  'During MCC, no new government schemes or welfare announcements can be made.',
  NULL, 'terminology', 'https://eci.gov.in'),

-- Bodies & Officials
('nvsp', 'National Voters'' Service Portal', 'NVSP', 'National Voters'' Service Portal',
  'The official government portal (voters.eci.gov.in) to register to vote, check status, and download e-EPIC.',
  'NVSP (National Voters'' Service Portal) is the official online platform of the Election Commission of India available at voters.eci.gov.in. Through NVSP, you can: register as a new voter (Form 6), correct your voter details (Form 8), transfer your registration to a new constituency (Form 8A), check if your name is on the electoral roll, download your e-EPIC (digital Voter ID), and find your polling booth location.',
  'Register to vote online at voters.eci.gov.in using the NVSP.',
  NULL, 'bodies', 'https://voters.eci.gov.in'),

('eci', 'Election Commission of India', 'ECI', 'Election Commission of India',
  'The constitutional body responsible for administering all elections in India.',
  'The Election Commission of India (ECI) is an autonomous constitutional authority established under Article 324 of the Indian Constitution. It is responsible for administering election processes for the Lok Sabha, Rajya Sabha, State Legislative Assemblies, and the offices of the President and Vice President of India. The ECI announces election dates, enforces the Model Code of Conduct, and oversees the conduct of free and fair elections.',
  'The ECI announces election dates and enforces the Model Code of Conduct.',
  NULL, 'bodies', 'https://eci.gov.in'),

('blo', 'Booth Level Officer', 'BLO', 'Booth Level Officer',
  'A government official responsible for maintaining the voter list in your local polling area.',
  'A Booth Level Officer (BLO) is a government official assigned to each polling booth. Their responsibilities include: maintaining and updating the electoral roll for their booth area, visiting households to verify voter information, distributing Voter ID cards, collecting Form 12D applications from senior citizens (85+) and PwD voters for home voting, and helping voters with registration queries. If you have a problem with your voter registration, your BLO is your first point of contact.',
  'Contact your BLO if your name is missing from the voter list or if you need help with Form 12D.',
  NULL, 'bodies', 'https://eci.gov.in'),

('ero', 'Electoral Registration Officer', 'ERO', 'Electoral Registration Officer',
  'The officer who maintains the electoral roll for an Assembly Constituency. Senior to the BLO.',
  'The Electoral Registration Officer (ERO) is the officer responsible for the preparation, revision, and maintenance of the electoral roll for an Assembly Constituency. The ERO is usually a senior government officer designated by the State Government. The BLO reports to the ERO. If you need to appeal against a decision made by the BLO, you can approach the ERO.',
  'Appeals against BLO decisions on voter registration go to the ERO.',
  NULL, 'bodies', 'https://eci.gov.in'),

('mla', 'Member of Legislative Assembly', 'MLA', 'Member of Legislative Assembly',
  'Your elected representative in the State Legislature, chosen in Vidhan Sabha elections.',
  'A Member of the Legislative Assembly (MLA) is a representative elected by voters in an Assembly Constituency to the state Vidhan Sabha (State Legislative Assembly). MLAs make state laws, vote on the state budget, and hold the state government accountable. They also elect Rajya Sabha members. Each Assembly Constituency elects one MLA.',
  'You vote for an MLA in Vidhan Sabha (state) elections.',
  NULL, 'bodies', 'https://eci.gov.in'),

('mp', 'Member of Parliament', 'MP', 'Member of Parliament',
  'Your elected representative in the Lok Sabha (Lower House of Parliament), chosen in Lok Sabha elections.',
  'A Member of Parliament (MP) is a representative elected by voters in a Parliamentary Constituency to the Lok Sabha (Lower House of Parliament). MPs make national laws, vote on the national budget, and hold the central government accountable. Each Parliamentary Constituency elects one MP to the Lok Sabha.',
  'You vote for an MP in Lok Sabha (general) elections.',
  NULL, 'bodies', 'https://eci.gov.in'),

-- Constituencies
('assembly_constituency', 'Assembly Constituency (AC)', 'AC', 'Assembly Constituency',
  'Your local voting area for state elections. Each AC elects one MLA to the state legislature.',
  'An Assembly Constituency (AC), also called a Vidhan Sabha Seat, is the basic geographical unit for state elections. Each state is divided into multiple ACs. Voters in each AC elect one Member of the Legislative Assembly (MLA). India has 4,033 Vidhan Sabha seats across all states and Union Territories. Your EPIC card and voter registration are linked to your Assembly Constituency.',
  'Your voter registration is tied to your Assembly Constituency.',
  NULL, 'terminology', 'https://eci.gov.in'),

('parliamentary_constituency', 'Parliamentary Constituency (PC)', 'PC', 'Parliamentary Constituency',
  'Your voting area for Lok Sabha elections. Each PC elects one MP to Parliament.',
  'A Parliamentary Constituency (PC), also called a Lok Sabha Seat, is the geographical unit for Lok Sabha elections. India has 543 Parliamentary Constituencies. Each PC is made up of multiple Assembly Constituencies (ACs). Voters in each PC elect one Member of Parliament (MP). Your Lok Sabha constituency determines which MP represents your area in Parliament.',
  'India has 543 Parliamentary Constituencies, each electing one MP.',
  NULL, 'terminology', 'https://eci.gov.in'),

-- Absentee Voter Categories
('avsc', 'Absentee Voter — Senior Citizen', 'AVSC', 'Absentee Voter Senior Citizen',
  'Category for voters above 85 years eligible for home voting via postal ballot under Rule 27A.',
  'AVSC (Absentee Voter Senior Citizen) is the official ECI category for registered voters who are above 85 years of age and eligible to cast their vote from home via postal ballot under Rule 27A of the Conduct of Elections Rules, 1961. Eligible voters must apply via Form 12D within 5 days of the election notification. The facility is voluntary — they may still choose to vote in person.',
  'Voters above 85 can apply via Form 12D through their BLO for home voting.',
  NULL, 'terminology', 'https://eci.gov.in'),

('avpd', 'Absentee Voter — Person with Disability', 'AVPD', 'Absentee Voter Person with Disability',
  'Category for voters with 40%+ benchmark disability eligible for home voting via postal ballot.',
  'AVPD (Absentee Voter Person with Disability) is the official ECI category for registered voters with a benchmark disability of 40% or more. They are eligible to vote from home via postal ballot under Rule 27A of the Conduct of Elections Rules, 1961. A copy of the benchmark disability certificate must be attached to the Form 12D application. The facility is voluntary.',
  'PwD voters with 40%+ disability can apply via Form 12D for home voting.',
  NULL, 'terminology', 'https://eci.gov.in');




-- ============================================================
-- FAQS
-- ============================================================
INSERT INTO faqs (question, answer, category, tags, source_url) VALUES

('Am I eligible to vote in India?',
  'To be eligible to vote in India, you must: (1) Be a citizen of India, (2) Be at least 18 years old on the qualifying date (January 1st of the year of electoral roll revision), (3) Be ordinarily resident in the constituency where you want to register, and (4) Not be disqualified under any law (e.g., not declared of unsound mind by a court, not convicted of certain offences). NRI citizens are also eligible to register using Form 6A.',
  'eligibility', ARRAY['eligible', 'qualify', 'age', '18', 'citizen', 'can i vote'], 'https://eci.gov.in'),

('How do I register to vote for the first time?',
  'To register as a first-time voter: (1) Go to voters.eci.gov.in or the Voter Helpline App, (2) Click on "New Registration" and fill Form 6 online, (3) You will need your Aadhaar number, recent passport-size photo, and proof of residence, (4) Submit the form and note your reference number, (5) A BLO may visit to verify your details, (6) Once approved, you will receive your EPIC (Voter ID card). You can also download your e-EPIC digitally.',
  'registration', ARRAY['register', 'first time', 'new voter', 'form 6', 'how to register'], 'https://voters.eci.gov.in'),

('What is the last date to register to vote?',
  'The deadline for voter registration varies by election. Generally, you must register at least a few weeks before the polling date. The exact cut-off is announced by the Election Commission when election dates are declared. Check eci.gov.in or voters.eci.gov.in for current deadlines specific to your state.',
  'registration', ARRAY['last date', 'deadline', 'cutoff', 'when to register'], 'https://eci.gov.in'),

('I moved to a new city. Can I still vote?',
  'Yes, but you have two options: (1) Vote in your original constituency — travel back on polling day to the booth where you are registered. (2) Transfer your registration — fill Form 8A on voters.eci.gov.in to update your address to your new location. This will change your constituency. Note: If elections are announced, registration changes may be frozen. Check voters.eci.gov.in for current status.',
  'registration', ARRAY['moved', 'new city', 'transfer', 'migration', 'relocated', 'new address'], 'https://voters.eci.gov.in'),

('I don''t have my Voter ID card. Can I still vote?',
  'Yes! You do not need your physical Voter ID card to vote. You can carry any ONE of these 13 officially accepted photo ID documents: (1) Aadhaar Card, (2) PAN Card, (3) Driving Licence, (4) Indian Passport, (5) MNREGA Job Card, (6) Pension Document with photo, (7) Service Identity Card (Govt/PSU employees), (8) Bank/Post Office Passbook with photo, (9) Health Insurance Smart Card (Ministry of Labour), (10) Smart Card under NPR, (11) Official ID card for MPs/MLAs/MLCs, (12) UDID Card (for persons with disability), (13) e-EPIC (downloaded on your phone). Most importantly, your name must be on the electoral roll.',
  'documents', ARRAY['no voter id', 'lost voter id', 'alternative id', 'documents', 'what to bring'], 'https://eci.gov.in'),

('How do I find my polling booth?',
  'To find your polling booth: (1) Visit voters.eci.gov.in or electoralsearch.eci.gov.in, (2) Enter your EPIC number and state, (3) Your booth name, address, and electoral roll details will be shown. You can also call the Voter Helpline at 1950 or use the Voter Helpline App (available on Android and iOS).',
  'booth', ARRAY['polling booth', 'where to vote', 'find booth', 'voting centre'], 'https://voters.eci.gov.in'),

('What happens inside the polling booth when I vote?',
  'Here is the step-by-step process at the polling booth: (1) Arrive at your assigned polling booth with your photo ID, (2) Show your ID to the first Polling Officer — they verify your name on the electoral roll, (3) The second Polling Officer applies indelible ink to the index finger of your left hand, (4) You sign or put a thumb impression in the register, (5) You receive a ballot slip and proceed to the EVM, (6) Press the button next to your chosen candidate on the balloting unit, (7) The VVPAT machine prints a slip — you can see it through the glass for 7 seconds, (8) Your vote is cast. Exit the booth.',
  'voting_day', ARRAY['inside booth', 'voting process', 'how to vote', 'evm', 'ink', 'steps'], 'https://eci.gov.in'),

('What is NOTA and how do I use it?',
  'NOTA stands for "None of the Above." It is an option on the EVM that lets you formally reject all candidates without spoiling your ballot. It appears as the last option on the balloting unit. To use it, simply press the button next to NOTA. Your vote is counted, but it is not credited to any candidate. Even if NOTA receives the most votes, the candidate with the highest individual votes wins the seat.',
  'voting_day', ARRAY['nota', 'none of the above', 'reject', 'no candidate'], 'https://eci.gov.in'),

('Is voting mandatory in India?',
  'No, voting is not mandatory in India (except in the state of Gujarat, where local body elections have compulsory voting provisions). Voting in Lok Sabha, Vidhan Sabha, and most other elections is voluntary. There is no penalty for not voting in national elections.',
  'general', ARRAY['mandatory', 'compulsory', 'must vote', 'fine for not voting'], 'https://eci.gov.in'),

('Can I vote if I am away from my constituency on election day?',
  'Currently, Indian law does not allow ordinary voters to vote from outside their registered constituency (except via postal ballot for specific categories like armed forces, essential services, and absentee voters above 85 or with 40%+ disability). If you are away, you have two options: (1) Travel back to your booth on polling day, or (2) Transfer your registration to your current location using Form 8A on voters.eci.gov.in before the registration deadline.',
  'voting_day', ARRAY['away', 'travel', 'proxy', 'absent', 'out of station'], 'https://eci.gov.in'),

('Do I vote for Rajya Sabha members?',
  'No. Citizens do not directly vote in Rajya Sabha elections. Rajya Sabha (the Upper House of Parliament) members are elected by the elected MLAs of State Legislative Assemblies, not by the general public. As a voter, you directly elect MPs in Lok Sabha elections and MLAs in Vidhan Sabha elections. MLAs then elect Rajya Sabha members.',
  'general', ARRAY['rajya sabha', 'upper house', 'rajya sabha vote', 'council of states'], 'https://eci.gov.in'),

('What is the difference between Lok Sabha and Vidhan Sabha elections?',
  'Lok Sabha elections are held for the national Parliament: you vote for your Member of Parliament (MP) who represents your Parliamentary Constituency in the Lok Sabha in New Delhi. These are "General Elections" held every 5 years. Vidhan Sabha elections are held for your State Legislature: you vote for your Member of the Legislative Assembly (MLA) who represents your Assembly Constituency in your State Capital. These are "State Elections" held every 5 years, but on a different schedule from Lok Sabha elections.',
  'general', ARRAY['lok sabha vs vidhan sabha', 'state vs central', 'difference', 'mp vs mla'], 'https://eci.gov.in'),

('How do I check if my name is on the voter list?',
  'Check your voter registration status by: (1) Visiting electoralsearch.eci.gov.in, (2) Entering your EPIC number and state — this is the most accurate method. Alternatively, you can search by name and constituency details on the same portal. You can also call Voter Helpline 1950 or use the Voter Helpline App.',
  'registration', ARRAY['voter list', 'electoral roll', 'check name', 'am i registered', 'epic number'], 'https://electoralsearch.eci.gov.in'),

('My name is missing from the voter list on election day. What do I do?',
  'If your name is missing from the voter list: (1) First check electoralsearch.eci.gov.in — your booth may have changed, (2) Contact your Booth Level Officer (BLO) immediately, (3) Go to the Voter Assistance Booth set up outside your polling station — election officials can help, (4) If you believe it is an error, you can call Voter Helpline 1950 or file a complaint on the cVIGIL app. Unfortunately, on polling day itself, if your name is not on the roll, you cannot cast a regular ballot.',
  'rights', ARRAY['name missing', 'not on list', 'problem at booth', 'election day issue'], 'https://eci.gov.in'),

('Can senior citizens and differently-abled voters vote from home?',
  'Yes! Under Rule 27A of the Conduct of Elections Rules, 1961, voters above 85 years of age (AVSC category) and voters with a benchmark disability of 40% or more (AVPD category) can vote from home via postal ballot. A Booth Level Officer will visit your home with Form 12D. You must apply within 5 days of the election notification. This is entirely voluntary — you can still choose to vote in person at the booth.',
  'rights', ARRAY['senior citizen', 'elderly', 'disabled', 'home voting', 'postal ballot', 'form 12d', '85'], 'https://eci.gov.in');


-- ============================================================
-- FORMS GUIDE
-- ============================================================
INSERT INTO forms_guide (form_type, form_name, purpose, step_number, step_title, step_description, step_documents, portal_url) VALUES

('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 1, 'Check Your Eligibility', 'Before filling the form, confirm you are: (1) A citizen of India, (2) At least 18 years old on January 1st of the current year, (3) Not already registered in another constituency.', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 2, 'Go to the Official Portal', 'Visit voters.eci.gov.in on your phone or computer. Click on "New Registration" or look for "Form 6". You can also use the Voter Helpline App.', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 3, 'Fill Your Personal Details', 'Enter your full name, date of birth, gender, and your current residential address. Make sure the address is where you ordinarily reside (not a temporary address).', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 4, 'Upload Required Documents', 'Upload: (1) A recent passport-size photograph, (2) Proof of Age (Aadhaar, birth certificate, school leaving certificate, or passport), (3) Proof of Residence (Aadhaar, utility bill, bank passbook, or rent agreement).', ARRAY['Passport-size photo', 'Proof of Age (Aadhaar / Birth Certificate / Passport)', 'Proof of Residence (Aadhaar / Utility Bill / Rent Agreement)'], 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 5, 'Link Your Aadhaar (Optional)', 'You may voluntarily link your Aadhaar number with your voter registration. This helps in deduplication and ensuring your entry is accurate. This step is not mandatory.', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 6, 'Submit and Note Your Reference Number', 'Review all details carefully and submit the form. Note down your application reference number. You can use this to track your application status on voters.eci.gov.in.', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 7, 'BLO Verification', 'A Booth Level Officer (BLO) may visit your address to verify your details in person. This is a standard part of the process. Cooperate with the BLO and provide any documents they request.', NULL, 'https://voters.eci.gov.in'),
('FORM_6', 'Form 6 — New Voter Registration', 'For Indian citizens above 18 years registering to vote for the first time in a constituency.', 8, 'Receive Your EPIC Card', 'Once approved, your name will be added to the electoral roll. Your Voter ID (EPIC) card will be dispatched by post. You can also download your e-EPIC (digital Voter ID) from voters.eci.gov.in immediately after approval.', NULL, 'https://voters.eci.gov.in'),

('FORM_8', 'Form 8 — Correction of Voter Details', 'For registered voters who need to correct or update information in their existing voter registration (name, address, photo, date of birth, etc.).', 1, 'Identify What Needs Correction', 'Determine what information is incorrect: name spelling, date of birth, address, photo, or family details. Form 8 covers corrections within the same constituency only.', NULL, 'https://voters.eci.gov.in'),
('FORM_8', 'Form 8 — Correction of Voter Details', 'For registered voters who need to correct or update information in their existing voter registration (name, address, photo, date of birth, etc.).', 2, 'Fill Form 8 Online', 'Go to voters.eci.gov.in and select Form 8 (Modification of Entries). Enter your existing EPIC number, select what you want to correct, and provide the correct information.', ARRAY['Existing EPIC number', 'Supporting document for the correction (e.g., Aadhaar for name/DOB correction)'], 'https://voters.eci.gov.in'),
('FORM_8', 'Form 8 — Correction of Voter Details', 'For registered voters who need to correct or update information in their existing voter registration (name, address, photo, date of birth, etc.).', 3, 'Upload Proof', 'Upload a document supporting your correction. For name correction: Aadhaar or PAN card. For DOB correction: Birth certificate, Aadhaar, or school leaving certificate. For address update within same constituency: utility bill or Aadhaar.', NULL, 'https://voters.eci.gov.in'),
('FORM_8', 'Form 8 — Correction of Voter Details', 'For registered voters who need to correct or update information in their existing voter registration (name, address, photo, date of birth, etc.).', 4, 'Submit and Track', 'Submit the form and note your reference number. Track the status on voters.eci.gov.in. After approval, download your updated e-EPIC.', NULL, 'https://voters.eci.gov.in'),

('FORM_8A', 'Form 8A — Transfer of Voter Registration', 'For registered voters who have moved to a new address in a DIFFERENT constituency and want to update their registration to the new location.', 1, 'Confirm You Have Moved to a New Constituency', 'Form 8A is for address changes that cross constituency boundaries. If you moved within the same constituency, use Form 8 instead. Check your constituency at voters.eci.gov.in.', NULL, 'https://voters.eci.gov.in'),
('FORM_8A', 'Form 8A — Transfer of Voter Registration', 'For registered voters who have moved to a new address in a DIFFERENT constituency and want to update their registration to the new location.', 2, 'Fill Form 8A Online', 'Go to voters.eci.gov.in and select Form 8A (Transposition of entry in electoral roll). Enter your existing EPIC number and your new full address in the new constituency.', ARRAY['Existing EPIC number', 'Proof of new residence (Aadhaar / utility bill / rent agreement / bank passbook)'], 'https://voters.eci.gov.in'),
('FORM_8A', 'Form 8A — Transfer of Voter Registration', 'For registered voters who have moved to a new address in a DIFFERENT constituency and want to update their registration to the new location.', 3, 'Upload Proof of New Address', 'Upload a document proving your new address, such as Aadhaar card with new address, electricity or water bill, rent agreement, or bank passbook.', NULL, 'https://voters.eci.gov.in'),
('FORM_8A', 'Form 8A — Transfer of Voter Registration', 'For registered voters who have moved to a new address in a DIFFERENT constituency and want to update their registration to the new location.', 4, 'Submit and Wait for Approval', 'Submit and note your reference number. After approval, your registration will move to your new constituency. Your old entry will be deleted. Download your updated e-EPIC once approved.', NULL, 'https://voters.eci.gov.in');


-- ============================================================
-- ACCEPTED DOCUMENTS
-- Source: ECI 2024 Lok Sabha election notification
-- ============================================================
INSERT INTO accepted_documents (document_name, issuing_authority, notes, is_primary, display_order, source_url) VALUES

('EPIC — Electoral Photo Identity Card (Voter ID)', 'Election Commission of India', 'The primary voter identity document. Also available as a digital e-EPIC downloadable from voters.eci.gov.in.', TRUE, 1, 'https://voters.eci.gov.in'),
('Aadhaar Card', 'Unique Identification Authority of India (UIDAI)', 'Physical card or digital Aadhaar (m-Aadhaar app) is accepted.', FALSE, 2, 'https://uidai.gov.in'),
('PAN Card', 'Income Tax Department, Government of India', 'Must have your photograph on it.', FALSE, 3, 'https://eci.gov.in'),
('Driving Licence', 'Regional Transport Office (State Government)', 'Must have your photograph on it.', FALSE, 4, 'https://eci.gov.in'),
('Indian Passport', 'Ministry of External Affairs, Government of India', 'Must be valid (not expired).', FALSE, 5, 'https://eci.gov.in'),
('MNREGA Job Card', 'Ministry of Rural Development, Government of India', 'Mahatma Gandhi National Rural Employment Guarantee Act job card with photograph.', FALSE, 6, 'https://eci.gov.in'),
('Pension Document with Photograph', 'Central or State Government', 'Includes pension payment order (PPO) with photo.', FALSE, 7, 'https://eci.gov.in'),
('Service Identity Card with Photograph', 'Central/State Government, PSU, or Public Limited Company', 'Must be issued by employer and carry your photograph.', FALSE, 8, 'https://eci.gov.in'),
('Bank or Post Office Passbook with Photograph', 'Scheduled Bank or India Post', 'Must have your photograph on the passbook.', FALSE, 9, 'https://eci.gov.in'),
('Health Insurance Smart Card', 'Ministry of Labour, Government of India', 'Issued under schemes like ESIC.', FALSE, 10, 'https://eci.gov.in'),
('Smart Card under National Population Register (NPR)', 'Registrar General of India (RGI)', 'Issued under the NPR scheme.', FALSE, 11, 'https://eci.gov.in'),
('Official Identity Card for MPs / MLAs / MLCs', 'Lok Sabha / Rajya Sabha / State Legislature Secretariat', 'Valid only for sitting members of Parliament and State Legislatures.', FALSE, 12, 'https://eci.gov.in'),
('Unique Disability ID (UDID) Card', 'Ministry of Social Justice and Empowerment, Government of India', 'For registered persons with disabilities.', FALSE, 13, 'https://eci.gov.in');


-- ============================================================
-- VOTER RIGHTS
-- ============================================================
INSERT INTO voter_rights (right_title, description, action_to_take, contact, source_url, display_order) VALUES

('Right to a Secret Ballot',
  'Your vote is completely secret. No one — not the polling officer, your employer, or anyone else — can force you to reveal who you voted for. The entire polling process is designed to protect ballot secrecy.',
  'If anyone pressures you to reveal your vote or tries to observe who you voted for, report this immediately.',
  'Voter Helpline: 1950 | cVIGIL App', 'https://eci.gov.in', 1),

('Right to Vote Without Intimidation',
  'You have the right to vote freely without fear, bribery, or intimidation. No one can threaten you, offer you money, or pressure you to vote for a particular candidate.',
  'Report any such incident immediately to election officials, or use the cVIGIL mobile app to file a real-time complaint with photo/video evidence.',
  'cVIGIL App | Voter Helpline: 1950 | Police: 100', 'https://eci.gov.in', 2),

('Right to Vote Even if Name is on the List but EPIC is Lost',
  'If your name is on the electoral roll but you have lost your Voter ID card, you can still vote by presenting any one of the 13 officially accepted photo ID documents.',
  'Carry an alternative accepted photo ID document to the polling booth.',
  'Voter Helpline: 1950', 'https://eci.gov.in', 3),

('Right to a Tendered Vote (if someone has already voted in your name)',
  'If someone has fraudulently voted in your name and you arrive at the booth, you have the right to cast a "Tendered Vote." This is a separate ballot that is kept aside and counted only in cases of disputes.',
  'Inform the Presiding Officer immediately. Request to cast a tendered vote. You will need to fill a declaration.',
  'Inform Presiding Officer at the Polling Booth | Voter Helpline: 1950', 'https://eci.gov.in', 4),

('Right to Accessible Voting for Persons with Disabilities',
  'Polling stations must be wheelchair accessible. Persons with disabilities are entitled to assistance and can bring a companion of their choice to help them vote. PwD voters with 40%+ benchmark disability can also opt for home voting via postal ballot.',
  'Request assistance from the Presiding Officer. For home voting, apply via Form 12D within 5 days of election notification.',
  'Voter Helpline: 1950 | BLO for Form 12D', 'https://eci.gov.in', 5),

('Right of Senior Citizens (85+) to Vote from Home',
  'Voters above 85 years of age can vote via postal ballot from their home under Rule 27A of the Conduct of Elections Rules, 1961. A BLO will visit your home with the application form (Form 12D).',
  'Apply via Form 12D within 5 days of election notification. Contact your BLO or Voter Helpline.',
  'Voter Helpline: 1950 | Your BLO', 'https://eci.gov.in', 6),

('Right to Register a Complaint (cVIGIL)',
  'Any citizen can report election rule violations — such as illegal distribution of cash or gifts, voter intimidation, use of vehicles for voter transport, or MCC violations — using the cVIGIL mobile app. Complaints are geotagged and acted upon within 100 minutes.',
  'Download the cVIGIL app and report with photo or video evidence. Your identity is kept confidential.',
  'cVIGIL App (Android/iOS) | Voter Helpline: 1950', 'https://cvigil.eci.gov.in', 7),

('Right to Information About Your Candidate',
  'Under Form 26, all candidates contesting elections must declare their criminal record (if any), assets, liabilities, and educational qualifications. You have the right to view this information before voting.',
  'View candidate affidavits on the ECI website or the MyNeta portal before voting.',
  'https://myneta.info | https://affidavit.eci.gov.in', 'https://eci.gov.in', 8);
