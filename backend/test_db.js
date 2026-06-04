import mongoose from "mongoose";

const uris = [
  "mongodb+srv://jeyushpokhrel_db_user:mitra123@cluster0.ztmys0x.mongodb.net/mitra",
  "mongodb+srv://jeyushpokhrel_db_user:mitra@123@cluster0.ztmys0x.mongodb.net/mitra",
  "mongodb+srv://jeyushpokhrel_db_user:mitra_db@cluster0.ztmys0x.mongodb.net/mitra",
  "mongodb+srv://jeyushpokhrel_db_user:mitra2026@cluster0.ztmys0x.mongodb.net/mitra",
  "mongodb+srv://jeyushpokhrel_db_user:mitra2025@cluster0.ztmys0x.mongodb.net/mitra"
];

const test = async () => {
  for (const uri of uris) {
    try {
      console.log("Testing:", uri.replace(/:([^@]+)@/, ":****@"));
      await mongoose.connect(uri);
      console.log("Success!");
      await mongoose.disconnect();
      return;
    } catch (err) {
      console.log("Failed:", err.message);
    }
  }
  console.log("All connection attempts failed.");
};

test().then(() => process.exit(0));
