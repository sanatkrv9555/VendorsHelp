// app.get('/search', (req, res) => {
//   const query = req.query.query?.toLowerCase();
//   if (!query) {
//     return res.send("Please provide a search query.");
//   }

//   const matches = vendors.filter(v => v.items.toLowerCase().includes(query));

//   let html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>Search Results</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f4f4f4;
//           padding: 20px;
//         }
//         .container {
//           max-width: 800px;
//           margin: auto;
//           background: white;
//           padding: 20px;
//           border-radius: 10px;
//         }
//         h2 {
//           text-align: center;
//           color: #333;
//         }
//         .vendor {
//           border: 1px solid #ccc;
//           padding: 15px;
//           margin: 10px 0;
//           border-radius: 5px;
//         }
//         .vendor h3 {
//           margin: 0;
//           color: #007bff;
//         }
//         .vendor p {
//           margin: 5px 0;
//         }
//         a {
//           display: inline-block;
//           margin-top: 20px;
//           text-decoration: none;
//           background: #28a745;
//           color: white;
//           padding: 10px 20px;
//           border-radius: 5px;
//         }
//         a:hover {
//           background: #218838;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>Results for "${req.query.query}"</h2>
//         <a href="/customer.html">Back</a>
//   `;
  

//   if (matches.length === 0) {
//     html += "<p>No matching vendors found.</p>";
//   } else {
//     matches.forEach(v => {
//   html += `
//     <div class="vendor">
//       <h3><a href="/vendor/${v.vendorId}">${v.shopName} (${v.shopType})</a></h3>
//       <p><strong>Owner:</strong> ${v.name}</p>
//       <p><strong>Shop Address:</strong> ${v.shopAddress}</p>
//       <p><strong>Items:</strong> ${v.items}</p>
//     </div>
//   `;
// });

//   }

//   html += `
//       </div>
//     </body>
//     </html>
//   `;

//   res.send(html);
// });


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
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  margin: 0;
  padding: 20px;
}

.vendor-card {
  max-width: 600px;
  margin: 50px auto;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  animation: fadeIn 0.6s ease-in-out;
}

.vendor-title {
  text-align: center;
  color: #333333;
  margin-bottom: 20px;
}

.vendor-card p {
  margin: 10px 0;
  font-size: 16px;
  color: #555555;
}

.item-list {
  margin-top: 20px;
}

.item-list h3 {
  margin-bottom: 10px;
  color: #333333;
}

.item {
  display: inline-block;
  background: #e0e0e0;
  color: #333333;
  padding: 8px 12px;
  border-radius: 20px;
  margin: 5px 5px 0 0;
  font-size: 14px;
}

.chat-button {
  display: block;
  width: fit-content;
  margin: 30px auto 0;
  text-decoration: none;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.chat-button:hover {
  background: linear-gradient(90deg, #e52e71, #ff8a00);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

      </style>
    </head>
    <body>
      <div class="container">
        <h2>${vendor.shopName}</h2>
        <p><strong>Owner:</strong> ${vendor.name}</p>
        <p><strong>Shop Type:</strong> ${vendor.shopType}</p>
        <p><strong>Address:</strong> ${vendor.shopAddress}</p>
        <div class="item-list">
          <h3>Items Available:</h3>
          ${vendor.items.split(',').map(item => `<div class="item">${item.trim()}</div>`).join('')}
        </div>
        <a href="/chat.html?vendorId=${vendor.vendorId}">Chat with Shopkeeper</a>
      </div>
    </body>
    </html>
  `);
});