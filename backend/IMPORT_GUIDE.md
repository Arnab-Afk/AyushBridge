# NAMASTE Excel Import Guide

## ✅ Database Setup Complete!

Your database is ready with all tables created. You can now import your NAMASTE codes directly.

## Step-by-Step Instructions

### 1. Prepare Your Excel File

Your Excel file should have columns in this order:
- **Column A**: NAMASTE Code (required) - e.g., "NDAM_001", "YOGA_015"
- **Column B**: System Name - e.g., "Ayurveda", "Yoga", "Unani", "Siddha"
- **Column C**: English Name (required) - e.g., "Abhyanga Therapy"
- **Column D**: Local/Sanskrit Name (optional) - e.g., "अभ्यंग चिकित्सा"
- **Column E**: Description (optional)
- **Column F**: Category (optional)
- **Column G**: Indication/Usage (optional)

### 2. Import Your NAMASTE Codes

Place your Excel file in the `backend` folder and run:

```bash
# Basic import
npm run import:namaste your-file-name.xlsx

# Or with full path
node scripts/import-namaste-simple.js "C:\path\to\your\namaste-codes.xlsx"
```

**Advanced options:**
```bash
# Specify sheet name
node scripts/import-namaste-simple.js your-file.xlsx --sheet="NAMASTE_Codes"

# Smaller batch size (if you have memory issues)
node scripts/import-namaste-simple.js your-file.xlsx --batch-size=50

# Skip duplicate checking (faster)
node scripts/import-namaste-simple.js your-file.xlsx --skip-duplicates
```

### 3. Start Your Server (After Import)

```bash
# Development mode (with auto-restart)
npm run dev

# Or basic mode
npm start
```

### 5. Test Your API

Once the server is running, visit:
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **NAMASTE Search**: http://localhost:3000/terminology/namaste/search?q=ayurveda

## Expected Import Output

When you run the import, you'll see:

```
🚀 Starting NAMASTE Excel Import
==================================================
📂 Checking file: C:\your\path\namaste-codes.xlsx
✅ Found 1 sheet(s): Sheet1
📊 Found 6001 rows in sheet
📊 Processing 6000 data rows
🔍 Checking for existing codes...
📊 Found 0 existing codes, 6000 new codes
🔄 Importing 6000 codes in batches of 100
✅ Imported batch 1: 100 codes
✅ Imported batch 2: 100 codes
...
✅ Imported batch 60: 100 codes

📋 IMPORT SUMMARY
==================================================
✅ Successfully imported: 6000 codes
❌ Failed imports: 0 codes
⚠️  Total errors: 0

🎉 Import completed successfully!
```

## Troubleshooting

### Database Connection Issues
```bash
# Check your .env file has correct Neon database URL
cat .env | grep DATABASE_URL
```

### Excel File Issues
- Make sure your Excel file has data starting from row 2 (row 1 is headers)
- Ensure NAMASTE codes and English names are not empty
- Check for special characters that might cause issues

### Import Errors
- The script will show specific row numbers with errors
- Common issues: empty required fields, invalid characters
- You can fix the Excel file and re-run the import

### Server Won't Start
```bash
# Try the minimal server first
npm run minimal
```

## Authentication Changes

🎯 **Important**: ABHA authentication has been completely removed. The API now uses simple development authentication:

- All requests to `/auth/validate` return success
- No JWT tokens needed for development
- Authentication endpoints simplified for testing

## Next Steps

1. **Import your 6000 codes** using the script
2. **Test the terminology search** endpoints
3. **Start building your frontend** to consume the API
4. **Add ICD-11 codes** when ready (similar import process)
5. **Create concept mappings** between NAMASTE and ICD-11

## File Structure

```
backend/
├── scripts/
│   ├── import-namaste.js     ← Excel import script
│   └── setup-database.js     ← Database setup
├── src/
│   ├── models/
│   │   ├── NamasteCode.js    ← Your imported codes go here
│   │   └── ...
│   └── routes/
│       ├── auth.js           ← Simplified (no ABHA)
│       └── terminology.js    ← Search your codes here
└── your-namaste-file.xlsx    ← Put your Excel file here
```

## Support

If you run into issues:
1. Check the error messages - they're detailed
2. Verify your .env database connection
3. Try the `npm run db:setup` command first
4. The import script shows exactly which rows have problems
