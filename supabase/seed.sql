-- Representative example/seed data — NOT a claim of completeness.
-- Political facts here (party leadership, election results) were verified
-- against public sources in August 2026; ongoing accuracy is the job of the
-- data-ingestion pipeline (DB spec, data_sources/data_imports), not this file.
-- Every seeded fact that can plausibly change over time carries a source_id
-- and, where the underlying relationship is temporal, real effective_from/
-- effective_to dates — see AGENTS.md Rule 17 and Rule 19.

-- Admin roles ----------------------------------------------------------
insert into admin_roles (id, name, description) values ('6c4b27f0-5bd9-48a4-8aa2-0d6848ee400b', 'SUPER_ADMIN', 'Full access, including granting roles to other users.');
insert into admin_roles (id, name, description) values ('132f5128-cacc-43dc-9469-6edfa99f6719', 'DATA_ADMIN', 'Can create/edit/delete all political data.');
insert into admin_roles (id, name, description) values ('6ab24cca-c53d-45df-8991-69a0e23e54c7', 'DATA_REVIEWER', 'Can review and accept/reject corrections and verify records.');
insert into admin_roles (id, name, description) values ('d3673383-fe6b-4fdd-b642-53a00cf2a5bf', 'EDITOR', 'Can edit existing records but not delete or verify.');
insert into admin_roles (id, name, description) values ('c6799422-6f8c-4b10-89a5-679f552061ab', 'READ_ONLY', 'Read-only access to the admin dashboard.');

