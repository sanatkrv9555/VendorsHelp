const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5050;
// const http = require('http').createServer(app);
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const path = require('path');
const socketIO = require('socket.io');

// const app = express();
// const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const vendors = [];
const customers=[];
app.post('/register-customer', (req, res) => {
  const { name, age, email, latitude, longitude } = req.body;

  // Basic validation
  if (!name || !age || !email || !latitude || !longitude) {
    return res.status(400).send('Please provide all required fields.');
  }

  const customerId = 'CID' + (customers.length + 1).toString().padStart(4, '0');
  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);

  const newCustomer = {
    customerId,
    name,
    age: parseInt(age),
    email,
    latitude: latNum,
    longitude: lonNum
  };

  customers.push(newCustomer);
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Customer Info - Vendor Help</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      height: 100vh;
      background: linear-gradient(135deg,rgb(248, 249, 251),rgb(243, 248, 252));
      font-family: 'Montserrat', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
      overflow: hidden;
    }

    .card-wrapper {
      width: 100%;
      max-width: 420px;
      transform-style: preserve-3d;
      transition: transform 0.8s ease;
    }

    .card-wrapper:hover {
      transform: rotateY(20deg) rotateX(5deg);
    }

    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px 30px;
      box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.5);
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.1);
      animation: fadeSlideIn 1s ease forwards;
      opacity: 0;
      transform: translateY(50px);
    }

    @keyframes fadeSlideIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 20px;
      color:rgb(7, 35, 86);
      letter-spacing: 1px;
    }

    .info {
      text-align: left;
      margin-top: 20px;
    }

    .info p {
      font-size: 1.05rem;
      margin-bottom: 12px;
      padding: 12px 18px;
      background: #f2f5fc;
      border-radius: 10px;
      border-left: 4px solid #1e3c72;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }

    .info p:hover {
      transform: scale(1.03);
      background: #e8effa;
    }

    .info p span {
      font-weight: 600;
      color: #1e3c72;
    }

    @media (max-width: 500px) {
      .card {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card">
      <h2>Customer Registered</h2>
      <div class="info">
        <p><span>ID:</span> ${customerId}</p>
        <p><span>Name:</span> ${name}</p>
        <p><span>Age:</span> ${age}</p>
        <p><span>Email:</span> ${email}</p>
      </div>
    </div>
  </div>
</body>
</html>
`);
  });

app.post('/register-vendor', upload.fields([
  { name: 'aadhaarPhoto', maxCount: 1 },
  { name: 'shopPhoto', maxCount: 1 }
]), (req, res) => {
  const { name, shopName, gender, shopAddress, latitude, longitude,shopType, items } = req.body;
  const aadhaarPhoto = req.files['aadhaarPhoto']?.[0]?.filename;
  const shopPhoto = req.files['shopPhoto']?.[0]?.filename;

  if (!aadhaarPhoto || !shopPhoto) {
    return res.send("Upload failed. Make sure both images are selected.");
  }

  const vendorId = 'VID' + (vendors.length + 1).toString().padStart(4, '0');
   const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);

  const newVendor = {
    vendorId,
    name,
    shopName,
    gender,
    shopAddress,
    latitude: latNum,
    longitude: lonNum,
    shopType,
    items,
    aadhaarPhoto,
    shopPhoto
  };

  vendors.push(newVendor);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Vendor Registered</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #74ebd5, #ACB6E5);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 600px;
          animation: fadeIn 0.6s ease-in-out;
        }
        h2 {
          text-align: center;
          color: #28a745;
          margin-bottom: 20px;
        }
        p {
          margin: 10px 0;
          font-size: 16px;
          color: #333;
        }
        strong {
          color: #000;
        }
        img {
          margin-top: 8px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        a {
          display: inline-block;
          margin-top: 20px;
          text-decoration: none;
          background: #007bff;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        a:hover {
          background: #0056b3;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Vendor Registered Successfully!</h2>
        <p><strong>Vendor ID:</strong> ${vendorId}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Shop Name:</strong> ${shopName}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Location:</strong> ${shopAddress}</p>
        <p><strong>Latitude:</strong> ${latitude}</p>
        <p><strong>Longitude:</strong> ${longitude}</p>
        <p><strong>Shop Type:</strong> ${shopType}</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Aadhaar Photo:</strong><br><img src="/uploads/${aadhaarPhoto}" width="200"></p>
        <p><strong>Shop Photo:</strong><br><img src="/uploads/${shopPhoto}" width="200"></p>
        <a href="/register.html">Back to Registration</a>
      </div>
    </body>
    </html>
  `);
});
app.get('/vendor/:id', (req, res) => {
  const vendor = vendors.find(v => v.vendorId === req.params.id);
  if (!vendor) return res.status(404).send('Vendor not found');
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${vendor.shopName} - Details</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #dfe9f3, #ffffff);
        margin: 0;
        padding: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .vendor-card {
        background: #ffffff;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 300px;
        text-align: center;
        animation: rotateIn 1s ease forwards;
        transform-style: preserve-3d;
        perspective: 1000px;
      }

      @keyframes rotateIn {
        0% {
          opacity: 0;
          transform: rotateY(90deg) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: rotateY(0deg) scale(1);
        }
      }

      .vendor-title {
        font-size: 30px;
        color: #2c3e50;
        margin-bottom: 20px;
      }

      .vendor-card p {
        font-size: 16px;
        color: #555;
        margin: 10px 0;
      }

      .item-list {
        margin-top: 20px;
      }

      .item-list h3 {
        margin-bottom: 10px;
        color: #333;
        font-size: 20px;
      }

      .item {
        display: inline-block;
        background: #f1f1f1;
        padding: 10px 16px;
        border-radius: 30px;
        margin: 5px;
        font-size: 14px;
        color: #333;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
      }

      .item:hover {
        transform: scale(1.1);
        background: #e0e0e0;
      }

      .chat-button {
        display: inline-block;
        margin-top: 30px;
        padding: 12px 25px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        transition: transform 0.3s ease, background 0.3s ease;
      }

      .chat-button:hover {
        transform: scale(1.05);
        background: linear-gradient(90deg, #e52e71, #ff8a00);
      }
    </style>
  </head>
  <body>
    <div class="vendor-card">
      <h2 class="vendor-title">${vendor.shopName}</h2>
      <p><strong>Owner:</strong> ${vendor.name}</p>
      <p><strong>Shop Type:</strong> ${vendor.shopType}</p>
      <p><strong>Address:</strong> ${vendor.shopAddress}</p>
      <p><strong>Latitude and Longitude:</strong> ${vendor.latitude}, ${vendor.longitude}</p>

      <div class="item-list">
        <h3>Items Available:
        ${vendor.items.split(',').map(item => `<div class="item">${item.trim()}</div>`).join('')}
        </h3>
      </div>

      <a class="chat-button" href="/chat.html?vendorId=${vendor.vendorId}">Chat with Shopkeeper</a>
    </div>
  </body>
  </html>
`);

});
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

app.get('/search', (req, res) => {
  const query = req.query.query?.toLowerCase();
  if (!query) {
    return res.send("Please provide a search query.");
  }
  const latestCustomer = customers[customers.length - 1]; // Use latest
  if (!latestCustomer) {
    return res.send("No customers found.");
  }

  const lat1 = latestCustomer.latitude;
  const long1 = latestCustomer.longitude;


  const matches = vendors.filter(v => v.items.toLowerCase().includes(query));
  
  matches.forEach(vendor => {
    vendor.distance = getDistanceFromLatLonInKm(lat1, long1, vendor.latitude, vendor.longitude);
  });
   matches.sort((a, b) => a.distance - b.distance);

 let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Search Results</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(to right, #f8f9fa, #e0eafc);
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 1200px;
        margin: auto;
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      .vendor-card {
        background: white;
        border-radius: 15px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        padding: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .vendor-card:hover {
        transform: scale(1.03);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
      }
      .vendor-card h3 {
        margin-top: 0;
        font-size: 22px;
        color: #007bff;
      }
      .vendor-card p {
        margin: 8px 0;
        color: #444;
        font-size: 15px;
      }
      .vendor-card a.button {
        display: inline-block;
        margin-top: 15px;
        background-color: #28a745;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .vendor-card a.button:hover {
        background-color: #218838;
      }
      .back-btn {
        display: inline-block;
        margin-bottom: 30px;
        background: #6c757d;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none;
        transition: background 0.3s ease;
      }
      .back-btn:hover {
        background: #5a6268;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <a class="back-btn" href="/customer.html">← Back</a>
      <h2>Results for "${req.query.query}"</h2>
      <div class="card-grid">
`;

if (matches.length === 0) {
  html += `<p>No matching vendors found.</p>`;
} else {
  matches.forEach(v => {
    html += `
      <div class="vendor-card">
        <h3><a href="/vendor/${v.vendorId}">${v.shopName} (${v.shopType})</a></h3>
        <p><strong>Owner:</strong> ${v.name}</p>
        <p><strong>Distance:</strong> ${v.distance} km</p>
        <p><strong>Shop Address:</strong> ${v.shopAddress}</p>
        <p><strong>Coordinates:</strong> ${v.latitude}, ${v.longitude}</p>
        <p><strong>Items:</strong> ${v.items}</p>
        <a class="button" href="/vendor/${v.vendorId}">View Details</a>
      </div>
    `;
  });
}

html += `
      </div>
    </div>
  </body>
  </html>
`;

  res.send(html);
});



io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
  io.emit('chat message', msg); // Sends to everyone including sender
});


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
// const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
