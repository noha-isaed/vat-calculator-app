const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200'],  // سنضيف رابط Vercel لاحقاً
  credentials: true
}));
app.use(express.json());

// API endpoint for VAT calculation
app.post('/api/calculate', (req, res) => {
  try {
    const { totalSales, totalPurchases, operationsCount, soldItemsCount, purchasedItemsCount } = req.body;

    // Input validation
    if (totalSales === undefined || totalPurchases === undefined) {
      return res.status(400).json({ error: 'المبيعات والمشتريات مطلوبة' });
    }

    // Convert to numbers
    const sales = parseFloat(totalSales);
    const purchases = parseFloat(totalPurchases);

    // Validate numbers
    if (isNaN(sales) || isNaN(purchases) || sales < 0 || purchases < 0) {
      return res.status(400).json({ error: 'قيم غير صالحة' });
    }

    // Calculations
    const netSales = sales / 1.16;
    const netPurchases = purchases / 1.16;
    const outputVAT = netSales * 0.16;
    const inputVAT = netPurchases * 0.16;
    const netProfit = netSales - netPurchases;
    const taxDue = outputVAT - inputVAT;
    const profitMargin = netSales > 0 ? (netProfit / netSales) * 100 : 0;

    // Prepare response
    const results = {
      netSales: parseFloat(netSales.toFixed(2)),
      netPurchases: parseFloat(netPurchases.toFixed(2)),
      outputVAT: parseFloat(outputVAT.toFixed(2)),
      inputVAT: parseFloat(inputVAT.toFixed(2)),
      netProfit: parseFloat(netProfit.toFixed(2)),
      taxDue: parseFloat(taxDue.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2))
    };

    res.json({
      inputs: req.body,
      results: results
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'VAT Calculator API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});