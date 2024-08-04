// import mongoose from "mongoose";

// import PredefinedMenuItem from "@/models/predefinedMenuItem";
import mongoose from "mongoose";
import dotenv from "dotenv";
import PredefinedMenuItem from "../models/predefinedMenuItem";
// // import PredefinedMenuItem from "@/models/predefinedMenuItem";
// // import PredefinedMenuItem from "@/models/predefinedMenuItem";
// // import PredefinedMenuItem from "../models/PredefinedMenuItem";

// dotenv.config();

const predefinedMenuItems = [
  { name: "Paneer Masala", description: "Delicious paneer masala" },
  { name: "Pizza", description: "Cheesy pizza with toppings" },
  { name: "Burger", description: "Juicy burger with fries" },
  // Add more items as needed
];

// const seedPredefinedMenuItems = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexo"
//     );

//     await PredefinedMenuItem.deleteMany(); // Clear existing items

//     await PredefinedMenuItem.insertMany(predefinedMenuItems);

//     console.log("Predefined menu items seeded successfully.");
//     process.exit();
//   } catch (error) {
//     console.error("Error seeding predefined menu items:", error);
//     process.exit(1);
//   }
// };

// seedPredefinedMenuItems();

const predefinedMenuItemsSeeder = async () => {
  try {
    console.log("Running seeder...");

    // Connect to the MongoDB database
    await mongoose.connect("mongodb://127.0.0.1:27017/nexo");
    console.log("Connected to database");

    // Remove any existing data from the blog categories collection
    await PredefinedMenuItem.deleteMany({});
    console.log("Existing blog categories removed");

    // Log the data to be inserted
    // console.log("Blog categories to be inserted:", blogCategories);

    // Insert the blog categories data into the collection
    const result = await PredefinedMenuItem.insertMany(predefinedMenuItems);
    console.log("result", result);
    // console.log("Blog categories inserted:", result);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from database");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

predefinedMenuItemsSeeder();

export default predefinedMenuItemsSeeder;
