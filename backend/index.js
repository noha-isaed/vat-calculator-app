const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',           // ✅ مهم جداً - Angular Port
  'https://calculater-tax.netlify.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ Root
app.get('/', (req, res) => {
  res.json({ message: 'VAT Calculator API is running' });
});

// ✅ Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Calculate
app.post('/api/calculate', (req, res) => {
  try {
    const { totalSales, totalPurchases } = req.body;

    if (totalSales === undefined || totalPurchases === undefined) {
      return res.status(400).json({ error: 'المبيعات والمشتريات مطلوبة' });
    }

    const sales = parseFloat(totalSales);
    const purchases = parseFloat(totalPurchases);

    if (isNaN(sales) || isNaN(purchases) || sales < 0 || purchases < 0) {
      return res.status(400).json({ error: 'قيم غير صالحة' });
    }

    const netSales = sales / 1.16;
    const netPurchases = purchases / 1.16;
    const outputVAT = netSales * 0.16;
    const inputVAT = netPurchases * 0.16;
    const netProfit = netSales - netPurchases;
    const taxDue = outputVAT - inputVAT;
    const profitMargin = netSales > 0 ? (netProfit / netSales) * 100 : 0;

    res.json({
      success: true,
      inputs: { totalSales: sales, totalPurchases: purchases },
      results: {
        netSales: parseFloat(netSales.toFixed(2)),
        netPurchases: parseFloat(netPurchases.toFixed(2)),
        outputVAT: parseFloat(outputVAT.toFixed(2)),
        inputVAT: parseFloat(inputVAT.toFixed(2)),
        netProfit: parseFloat(netProfit.toFixed(2)),
        taxDue: parseFloat(taxDue.toFixed(2)),
        profitMargin: parseFloat(profitMargin.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});