-- Sources ---------------------------------------------------------------
insert into sources (id, name, source_type, organization, base_url, authority_rank) values ('e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'Election Commission of India', 'ECI', 'Election Commission of India', 'https://www.eci.gov.in', 1);
insert into sources (id, name, source_type, organization, base_url, authority_rank) values ('64a1ebb1-4b22-4d1a-914c-08b7f57bcd2e', 'Prime Minister''s Office (PM India)', 'CENTRAL_GOVERNMENT', 'Government of India', 'https://www.pmindia.gov.in', 1);
insert into sources (id, name, source_type, organization, base_url, authority_rank) values ('14443d6c-46a4-47d0-8cc1-47a1186dbd27', 'Bharatiya Janata Party — official site', 'POLITICAL_PARTY', 'Bharatiya Janata Party', 'https://www.bjp.org', 3);
insert into sources (id, name, source_type, organization, base_url, authority_rank) values ('933dfb9e-ef14-4a5c-87b9-0c247d79fab7', 'Indian National Congress — official site', 'POLITICAL_PARTY', 'Indian National Congress', 'https://inc.in', 3);

-- Source records (specific pages cited below) ---------------------------
insert into source_records (id, source_id, url, content_type) values ('c4053df4-61b7-47f5-a8e1-9217475d1339', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'https://results.eci.gov.in/PcResultGenJune2024/candidateswise-S127.htm', 'HTML');
insert into source_records (id, source_id, url, content_type) values ('045507c7-d3ac-4e2c-9a22-f44837cfc2d4', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'https://results.eci.gov.in/pc/en/constituencywise/ConstituencywiseS2777.htm', 'HTML');
insert into source_records (id, source_id, url, content_type) values ('a268388c-204d-40a1-bad0-7df34d3cef19', '64a1ebb1-4b22-4d1a-914c-08b7f57bcd2e', 'https://www.pmindia.gov.in/en/pm-council-of-ministers/', 'HTML');
insert into source_records (id, source_id, url, content_type) values ('c7c0b00d-cc7c-43ea-8df6-13019dd459fc', '14443d6c-46a4-47d0-8cc1-47a1186dbd27', 'https://en.wikipedia.org/wiki/List_of_national_presidents_of_the_Bharatiya_Janata_Party', 'HTML');
insert into source_records (id, source_id, url, content_type) values ('280968d4-802b-4760-8e2e-f316b6240efd', '14443d6c-46a4-47d0-8cc1-47a1186dbd27', 'https://www.bjp.org/national-office-bearer', 'HTML');
insert into source_records (id, source_id, url, content_type) values ('8fcadd7d-075a-49dd-97ac-1fe1f28513d6', '933dfb9e-ef14-4a5c-87b9-0c247d79fab7', 'https://inc.in/leadership/shri-mallikarjun-kharge', 'HTML');

-- Political positions taxonomy (reference data, not enum — see AGENTS.md Rule 19)
insert into political_positions (id, title, category, level) values ('38dac622-5398-4278-b39c-c2eefe9f9063', 'Prime Minister', 'Executive', 'Union');
insert into political_positions (id, title, category, level) values ('7fcf3e6a-ef37-41fc-8e77-64cb095e8c59', 'Chief Minister', 'Executive', 'State');
insert into political_positions (id, title, category, level) values ('9cf6c051-eeed-47f3-85fe-fb2215931d04', 'Governor', 'Executive', 'State');
insert into political_positions (id, title, category, level) values ('cffa6b55-c6f7-4fa4-9df8-084dba921eb4', 'Cabinet Minister', 'Executive', 'Union');
insert into political_positions (id, title, category, level) values ('c06095a3-93a7-478b-aefd-40cc88e22b7d', 'Minister of State', 'Executive', 'Union');
insert into political_positions (id, title, category, level) values ('0a6e9d0c-93af-4d7b-b49e-fd5b45718f8e', 'Member of Parliament, Lok Sabha', 'Legislative', 'Union');
insert into political_positions (id, title, category, level) values ('abff3d65-604d-4dce-9734-0260f2e304a4', 'Member of Parliament, Rajya Sabha', 'Legislative', 'Union');
insert into political_positions (id, title, category, level) values ('da533f63-69bf-4df4-bfca-511a0d88733b', 'Member of Legislative Assembly', 'Legislative', 'State');
insert into political_positions (id, title, category, level) values ('0156d625-ae5e-4e29-ac41-f057557df9ae', 'Leader of Opposition, Lok Sabha', 'Legislative', 'Union');
insert into political_positions (id, title, category, level) values ('3a85d83c-691f-479f-994c-185c4270a8cd', 'Leader of Opposition, Rajya Sabha', 'Legislative', 'Union');
-- States (28) ------------------------------------------------------------
insert into states (name, slug, code, capital) values ('Andhra Pradesh', 'andhra-pradesh', 'AP', 'Amaravati');
insert into states (name, slug, code, capital) values ('Arunachal Pradesh', 'arunachal-pradesh', 'AR', 'Itanagar');
insert into states (name, slug, code, capital) values ('Assam', 'assam', 'AS', 'Dispur');
insert into states (name, slug, code, capital) values ('Bihar', 'bihar', 'BR', 'Patna');
insert into states (name, slug, code, capital) values ('Chhattisgarh', 'chhattisgarh', 'CG', 'Raipur');
insert into states (name, slug, code, capital) values ('Goa', 'goa', 'GA', 'Panaji');
insert into states (name, slug, code, capital) values ('Gujarat', 'gujarat', 'GJ', 'Gandhinagar');
insert into states (name, slug, code, capital) values ('Haryana', 'haryana', 'HR', 'Chandigarh');
insert into states (name, slug, code, capital) values ('Himachal Pradesh', 'himachal-pradesh', 'HP', 'Shimla');
insert into states (name, slug, code, capital) values ('Jharkhand', 'jharkhand', 'JH', 'Ranchi');
insert into states (name, slug, code, capital) values ('Karnataka', 'karnataka', 'KA', 'Bengaluru');
insert into states (name, slug, code, capital) values ('Kerala', 'kerala', 'KL', 'Thiruvananthapuram');
insert into states (name, slug, code, capital) values ('Madhya Pradesh', 'madhya-pradesh', 'MP', 'Bhopal');
insert into states (name, slug, code, capital) values ('Maharashtra', 'maharashtra', 'MH', 'Mumbai');
insert into states (name, slug, code, capital) values ('Manipur', 'manipur', 'MN', 'Imphal');
insert into states (name, slug, code, capital) values ('Meghalaya', 'meghalaya', 'ML', 'Shillong');
insert into states (name, slug, code, capital) values ('Mizoram', 'mizoram', 'MZ', 'Aizawl');
insert into states (name, slug, code, capital) values ('Nagaland', 'nagaland', 'NL', 'Kohima');
insert into states (name, slug, code, capital) values ('Odisha', 'odisha', 'OD', 'Bhubaneswar');
insert into states (name, slug, code, capital) values ('Punjab', 'punjab', 'PB', 'Chandigarh');
insert into states (name, slug, code, capital) values ('Rajasthan', 'rajasthan', 'RJ', 'Jaipur');
insert into states (name, slug, code, capital) values ('Sikkim', 'sikkim', 'SK', 'Gangtok');
insert into states (name, slug, code, capital) values ('Tamil Nadu', 'tamil-nadu', 'TN', 'Chennai');
insert into states (name, slug, code, capital) values ('Telangana', 'telangana', 'TG', 'Hyderabad');
insert into states (name, slug, code, capital) values ('Tripura', 'tripura', 'TR', 'Agartala');
insert into states (id, name, slug, code, capital) values ('7a0d0914-9a3e-43dd-bc75-e8888766e174', 'Uttar Pradesh', 'uttar-pradesh', 'UP', 'Lucknow');
insert into states (name, slug, code, capital) values ('Uttarakhand', 'uttarakhand', 'UK', 'Dehradun');
insert into states (name, slug, code, capital) values ('West Bengal', 'west-bengal', 'WB', 'Kolkata');

-- Union Territories (8) ----------------------------------------------------
insert into union_territories (name, slug, code, capital, has_legislature) values ('Andaman and Nicobar Islands', 'andaman-and-nicobar-islands', 'AN', 'Port Blair', false);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Chandigarh', 'chandigarh-ut', 'CH', 'Chandigarh', false);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Dadra and Nagar Haveli and Daman and Diu', 'dadra-and-nagar-haveli-and-daman-and-diu', 'DN', 'Daman', false);
insert into union_territories (id, name, slug, code, capital, has_legislature) values ('af0f5a6e-26d2-4082-a1d0-9a7fb0188692', 'Delhi', 'delhi', 'DL', 'New Delhi', true);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Jammu and Kashmir', 'jammu-and-kashmir', 'JK', 'Srinagar', true);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Ladakh', 'ladakh', 'LA', 'Leh', false);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Lakshadweep', 'lakshadweep', 'LD', 'Kavaratti', false);
insert into union_territories (name, slug, code, capital, has_legislature) values ('Puducherry', 'puducherry', 'PY', 'Puducherry', true);

