# 🎯 CSR Volunteer Matching System - Demo Guide

## 📋 Demo Overview

This demo will showcase the complete CSR Volunteer Matching System with:
- **Backend API** (Go + PostgreSQL)
- **Mobile App** (React Native)
- **Real-time data** synchronization
- **Role-based access** (PIN, CSR Rep, Admin)

## 🚀 Demo Setup Steps

### Step 1: Start Backend
```powershell
# Terminal 1 - Backend
cd C:\Users\aerit\Documents\GitHub\AERYTH\backend

# Set environment variables
$env:DATABASE_URL = "host=localhost user=postgres password=YOUR_PASSWORD dbname=csr_volunteer port=5432 sslmode=disable"
$env:SERVER_ADDRESS = ":8080"

# Run backend
go run cmd/main.go
```

### Step 2: Seed Test Data
```powershell
# Terminal 2 - Seed Data
cd C:\Users\aerit\Documents\GitHub\AERYTH\backend

# Run seed script
go run cmd/seed_data.go
```

### Step 3: Start Mobile App
```powershell
# Terminal 3 - Mobile App
cd C:\Users\aerit\Documents\GitHub\AERYTH\CSRVolunteerApp

# Install dependencies (first time only)
npm install

# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

## 🎬 Demo Script

### **Demo 1: PIN User Experience**

#### 1.1 Register as PIN User
1. Open mobile app
2. Tap "Don't have an account? Sign Up"
3. Fill registration form:
   - Username: `pin_user_demo`
   - Email: `pin@demo.com`
   - Password: `password123`
   - Role: **Person in Need (PIN)**
4. Tap "Create Account"

#### 1.2 Create PIN Profile
1. After login, tap "Create PIN Profile"
2. Fill profile form:
   - First Name: `John`
   - Last Name: `Doe`
   - Phone: `+1-555-0123`
   - Address: `123 Main St, City, State`
   - Emergency Contact: `Jane Doe - +1-555-0124`
   - Medical Info: `No known allergies`
   - Special Needs: `Wheelchair accessible`
3. Tap "Create PIN Profile"

#### 1.3 Create Help Request
1. On home screen, tap the "+" FAB button
2. Fill request form:
   - Title: `Need help with grocery shopping`
   - Description: `I need assistance with weekly grocery shopping due to mobility issues. Looking for someone to help me shop for essentials.`
   - Category: **Medical Assistance**
   - Urgency: **Medium**
   - Location: `Downtown`
   - Special Notes: `Need wheelchair accessible transportation`
3. Tap "Create Request"

#### 1.4 View Request Analytics
1. Go to "Requests" tab
2. See your request with:
   - View count (0 initially)
   - Shortlist count (0 initially)
   - Status: **OPEN**

### **Demo 2: CSR Representative Experience**

#### 2.1 Register as CSR Rep
1. Logout from PIN account
2. Tap "Don't have an account? Sign Up"
3. Fill registration form:
   - Username: `csr_user_demo`
   - Email: `csr@demo.com`
   - Password: `password123`
   - Role: **CSR Representative**
4. Tap "Create Account"

#### 2.2 Create CSR Profile
1. After login, tap "Create CSR Profile"
2. Fill profile form:
   - Company: Select from dropdown
   - First Name: `Sarah`
   - Last Name: `Johnson`
   - Phone: `+1-555-0456`
   - Department: `HR`
   - Position: `Manager`
3. Tap "Create CSR Profile"

#### 2.3 Search Volunteer Opportunities
1. Go to "Search" tab
2. See list of available requests
3. Use filters:
   - Category: **Medical Assistance**
   - Urgency: **Medium**
4. Tap on a request to view details

#### 2.4 Add to Shortlist
1. On request detail screen
2. Tap "Add to Shortlist"
3. Add notes: `Great opportunity for our team`
4. Set priority: **High**
5. Tap "Add to Shortlist"

#### 2.5 View Shortlist
1. Go to "Shortlist" tab
2. See your saved requests
3. View notes and priority

#### 2.6 Create Match
1. Go to "Matches" tab
2. Tap "Create Match"
3. Select a request from shortlist
4. Add notes: `Looking forward to helping`
5. Set start date
6. Tap "Create Match"

### **Demo 3: Admin Experience**

#### 3.1 Register as Admin
1. Logout from CSR account
2. Register with role: **Admin**

#### 3.2 View Dashboard
1. See platform statistics
2. View recent activity
3. Check system health

#### 3.3 Manage Categories
1. Go to "Categories" tab
2. View all service categories
3. Add new category if needed

#### 3.4 Generate Reports
1. Go to "Reports" tab
2. Generate daily/weekly/monthly reports
3. View analytics data

## 🔄 Real-time Demo Features

### **Cross-User Interactions**

#### PIN → CSR Interaction
1. **PIN creates request** → Shows in CSR search
2. **CSR views request** → PIN sees view count increase
3. **CSR adds to shortlist** → PIN sees shortlist count increase
4. **CSR creates match** → PIN sees new match in history

#### Analytics Tracking
1. **View tracking** - Every time CSR views a request
2. **Shortlist tracking** - When CSR saves a request
3. **Match tracking** - When CSR creates a match
4. **Completion tracking** - When match is completed

## 📊 Demo Data

The seed script creates:
- **20 Service Categories** (Medical, Transportation, etc.)
- **10 Companies** (TechCorp, Green Energy, etc.)
- **100 PIN profiles** with realistic data
- **50 CSR Rep profiles** from different companies
- **200 PIN requests** with various categories and urgency
- **150 Shortlist entries** (CSR reps saving requests)
- **100 Matches** with different statuses
- **500 View logs** for analytics

## 🎯 Key Demo Points

### **1. Role-Based Access**
- Different navigation for each user type
- Appropriate features for each role
- Secure authentication

### **2. Real-time Analytics**
- View counts update immediately
- Shortlist counts track interest
- Match statistics show engagement

### **3. Advanced Filtering**
- Search by category, urgency, location
- Date range filtering
- Text search across titles/descriptions

### **4. Complete Workflow**
- PIN creates request → CSR finds it → CSR shortlists → CSR creates match → Both track progress

### **5. Mobile-First Design**
- Intuitive navigation
- Material Design components
- Responsive layout
- Offline-capable (with caching)

## 🚨 Troubleshooting

### **Backend Issues**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check port 8080 is available

### **Mobile App Issues**
- Check Metro bundler is running
- Verify API URL in `src/services/api.ts`
- Check device/emulator is connected

### **Database Issues**
- Ensure database `csr_volunteer` exists
- Check PostgreSQL user permissions
- Verify connection string

## 📱 Demo Tips

1. **Use multiple devices** - Show PIN on one device, CSR on another
2. **Show real-time updates** - Create request on PIN, immediately search on CSR
3. **Highlight analytics** - Show how view/shortlist counts update
4. **Demonstrate filtering** - Show advanced search capabilities
5. **Show complete workflow** - From request creation to match completion

## 🎉 Demo Conclusion

This system demonstrates:
- **Complete CSR volunteer matching platform**
- **Real-time data synchronization**
- **Role-based user experience**
- **Mobile-first design**
- **Comprehensive analytics**
- **Scalable architecture**

Perfect for corporate social responsibility programs!



