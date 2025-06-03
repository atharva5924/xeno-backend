import express from "express";
import { Customer } from "../models/customer.model.js";
import { validateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all customers
router.get("/", validateToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create customer
router.post("/", validateToken, async (req, res) => {
  const customer = new Customer(req.body);
  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Bulk create customers (for data ingestion)
// router.post("/bulk", validateToken, async (req, res) => {
//   try {
//     if (!Array.isArray(req.body)) {
//       return res
//         .status(400)
//         .json({ message: "Expected an array of customers" });
//     }

//     // Validate each customer
//     const errors = [];
//     const validCustomers = req.body
//       .map((c, index) => {
//         if (!c.name || !c.email) {
//           errors.push(`Row ${index + 1}: Missing name or email`);
//           return null;
//         }
//         return {
//           name: c.name.trim(),
//           email: c.email.trim(),
//           phone: c.phone?.trim() || "",
//           address: c.address?.trim() || "",
//         };
//       })
//       .filter(Boolean);

//     if (errors.length > 0) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors,
//         validCount: validCustomers.length,
//       });
//     }

//     const result = await Customer.insertMany(validCustomers);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.post("/bulk", validateToken, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ message: "Expected an array of customers" });
    }

    // Validate each customer
    const errors = [];
    const validCustomers = req.body
      .map((c, index) => {
        if (!c.name || !c.email) {
          errors.push(`Row ${index + 1}: Missing name or email`);
          return null;
        }
        return {
          name: c.name.trim(),
          email: c.email.trim(),
          phone: c.phone?.trim() || "",
          address: c.address?.trim() || "",
          totalSpent: c.totalSpent || 0,
          totalOrders: c.totalOrders || 0,
          lastPurchaseDate: c.lastPurchaseDate || null,
          firstPurchaseDate: c.firstPurchaseDate || null,
          tags: c.tags || [],
        };
      })
      .filter(Boolean);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
        validCount: validCustomers.length,
      });
    }

    const result = await Customer.insertMany(validCustomers);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