-- District & constituency (Varanasi, to match the approved design reference)
insert into districts (id, name, state_id, headquarters) values ('edf15d2d-816a-4cd7-9dbf-681b7d3c93ed', 'Varanasi', '7a0d0914-9a3e-43dd-bc75-e8888766e174', 'Varanasi');
insert into constituencies (id, name, slug, constituency_type, number, state_id, district_id, reserved_category, total_electors, status) values ('0106f743-249c-4a13-9d5e-3b6ee0d8fda3', 'Varanasi', 'varanasi', 'LOK_SABHA', 77, '7a0d0914-9a3e-43dd-bc75-e8888766e174', 'edf15d2d-816a-4cd7-9dbf-681b7d3c93ed', 'GENERAL', 1997578, 'ACTIVE');

-- Houses & terms -----------------------------------------------------------
insert into houses (id, name, house_type, total_seats, is_permanent) values ('4b076319-9bee-4d39-8800-b580ee1a2e4d', '18th Lok Sabha', 'LOK_SABHA', 543, false);
insert into houses (id, name, house_type, total_seats, is_permanent) values ('2170c4c5-e7c1-4033-98ab-a71a52136892', 'Rajya Sabha', 'RAJYA_SABHA', 245, true);
insert into parliamentary_terms (id, house_id, term_number, start_date, end_date) values ('585ca0bb-5e9a-49dc-b8ec-3df9f82f64a4', '4b076319-9bee-4d39-8800-b580ee1a2e4d', 17, '2019-06-17', '2024-06-16');
insert into parliamentary_terms (id, house_id, term_number, start_date, end_date) values ('cbc8328a-50d8-43c6-b447-9e995d17de6b', '4b076319-9bee-4d39-8800-b580ee1a2e4d', 18, '2024-06-24', null);
-- Political parties ---------------------------------------------------------
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('1d2e516b-2368-4fd2-8074-849ea2fa710f', 'Bharatiya Janata Party', 'BJP', 'bjp', '1980-04-06', 'https://www.bjp.org');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('fd937b75-e92b-4735-a9c4-3baaa2d6cf9e', 'Indian National Congress', 'INC', 'indian-national-congress', '1885-12-28', 'https://inc.in');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('4042f4b1-cf1a-4de4-be78-b99b2e6fbe2a', 'Communist Party of India (Marxist)', 'CPI(M)', 'cpim', '1964-11-07', 'https://cpim.org');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('ccd5103b-51ce-4583-8755-935f94932a77', 'Aam Aadmi Party', 'AAP', 'aam-aadmi-party', '2012-11-26', 'https://aamaadmiparty.org');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('39d4ace2-3f55-42b3-b3a9-29b850e7c51e', 'All India Trinamool Congress', 'AITC', 'all-india-trinamool-congress', '1998-01-01', 'https://aitcofficial.org');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('193c3af5-30f4-4759-8b03-1361b074993f', 'Dravida Munnetra Kazhagam', 'DMK', 'dmk', '1949-09-17', 'https://dmk.in');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('a4b6446e-372a-4bd0-bbb3-5c545fa1d654', 'Bahujan Samaj Party', 'BSP', 'bahujan-samaj-party', '1984-04-14', 'https://bsp4india.org');
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('b6e6a6d8-3f8f-443a-9ba1-9035e28e0d50', 'Independent', 'IND', 'independent', null, null);
insert into political_parties (id, name, abbreviation, slug, founded_date, website) values ('93e72213-618a-43e2-9953-0e449f4bfd81', 'Samajwadi Party', 'SP', 'samajwadi-party', '1992-10-04', 'https://samajwadiparty.in');

