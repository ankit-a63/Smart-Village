const bcrypt = require('bcryptjs');

async function seedDatabase(query) {
  try {
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Areas
    const areas = [
      { name_en: 'Main Bazaar', name_hi: 'मुख्य बाजार', code: 'MB-01', population: 3500, supervisor_name: 'Ramesh Kumar' },
      { name_en: 'Panchayat Area', name_hi: 'पंचायत क्षेत्र', code: 'PA-02', population: 2800, supervisor_name: 'Sunita Devi' },
      { name_en: 'School Area', name_hi: 'स्कूल क्षेत्र', code: 'SA-03', population: 2100, supervisor_name: 'Manoj Verma' },
      { name_en: 'North Village', name_hi: 'उत्तरी गांव', code: 'NV-04', population: 3100, supervisor_name: 'Rajesh Patel' },
      { name_en: 'South Village', name_hi: 'दक्षिणी गांव', code: 'SV-05', population: 2900, supervisor_name: 'Anita Singh' },
      { name_en: 'East Village', name_hi: 'पूर्वी गांव', code: 'EV-06', population: 2400, supervisor_name: 'Vikram Sharma' },
      { name_en: 'West Village', name_hi: 'पश्चिमी गांव', code: 'WV-07', population: 2600, supervisor_name: 'Dinesh Yadav' }
    ];

    for (const a of areas) {
      await query(
        `INSERT INTO areas (name_en, name_hi, code, population, supervisor_name) VALUES (?, ?, ?, ?, ?)`,
        [a.name_en, a.name_hi, a.code, a.population, a.supervisor_name]
      );
    }

    // 2. Departments
    const departments = [
      { name_en: 'Roads & Infrastructure', name_hi: 'सड़क एवं बुनियादी ढांचा', code: 'DEP-ROAD', head_name: 'Er. Suresh Chandra', contact_number: '+91 98765 11111', email: 'roads@smartvillage.gov.in' },
      { name_en: 'Water Supply & Sewage', name_hi: 'जल आपूर्ति एवं सीवरेज', code: 'DEP-WATER', head_name: 'Er. Meena Kumari', contact_number: '+91 98765 22222', email: 'water@smartvillage.gov.in' },
      { name_en: 'Electricity & Power', name_hi: 'विद्युत एवं ऊर्जा', code: 'DEP-ELEC', head_name: 'Er. Anil Gupta', contact_number: '+91 98765 33333', email: 'power@smartvillage.gov.in' },
      { name_en: 'Sanitation & Hygiene', name_hi: 'स्वच्छता एवं सफाई', code: 'DEP-SANI', head_name: 'Dr. Priya Roy', contact_number: '+91 98765 44444', email: 'sanitation@smartvillage.gov.in' },
      { name_en: 'Public Works & Buildings', name_hi: 'लोक निर्माण एवं भवन', code: 'DEP-BLDG', head_name: 'Er. K.L. Sharma', contact_number: '+91 98765 55555', email: 'pwd@smartvillage.gov.in' }
    ];

    for (const d of departments) {
      await query(
        `INSERT INTO departments (name_en, name_hi, code, head_name, contact_number, email) VALUES (?, ?, ?, ?, ?, ?)`,
        [d.name_en, d.name_hi, d.code, d.head_name, d.contact_number, d.email]
      );
    }

    // 3. Complaint Categories
    const categories = [
      { name_en: 'Road Problems', name_hi: 'सड़क समस्याएं', icon: 'Truck', department_id: 1, sla_hours: 48 },
      { name_en: 'Water Supply', name_hi: 'जल आपूर्ति', icon: 'Droplets', department_id: 2, sla_hours: 24 },
      { name_en: 'Electricity Issue', name_hi: 'बिजली की समस्या', icon: 'Zap', department_id: 3, sla_hours: 12 },
      { name_en: 'Street Light', name_hi: 'स्ट्रीट लाइट', icon: 'Sun', department_id: 3, sla_hours: 24 },
      { name_en: 'Sanitation & Garbage', name_hi: 'स्वच्छता और कचरा', icon: 'Trash2', department_id: 4, sla_hours: 24 },
      { name_en: 'Drainage Overflow', name_hi: 'जल निकासी / नाली', icon: 'Filter', department_id: 4, sla_hours: 36 },
      { name_en: 'Public Building', name_hi: 'सार्वजनिक भवन', icon: 'Building2', department_id: 5, sla_hours: 72 },
      { name_en: 'Other Village Issues', name_hi: 'अन्य ग्रामीण समस्याएं', icon: 'HelpCircle', department_id: 5, sla_hours: 48 }
    ];

    for (const c of categories) {
      await query(
        `INSERT INTO complaint_categories (name_en, name_hi, icon, department_id, sla_hours) VALUES (?, ?, ?, ?, ?)`,
        [c.name_en, c.name_hi, c.icon, c.department_id, c.sla_hours]
      );
    }

    // 4. Resource Types
    const resourceTypes = [
      { name_en: 'Hand Pump', name_hi: 'हैंडपंप', icon: 'Droplets' },
      { name_en: 'Street Light', name_hi: 'स्ट्रीट लाइट', icon: 'Sun' },
      { name_en: 'School', name_hi: 'विद्यालय', icon: 'GraduationCap' },
      { name_en: 'Health Centre', name_hi: 'स्वास्थ्य केंद्र', icon: 'HeartPulse' },
      { name_en: 'Water Tank', name_hi: 'पानी की टंकी', icon: 'Container' },
      { name_en: 'Public Toilet', name_hi: 'सार्वजनिक शौचालय', icon: 'Bath' },
      { name_en: 'Community Centre', name_hi: 'सामुदायिक भवन', icon: 'Home' }
    ];

    for (const rt of resourceTypes) {
      await query(
        `INSERT INTO resource_types (name_en, name_hi, icon) VALUES (?, ?, ?)`,
        [rt.name_en, rt.name_hi, rt.icon]
      );
    }

    // 5. Admin & Worker Users
    await query(
      `INSERT INTO users (name, email, phone, password, role, area_id) VALUES (?, ?, ?, ?, ?, ?)`,
      ['Gram Panchayat Admin', 'admin@smartvillage.gov.in', '9800000001', defaultPassword, 'admin', 2]
    );

    const workers = [
      { name: 'Suresh Kumar (Road Specialist)', email: 'worker.road@smartvillage.gov.in', phone: '9800000002', area_id: 1, department_id: 1 },
      { name: 'Ravi Teja (Water Technician)', email: 'worker.water@smartvillage.gov.in', phone: '9800000003', area_id: 2, department_id: 2 },
      { name: 'Amit Verma (Lineman)', email: 'worker.elec@smartvillage.gov.in', phone: '9800000004', area_id: 3, department_id: 3 },
      { name: 'Sanjay Yadav (Sanitation Lead)', email: 'worker.sani@smartvillage.gov.in', phone: '9800000005', area_id: 4, department_id: 4 },
      { name: 'Vikash Singh (PWD Supervisor)', email: 'worker.bldg@smartvillage.gov.in', phone: '9800000006', area_id: 5, department_id: 5 }
    ];

    for (const w of workers) {
      await query(
        `INSERT INTO users (name, email, phone, password, role, area_id, department_id) VALUES (?, ?, ?, ?, 'worker', ?, ?)`,
        [w.name, w.email, w.phone, defaultPassword, w.area_id, w.department_id]
      );
    }

    // 15 Citizens
    const citizens = [
      { name: 'Ramesh Patel', email: 'citizen@smartvillage.gov.in', phone: '9876543210', area_id: 1 },
      { name: 'Sunita Devi', email: 'sunita.citizen@gmail.com', phone: '9876543211', area_id: 2 },
      { name: 'Mahesh Sharma', email: 'mahesh.citizen@gmail.com', phone: '9876543212', area_id: 3 },
      { name: 'Pooja Rani', email: 'pooja.citizen@gmail.com', phone: '9876543213', area_id: 4 },
      { name: 'Anil Gupta', email: 'anil.citizen@gmail.com', phone: '9876543214', area_id: 5 },
      { name: 'Kavita Singh', email: 'kavita.citizen@gmail.com', phone: '9876543215', area_id: 6 },
      { name: 'Deepak Verma', email: 'deepak.citizen@gmail.com', phone: '9876543216', area_id: 7 },
      { name: 'Geeta Kumari', email: 'geeta.citizen@gmail.com', phone: '9876543217', area_id: 1 },
      { name: 'Rajendra Prasad', email: 'rajendra.citizen@gmail.com', phone: '9876543218', area_id: 2 },
      { name: 'Meenakshi Yadav', email: 'meenakshi.citizen@gmail.com', phone: '9876543219', area_id: 3 },
      { name: 'Sanjay Mishra', email: 'sanjay.citizen@gmail.com', phone: '9876543220', area_id: 4 },
      { name: 'Pinky Saini', email: 'pinky.citizen@gmail.com', phone: '9876543221', area_id: 5 },
      { name: 'Harish Roy', email: 'harish.citizen@gmail.com', phone: '9876543222', area_id: 6 },
      { name: 'Savita Devi', email: 'savita.citizen@gmail.com', phone: '9876543223', area_id: 7 },
      { name: 'Santosh Kumar', email: 'santosh.citizen@gmail.com', phone: '9876543224', area_id: 1 }
    ];

    for (const c of citizens) {
      await query(
        `INSERT INTO users (name, email, phone, password, role, area_id) VALUES (?, ?, ?, ?, 'citizen', ?)`,
        [c.name, c.email, c.phone, defaultPassword, c.area_id]
      );
    }

    // 30 Realistic Complaints
    const mockComplaints = [
      { title: 'Broken Pothole near Main Market Entry', cat: 1, area: 1, prio: 'high', status: 'in_progress', dept: 1, worker: 2, desc: 'Large pothole causing severe traffic slowdown and motorcycle slips near the main bazaar gate.', addr: 'Main Market Gate No. 2, Ward 4', lat: 26.8467, lng: 80.9462 },
      { title: 'Water Pipe Leakage near Primary School', cat: 2, area: 3, prio: 'critical', status: 'assigned', dept: 2, worker: 3, desc: 'Clean drinking water pipe burst on main road, wasting hundreds of liters daily.', addr: 'Govt Primary School Road, Ward 2', lat: 26.8480, lng: 80.9480 },
      { title: 'Low Voltage and Transformer Sparking', cat: 3, area: 2, prio: 'high', status: 'submitted', dept: 3, worker: null, desc: 'Frequent voltage drops and sparking observed at Panchayat Bhawan transformer.', addr: 'Panchayat Bhawan Premises', lat: 26.8450, lng: 80.9450 },
      { title: '5 Street Lights Not Working in North Lane', cat: 4, area: 4, prio: 'medium', status: 'resolved', dept: 3, worker: 4, desc: 'North village main lane is in pitch darkness after sunset due to burnt out solar lights.', addr: 'North Village Lane 3', lat: 26.8500, lng: 80.9410 },
      { title: 'Garbage Dump Overflow near Health Centre', cat: 5, area: 5, prio: 'high', status: 'in_progress', dept: 4, worker: 5, desc: 'Uncollected domestic waste creating health risk near primary health clinic entrance.', addr: 'Health Centre Outer Wall, South Village', lat: 26.8420, lng: 80.9490 },
      { title: 'Blocked Drainage causing Waterlogging', cat: 6, area: 6, prio: 'critical', status: 'under_review', dept: 4, worker: null, desc: 'Heavy silt accumulated in open drain, monsoon overflow entering nearby houses.', addr: 'East Village Main Drain', lat: 26.8475, lng: 80.9520 },
      { title: 'Community Hall Roof Leakage', cat: 7, area: 2, prio: 'medium', status: 'submitted', dept: 5, worker: null, desc: 'Plaster falling from roof inner ceiling during rains at Community Centre.', addr: 'Panchayat Community Hall', lat: 26.8455, lng: 80.9455 },
      { title: 'Broken Hand Pump Handle', cat: 2, area: 7, prio: 'medium', status: 'closed', dept: 2, worker: 3, desc: 'Iron handle broken on public handpump near West Village bus stop.', addr: 'West Village Bus Stand', lat: 26.8410, lng: 80.9400 },
      { title: 'Fallen Electric Pole after Storm', cat: 3, area: 1, prio: 'critical', status: 'resolved', dept: 3, worker: 4, desc: 'Power cable leaning dangerously across road after storm last night.', addr: 'Bazaar Cross Road', lat: 26.8460, lng: 80.9465 },
      { title: 'Public Toilet Cleaning Required', cat: 5, area: 1, prio: 'high', status: 'assigned', dept: 4, worker: 5, desc: 'Sanitation worker absent for 3 days; public toilet facility needs deep cleaning.', addr: 'Bazaar Public Complex', lat: 26.8468, lng: 80.9461 },
      // 20 more complaints for realistic stats
      { title: 'Solar Panel Failure on Street Light Pole #12', cat: 4, area: 3, prio: 'low', status: 'resolved', dept: 3, worker: 4, desc: 'Battery backup failing after 2 hours of night operation.', addr: 'School Compound Lane', lat: 26.8485, lng: 80.9482 },
      { title: 'Dirty Water in Pipeline Supply', cat: 2, area: 4, prio: 'critical', status: 'in_progress', dept: 2, worker: 3, desc: 'Muddy water coming in tap connection for last 2 days.', addr: 'North Village Block B', lat: 26.8510, lng: 80.9420 },
      { title: 'Road Repair Required Near Milk Booth', cat: 1, area: 5, prio: 'medium', status: 'submitted', dept: 1, worker: null, desc: 'Gravel washed away during recent heavy rainfall.', addr: 'South Village Milk Booth', lat: 26.8425, lng: 80.9485 },
      { title: 'Damaged Drainage Cover Plate', cat: 6, area: 7, prio: 'high', status: 'assigned', dept: 4, worker: 5, desc: 'Concrete slab cover cracked, open hazard for cattle and pedestrians.', addr: 'West Village Main Road', lat: 26.8405, lng: 80.9395 },
      { title: 'Health Centre Gate Hinge Broken', cat: 7, area: 5, prio: 'low', status: 'resolved', dept: 5, worker: 6, desc: 'Main iron gate off hinges, safety risk at night.', addr: 'Primary Health Centre', lat: 26.8418, lng: 80.9492 },
      { title: 'Dead Stray Animal Removal', cat: 5, area: 6, prio: 'critical', status: 'closed', dept: 4, worker: 5, desc: 'Urgent removal required near East Village pond.', addr: 'East Village Pond Side', lat: 26.8470, lng: 80.9525 },
      { title: 'Street Light Sensor Malfunction', cat: 4, area: 2, prio: 'low', status: 'submitted', dept: 3, worker: null, desc: 'Lights remain ON during daylight hours wasting power.', addr: 'Panchayat Office Street', lat: 26.8452, lng: 80.9452 },
      { title: 'Water Tank Leakage at Overhead Reservoir', cat: 2, area: 2, prio: 'high', status: 'in_progress', dept: 2, worker: 3, desc: 'Seepage from main 50,000L tank base foundation.', addr: 'Central Overhead Tank Site', lat: 26.8448, lng: 80.9458 },
      { title: 'Culvert Repair near Farm Road', cat: 1, area: 4, prio: 'medium', status: 'under_review', dept: 1, worker: null, desc: 'Small bridge culvert showing structural cracks.', addr: 'North Farm Access Road', lat: 26.8520, lng: 80.9430 },
      { title: 'Weed Growth blocking Drainage Channel', cat: 6, area: 3, prio: 'low', status: 'resolved', dept: 4, worker: 5, desc: 'Wild bushes blocking water flow in canal drain.', addr: 'School Canal Side', lat: 26.8488, lng: 80.9488 },
      { title: 'Broken Bench at Anganwadi Centre', cat: 8, area: 7, prio: 'low', status: 'submitted', dept: 5, worker: null, desc: 'Sitting bench broken inside Anganwadi courtyard.', addr: 'Anganwadi Centre No. 1', lat: 26.8402, lng: 80.9390 },
      { title: 'Handpump Contaminated Water Smell', cat: 2, area: 6, prio: 'high', status: 'assigned', dept: 2, worker: 3, desc: 'Iron smell and red color in hand pump water.', addr: 'East Village Community Well', lat: 26.8478, lng: 80.9518 },
      { title: 'Electric Wire Touching Tree Branches', cat: 3, area: 1, prio: 'high', status: 'in_progress', dept: 3, worker: 4, desc: 'Tree branch trimming needed along 11kV line.', addr: 'Bazaar Park Boundary', lat: 26.8463, lng: 80.9468 },
      { title: 'Dustbin Replacement in Market', cat: 5, area: 1, prio: 'medium', status: 'resolved', dept: 4, worker: 5, desc: 'Plastic bin damaged by heavy use; replacement needed.', addr: 'Bazaar Square', lat: 26.8466, lng: 80.9463 },
      { title: 'Primary School Boundary Wall Repair', cat: 7, area: 3, prio: 'medium', status: 'under_review', dept: 5, worker: null, desc: 'Bricks dislodged on back wall of primary school.', addr: 'Govt Primary School', lat: 26.8482, lng: 80.9481 },
      { title: 'Low Pressure in Water Pipeline', cat: 2, area: 5, prio: 'medium', status: 'submitted', dept: 2, worker: null, desc: 'Morning water supply pressure very low in South village end.', addr: 'South Village End Street', lat: 26.8415, lng: 80.9495 },
      { title: 'Night Patrol Street Light Installation', cat: 4, area: 7, prio: 'low', status: 'submitted', dept: 3, worker: null, desc: 'Request for 2 additional lights near West Village cremation ground.', addr: 'West Cremation Ground Road', lat: 26.8398, lng: 80.9385 },
      { title: 'Drain Cleaning Post Rainstorm', cat: 6, area: 1, prio: 'high', status: 'resolved', dept: 4, worker: 5, desc: 'Plastic bags and debris cleared from bazaar drain.', addr: 'Bazaar Drain Line', lat: 26.8469, lng: 80.9464 },
      { title: 'Sub-Centre Solar Fan Inverter Malfunction', cat: 3, area: 6, prio: 'medium', status: 'assigned', dept: 3, worker: 4, desc: 'Inverter battery auto-cutoff not working at sub-centre.', addr: 'Health Sub-Centre East', lat: 26.8472, lng: 80.9522 },
      { title: 'Speed Breaker Painting & Marking', cat: 1, area: 2, prio: 'low', status: 'resolved', dept: 1, worker: 2, desc: 'Reflective yellow paint applied to Panchayat speed breaker.', addr: 'Panchayat Office Main Road', lat: 26.8454, lng: 80.9454 }
    ];

    for (let i = 0; i < mockComplaints.length; i++) {
      const c = mockComplaints[i];
      const trackingId = `SVMS-2026-${String(i + 1).padStart(5, '0')}`;
      const citizenId = 7 + (i % 9); // Citizen IDs 7..15

      const res = await query(
        `INSERT INTO complaints (
          tracking_id, citizen_id, category_id, area_id, title, description,
          location_address, latitude, longitude, priority, status,
          assigned_department_id, assigned_worker_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now', '-${i * 4} hours'))`,
        [
          trackingId, citizenId, c.cat, c.area, c.title, c.desc,
          c.addr, c.lat, c.lng, c.prio, c.status,
          c.dept, c.worker
        ]
      );

      const complaintId = res.insertId || (i + 1);

      // Status history entry
      await query(
        `INSERT INTO complaint_status_history (complaint_id, status, remarks) VALUES (?, ?, ?)`,
        [complaintId, 'submitted', 'Complaint logged into Smart Village Portal.']
      );

      if (c.status !== 'submitted') {
        await query(
          `INSERT INTO complaint_status_history (complaint_id, status, remarks) VALUES (?, ?, ?)`,
          [complaintId, c.status, `Status updated to ${c.status} by administrator.`]
        );
      }
    }

    // 25 Public Resources
    const mockResources = [
      { code: 'HP-001', name_en: 'Bazaar Handpump', name_hi: 'बाजार हैंडपंप', type: 1, area: 1, dept: 2, addr: 'Main Bazaar Square', lat: 26.8465, lng: 80.9463, status: 'active' },
      { code: 'HP-002', name_en: 'School Handpump', name_hi: 'स्कूल हैंडपंप', type: 1, area: 3, dept: 2, addr: 'Primary School Courtyard', lat: 26.8481, lng: 80.9479, status: 'active' },
      { code: 'HP-003', name_en: 'North Village Handpump', name_hi: 'उत्तरी गांव हैंडपंप', type: 1, area: 4, dept: 2, addr: 'North Chopal', lat: 26.8505, lng: 80.9415, status: 'needs_maintenance' },
      { code: 'HP-004', name_en: 'East Village Handpump', name_hi: 'पूर्वी गांव हैंडपंप', type: 1, area: 6, dept: 2, addr: 'East Temple Road', lat: 26.8474, lng: 80.9515, status: 'damaged' },

      { code: 'SL-101', name_en: 'Solar Street Light Pole #1', name_hi: 'सोलर स्ट्रीट लाइट पोल #1', type: 2, area: 1, dept: 3, addr: 'Main Bazaar Entry', lat: 26.8462, lng: 80.9460, status: 'active' },
      { code: 'SL-102', name_en: 'Solar Street Light Pole #2', name_hi: 'सोलर स्ट्रीट लाइट पोल #2', type: 2, area: 2, dept: 3, addr: 'Panchayat Bhawan Front', lat: 26.8451, lng: 80.9451, status: 'active' },
      { code: 'SL-103', name_en: 'Solar Street Light Pole #3', name_hi: 'सोलर स्ट्रीट लाइट पोल #3', type: 2, area: 4, dept: 3, addr: 'North Lane 3', lat: 26.8502, lng: 80.9412, status: 'under_repair' },
      { code: 'SL-104', name_en: 'Solar Street Light Pole #4', name_hi: 'सोलर स्ट्रीट लाइट पोल #4', type: 2, area: 5, dept: 3, addr: 'South Health Clinic Road', lat: 26.8422, lng: 80.9491, status: 'active' },
      { code: 'SL-105', name_en: 'Solar Street Light Pole #5', name_hi: 'सोलर स्ट्रीट लाइट पोल #5', type: 2, area: 7, dept: 3, addr: 'West Bus Stop', lat: 26.8408, lng: 80.9402, status: 'needs_maintenance' },

      { code: 'SCH-01', name_en: 'Govt Primary School', name_hi: 'शासकीय प्राथमिक विद्यालय', type: 3, area: 3, dept: 5, addr: 'School Area Central', lat: 26.8480, lng: 80.9480, status: 'active' },
      { code: 'SCH-02', name_en: 'Smart Anganwadi Centre 1', name_hi: 'स्मार्ट आंगनवाड़ी केंद्र 1', type: 3, area: 7, dept: 5, addr: 'West Village Block A', lat: 26.8401, lng: 80.9392, status: 'active' },

      { code: 'HC-01', name_en: 'Primary Health Centre (PHC)', name_hi: 'प्राथमिक स्वास्थ्य केंद्र', type: 4, area: 5, dept: 5, addr: 'South Village Health Complex', lat: 26.8419, lng: 80.9490, status: 'active' },
      { code: 'HC-02', name_en: 'Health Sub-Centre East', name_hi: 'स्वास्थ्य उप केंद्र पूर्व', type: 4, area: 6, dept: 5, addr: 'East Village Main Street', lat: 26.8473, lng: 80.9521, status: 'active' },

      { code: 'WT-01', name_en: 'Overhead Reservoir 50,000L', name_hi: 'ओवरहेड पानी की टंकी', type: 5, area: 2, dept: 2, addr: 'Panchayat Water Complex', lat: 26.8447, lng: 80.9457, status: 'under_repair' },
      { code: 'WT-02', name_en: 'Solar Pump Water Tank 10,000L', name_hi: 'सोलर पंप वाटर टैंक', type: 5, area: 4, dept: 2, addr: 'North Water Point', lat: 26.8512, lng: 80.9422, status: 'active' },

      { code: 'PT-01', name_en: 'Community Sanitation Complex', name_hi: 'सामुदायिक शौचालय परिसर', type: 6, area: 1, dept: 4, addr: 'Bazaar Bus Terminal', lat: 26.8467, lng: 80.9462, status: 'active' },
      { code: 'PT-02', name_en: 'Pink Toilet Complex for Women', name_hi: 'महिला गुलाबी शौचालय', type: 6, area: 2, dept: 4, addr: 'Panchayat Park', lat: 26.8453, lng: 80.9453, status: 'active' },

      { code: 'CC-01', name_en: 'Gram Panchayat Bhawan', name_hi: 'ग्राम पंचायत भवन', type: 7, area: 2, dept: 5, addr: 'Central Panchayat Grounds', lat: 26.8450, lng: 80.9450, status: 'active' },
      { code: 'CC-02', name_en: 'Village Digital Seva Kendra', name_hi: 'डिजिटल सेवा केंद्र', type: 7, area: 1, dept: 5, addr: 'Bazaar Post Office Building', lat: 26.8464, lng: 80.9464, status: 'active' },

      // Additional resources to make 25
      { code: 'SL-106', name_en: 'Solar Street Light Pole #6', name_hi: 'सोलर स्ट्रीट लाइट पोल #6', type: 2, area: 6, dept: 3, addr: 'East Entrance Road', lat: 26.8476, lng: 80.9519, status: 'active' },
      { code: 'HP-005', name_en: 'South Village Handpump', name_hi: 'दक्षिणी गांव हैंडपंप', type: 1, area: 5, dept: 2, addr: 'South Main Chopal', lat: 26.8421, lng: 80.9488, status: 'active' },
      { code: 'WT-03', name_en: 'School Drinking Water Purifier System', name_hi: 'स्कूल वॉटर प्यूरीफायर', type: 5, area: 3, dept: 2, addr: 'Primary School Tank', lat: 26.8483, lng: 80.9478, status: 'active' },
      { code: 'PT-03', name_en: 'North Public Sanitation Unit', name_hi: 'उत्तर सार्वजनिक शौचालय', type: 6, area: 4, dept: 4, addr: 'North Market Corner', lat: 26.8508, lng: 80.9418, status: 'needs_maintenance' },
      { code: 'SCH-03', name_en: 'Govt High School', name_hi: 'शासकीय उच्च विद्यालय', type: 3, area: 2, dept: 5, addr: 'Panchayat Education Campus', lat: 26.8445, lng: 80.9448, status: 'active' },
      { code: 'SL-107', name_en: 'Solar Street Light Pole #7', name_hi: 'सोलर स्ट्रीट लाइट पोल #7', type: 2, area: 3, dept: 3, addr: 'School Playground Lane', lat: 26.8487, lng: 80.9484, status: 'active' }
    ];

    for (const r of mockResources) {
      await query(
        `INSERT INTO resources (
          resource_code, name_en, name_hi, resource_type_id, area_id, department_id,
          location_address, latitude, longitude, condition_status, installation_date,
          last_maintenance_date, next_maintenance_date, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2024-01-15', '2026-08-10', '2026-11-10', 'Key village infrastructure asset maintained under Smart Village Mission.')`,
        [
          r.code, r.name_en, r.name_hi, r.type, r.area, r.dept,
          r.addr, r.lat, r.lng, r.status
        ]
      );
    }

    // Demo Notifications
    const notifications = [
      { user: 7, title_en: 'Complaint Registered', title_hi: 'शिकायत दर्ज की गई', msg_en: 'Your complaint SVMS-2026-00001 has been logged successfully.', msg_hi: 'आपकी शिकायत SVMS-2026-00001 सफलतापूर्वक दर्ज कर ली गई है।', type: 'success', cid: 1 },
      { user: 7, title_en: 'Worker Assigned', title_hi: 'कार्यकर्ता नियुक्त', msg_en: 'Suresh Kumar (Road Specialist) has been assigned to your issue.', msg_hi: 'आपकी समस्या के लिए सुरेश कुमार (सड़क विशेषज्ञ) को नियुक्त किया गया है।', type: 'info', cid: 1 },
      { user: 1, title_en: 'New High Priority Issue', title_hi: 'नई उच्च प्राथमिकता समस्या', msg_en: 'Critical water leakage reported near Primary School.', msg_hi: 'प्राथमिक विद्यालय के पास गंभीर पानी रिसाव की सूचना मिली है।', type: 'warning', cid: 2 },
      { user: 2, title_en: 'New Task Assigned', title_hi: 'नया कार्य सौंपा गया', msg_en: 'You have been assigned complaint SVMS-2026-00001 for road pothole repair.', msg_hi: 'आपको सड़क के गड्ढे की मरम्मत के लिए शिकायत SVMS-2026-00001 सौंपी गई है।', type: 'info', cid: 1 }
    ];

    for (const n of notifications) {
      await query(
        `INSERT INTO notifications (user_id, title_en, title_hi, message_en, message_hi, type, related_complaint_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [n.user, n.title_en, n.title_hi, n.msg_en, n.msg_hi, n.type, n.cid]
      );
    }

    console.log("Smart Village Database Seeded Successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

module.exports = seedDatabase;