-- Party recognition. Effective_from uses each party's founding date as a
-- reasonable starting point where an exact ECI recognition-order date isn't
-- yet sourced here. Categorization (national vs. state-recognized) follows
-- the approved design reference's own grouping.
insert into party_recognition_history (party_id, recognition_type, effective_from) values ('1d2e516b-2368-4fd2-8074-849ea2fa710f', 'NATIONAL', '1980-04-06');
insert into party_recognition_history (party_id, recognition_type, effective_from) values ('fd937b75-e92b-4735-a9c4-3baaa2d6cf9e', 'NATIONAL', '1885-12-28');
insert into party_recognition_history (party_id, recognition_type, effective_from) values ('4042f4b1-cf1a-4de4-be78-b99b2e6fbe2a', 'NATIONAL', '1964-11-07');
insert into party_recognition_history (party_id, recognition_type, union_territory_id, effective_from) select 'ccd5103b-51ce-4583-8755-935f94932a77', 'STATE', id, '2012-11-26' from union_territories where slug = 'delhi';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select 'ccd5103b-51ce-4583-8755-935f94932a77', 'STATE', id, '2012-11-26' from states where slug = 'punjab';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select 'ccd5103b-51ce-4583-8755-935f94932a77', 'STATE', id, '2012-11-26' from states where slug = 'goa';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select '39d4ace2-3f55-42b3-b3a9-29b850e7c51e', 'STATE', id, '1998-01-01' from states where slug = 'west-bengal';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select '39d4ace2-3f55-42b3-b3a9-29b850e7c51e', 'STATE', id, '1998-01-01' from states where slug = 'tripura';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select '193c3af5-30f4-4759-8b03-1361b074993f', 'STATE', id, '1949-09-17' from states where slug = 'tamil-nadu';
insert into party_recognition_history (party_id, recognition_type, union_territory_id, effective_from) select '193c3af5-30f4-4759-8b03-1361b074993f', 'STATE', id, '1949-09-17' from union_territories where slug = 'puducherry';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select 'a4b6446e-372a-4bd0-bbb3-5c545fa1d654', 'STATE', id, '1984-04-14' from states where slug = 'uttar-pradesh';
insert into party_recognition_history (party_id, recognition_type, state_id, effective_from) select '93e72213-618a-43e2-9953-0e449f4bfd81', 'STATE', id, '1992-10-04' from states where slug = 'uttar-pradesh';

-- Persons & politicians --------------------------------------------------------
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('c94614f7-15fa-4bfb-9478-3a5ec7795bef', 'Narendra Modi', 'narendra-modi', '1950-09-17', 'MALE', 'Vadnagar, Bombay State (now Gujarat)');
insert into politicians (id, person_id, status, first_elected_year) values ('b59ec4d0-ba6f-42a3-8a03-4740b12a054d', 'c94614f7-15fa-4bfb-9478-3a5ec7795bef', 'ACTIVE', 2001);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('89cf440a-43a8-4c83-9433-118ebd3e886a', 'Mallikarjun Kharge', 'mallikarjun-kharge', '1942-07-21', 'MALE', 'Warwatti, Hyderabad State');
insert into politicians (id, person_id, status, first_elected_year) values ('7b343944-ca8c-4f81-a186-b8ec24382832', '89cf440a-43a8-4c83-9433-118ebd3e886a', 'ACTIVE', 1972);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('b3a9b03f-139e-4b48-b7e0-7926054be425', 'Nitin Nabin', 'nitin-nabin', null, 'MALE', null);
insert into politicians (id, person_id, status, first_elected_year) values ('a4a8334b-d0e1-4801-a11c-3c40d8739130', 'b3a9b03f-139e-4b48-b7e0-7926054be425', 'ACTIVE', null);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('3ecdb54c-7426-4bab-8199-b115d77b81a5', 'Jagat Prakash Nadda', 'jagat-prakash-nadda', '1960-12-02', 'MALE', 'Patna, Bihar');
insert into politicians (id, person_id, status, first_elected_year) values ('feea8c09-07fa-424e-a42a-c166fbc23c45', '3ecdb54c-7426-4bab-8199-b115d77b81a5', 'ACTIVE', null);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('4a7c4546-ba9a-44d6-88fd-c9c4ecdc6909', 'Ajay Rai', 'ajay-rai', null, 'MALE', 'Varanasi, Uttar Pradesh');
insert into politicians (id, person_id, status, first_elected_year) values ('f84fe016-6c6e-40b1-8d24-b3ec2bb17bbf', '4a7c4546-ba9a-44d6-88fd-c9c4ecdc6909', 'ACTIVE', null);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('a97db4a1-b06e-4a2b-9db4-1e97819d498b', 'Athar Jamal Lari', 'athar-jamal-lari', null, 'MALE', null);
insert into politicians (id, person_id, status, first_elected_year) values ('5ced4191-d3d9-4c85-93e1-c58595694fc0', 'a97db4a1-b06e-4a2b-9db4-1e97819d498b', 'ACTIVE', null);
insert into persons (id, full_name, slug, date_of_birth, gender, place_of_birth) values ('c6e5a5c7-f213-4ffc-bd59-f76494fff269', 'Shalini Yadav', 'shalini-yadav', null, 'FEMALE', null);
insert into politicians (id, person_id, status, first_elected_year) values ('20bce688-d360-4fbb-97d9-62a73c3399f4', 'c6e5a5c7-f213-4ffc-bd59-f76494fff269', 'ACTIVE', null);
-- Party memberships — demonstrates the temporal model end-to-end: Nadda's
-- presidency is closed out with effective_to, Nabin's is the open-ended
-- current row. Nothing here overwrites the Nadda row (AGENTS.md Rule 17).
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('b59ec4d0-ba6f-42a3-8a03-4740b12a054d', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'MEMBER', null, '2001-10-07', null, true, null, 'UNVERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('feea8c09-07fa-424e-a42a-c166fbc23c45', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'OFFICE_BEARER', 'President', '2020-01-20', '2026-01-20', false, '14443d6c-46a4-47d0-8cc1-47a1186dbd27', 'VERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('a4a8334b-d0e1-4801-a11c-3c40d8739130', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'OFFICE_BEARER', 'President', '2026-01-20', null, true, '14443d6c-46a4-47d0-8cc1-47a1186dbd27', 'VERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('7b343944-ca8c-4f81-a186-b8ec24382832', 'fd937b75-e92b-4735-a9c4-3baaa2d6cf9e', 'OFFICE_BEARER', 'President', '2022-10-26', null, true, '933dfb9e-ef14-4a5c-87b9-0c247d79fab7', 'VERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('f84fe016-6c6e-40b1-8d24-b3ec2bb17bbf', 'fd937b75-e92b-4735-a9c4-3baaa2d6cf9e', 'MEMBER', null, '2014-01-01', null, true, null, 'UNVERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('5ced4191-d3d9-4c85-93e1-c58595694fc0', 'a4b6446e-372a-4bd0-bbb3-5c545fa1d654', 'MEMBER', null, '2014-01-01', null, true, null, 'UNVERIFIED');
insert into party_memberships (politician_id, party_id, membership_type, office_title, effective_from, effective_to, is_current, source_id, verification_status) values ('20bce688-d360-4fbb-97d9-62a73c3399f4', '93e72213-618a-43e2-9953-0e449f4bfd81', 'MEMBER', null, '2019-01-01', null, true, null, 'UNVERIFIED');

-- Modi's current position (Prime Minister, 3rd term). Pre-2024 history is
-- intentionally left for the data pipeline to backfill with sourced dates —
-- see AGENTS.md 'Simplicity First'.
insert into politician_positions (politician_id, position_id, effective_from, source_id, verification_status) values ('b59ec4d0-ba6f-42a3-8a03-4740b12a054d', '38dac622-5398-4278-b39c-c2eefe9f9063', '2024-06-09', '64a1ebb1-4b22-4d1a-914c-08b7f57bcd2e', 'VERIFIED');
insert into politician_positions (politician_id, position_id, effective_from, source_id, verification_status) values ('7b343944-ca8c-4f81-a186-b8ec24382832', '3a85d83c-691f-479f-994c-185c4270a8cd', '2021-02-16', '933dfb9e-ef14-4a5c-87b9-0c247d79fab7', 'VERIFIED');

-- House memberships: Modi as sitting Varanasi MP, 18th Lok Sabha
insert into politician_house_memberships (politician_id, house_id, term_id, constituency_id, party_id, state_id, membership_type, start_date, source_id, verification_status) values ('b59ec4d0-ba6f-42a3-8a03-4740b12a054d', '4b076319-9bee-4d39-8800-b580ee1a2e4d', 'cbc8328a-50d8-43c6-b447-9e995d17de6b', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', '1d2e516b-2368-4fd2-8074-849ea2fa710f', '7a0d0914-9a3e-43dd-bc75-e8888766e174', 'ELECTED', '2024-06-04', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');

-- Union Government (18th Lok Sabha administration)
insert into governments (id, level, term_number, status, formed_date) values ('0e95474c-ddd0-429d-926d-e90202543ff9', 'UNION', 18, 'CURRENT', '2024-06-09');
insert into government_parties (government_id, party_id, role, effective_from) values ('0e95474c-ddd0-429d-926d-e90202543ff9', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'LEAD_PARTY', '2024-06-09');
-- Elections ----------------------------------------------------------------
insert into elections (id, name, slug, election_type, house_id, term_id, start_date, end_date, status, total_seats, phases, voter_turnout_percent, source_id) values ('e7409af5-2751-46f8-9d64-0613ef99a495', '2024 Indian General Election', '2024-lok-sabha', 'LOK_SABHA', '4b076319-9bee-4d39-8800-b580ee1a2e4d', 'cbc8328a-50d8-43c6-b447-9e995d17de6b', '2024-04-19', '2024-06-01', 'COMPLETED', 543, 7, 65.79, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');
insert into elections (id, name, slug, election_type, house_id, term_id, start_date, end_date, status, total_seats, phases, voter_turnout_percent, source_id) values ('cb22387f-e648-4536-ac17-2017d2421ccd', '2019 Indian General Election', '2019-lok-sabha', 'LOK_SABHA', '4b076319-9bee-4d39-8800-b580ee1a2e4d', '585ca0bb-5e9a-49dc-b8ec-3df9f82f64a4', '2019-04-11', '2019-05-19', 'COMPLETED', 543, 7, 67.4, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');

-- Varanasi 2024 candidates & results (verified: PM bags 6,12,970 votes, margin
-- ~1.52 lakh — ETV Bharat / Deccan Herald, June 2024)
insert into election_candidates (id, election_id, constituency_id, politician_id, party_id, candidate_name, nomination_status, result_status, source_id, verification_status) values ('a51e8b29-1013-4511-abbf-4eb18f8695a8', 'e7409af5-2751-46f8-9d64-0613ef99a495', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', 'b59ec4d0-ba6f-42a3-8a03-4740b12a054d', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'Narendra Modi', 'CONTESTED', 'ELECTED', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');
insert into election_results (election_candidate_id, votes_received, vote_share_percent, rank, margin, is_winner, source_id) values ('a51e8b29-1013-4511-abbf-4eb18f8695a8', 612970, 54.32, 1, 152513, true, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');
insert into election_candidates (id, election_id, constituency_id, politician_id, party_id, candidate_name, nomination_status, result_status, source_id, verification_status) values ('366b6473-bc33-4fdb-bdc2-e90b03d1bd06', 'e7409af5-2751-46f8-9d64-0613ef99a495', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', 'f84fe016-6c6e-40b1-8d24-b3ec2bb17bbf', 'fd937b75-e92b-4735-a9c4-3baaa2d6cf9e', 'Ajay Rai', 'CONTESTED', 'RUNNER_UP', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');
insert into election_results (election_candidate_id, votes_received, vote_share_percent, rank, margin, is_winner, source_id) values ('366b6473-bc33-4fdb-bdc2-e90b03d1bd06', 460457, 40.8, 2, null, false, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');
insert into election_candidates (id, election_id, constituency_id, politician_id, party_id, candidate_name, nomination_status, result_status, source_id, verification_status) values ('faf28871-bb20-4061-a040-c07f67c0a47e', 'e7409af5-2751-46f8-9d64-0613ef99a495', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', '5ced4191-d3d9-4c85-93e1-c58595694fc0', 'a4b6446e-372a-4bd0-bbb3-5c545fa1d654', 'Athar Jamal Lari', 'CONTESTED', 'LOST', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');
insert into election_results (election_candidate_id, votes_received, vote_share_percent, rank, margin, is_winner, source_id) values ('faf28871-bb20-4061-a040-c07f67c0a47e', 33766, 2.99, 3, null, false, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');

-- Varanasi 2019 candidates & results (verified: PM 6,74,664 votes / 63.62%,
-- runner-up Shalini Yadav (SP) ~1,95,159 votes / 18.4% — margin 4,79,505)
insert into election_candidates (id, election_id, constituency_id, politician_id, party_id, candidate_name, nomination_status, result_status, source_id, verification_status) values ('f83c8665-1f45-413a-9524-9eb7e51ea928', 'cb22387f-e648-4536-ac17-2017d2421ccd', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', 'b59ec4d0-ba6f-42a3-8a03-4740b12a054d', '1d2e516b-2368-4fd2-8074-849ea2fa710f', 'Narendra Modi', 'CONTESTED', 'ELECTED', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');
insert into election_results (election_candidate_id, votes_received, vote_share_percent, rank, margin, is_winner, source_id) values ('f83c8665-1f45-413a-9524-9eb7e51ea928', 674664, 63.62, 1, 479505, true, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');
insert into election_candidates (id, election_id, constituency_id, politician_id, party_id, candidate_name, nomination_status, result_status, source_id, verification_status) values ('945e2676-04c9-41d2-852b-7e764e16b309', 'cb22387f-e648-4536-ac17-2017d2421ccd', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', '20bce688-d360-4fbb-97d9-62a73c3399f4', '93e72213-618a-43e2-9953-0e449f4bfd81', 'Shalini Yadav', 'CONTESTED', 'RUNNER_UP', 'e5d98dc1-fa28-4e7e-9629-2195efc8de81', 'VERIFIED');
insert into election_results (election_candidate_id, votes_received, vote_share_percent, rank, margin, is_winner, source_id) values ('945e2676-04c9-41d2-852b-7e764e16b309', 195159, 18.4, 2, null, false, 'e5d98dc1-fa28-4e7e-9629-2195efc8de81');

-- entity_sources: representative examples linking a canonical fact to its
-- source record (the pattern every admin-entered fact should follow)
insert into entity_sources (entity_type, entity_id, source_record_id, relationship, field_name) values ('POLITICIAN', 'b59ec4d0-ba6f-42a3-8a03-4740b12a054d', 'a268388c-204d-40a1-bad0-7df34d3cef19', 'PRIMARY_SOURCE', 'current_position');
insert into entity_sources (entity_type, entity_id, source_record_id, relationship, field_name) values ('CONSTITUENCY', '0106f743-249c-4a13-9d5e-3b6ee0d8fda3', 'c4053df4-61b7-47f5-a8e1-9217475d1339', 'PRIMARY_SOURCE', 'election_results_2024');
