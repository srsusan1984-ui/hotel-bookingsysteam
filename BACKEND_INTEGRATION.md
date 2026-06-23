# Backend Integration Guide

## 🔧 Backend Changes Required

This guide explains the backend updates needed to support the new frontend components.

---

## 1. ROOM AVAILABILITY ENDPOINT

### Location
Create: `routes/hotelRoutes.js` or `routes/availabilityRoutes.js`

### Endpoint
```
GET /api/hotels/:hotelId/availability?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
```

### Implementation
```javascript
// hotelController.js
exports.getAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkInDate, checkOutDate } = req.query;

    // Validate dates
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "checkInDate and checkOutDate are required"
      });
    }

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Check-in date must be before check-out date"
      });
    }

    // Find hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Find overlapping bookings
    const bookedRooms = await Booking.find({
      hotelId,
      status: { $in: ["confirmed", "checked-in"] },
      checkInDate: { $lt: endDate },
      checkOutDate: { $gt: startDate }
    });

    const totalBooked = bookedRooms.reduce((sum, b) => sum + (b.roomsBooked || 1), 0);
    const available = Math.max(0, hotel.totalRooms - totalBooked);

    res.json({
      success: true,
      data: {
        hotelId,
        checkInDate,
        checkOutDate,
        totalRooms: hotel.totalRooms,
        bookedRooms: totalBooked,
        availableRooms: available,
        roomsByType: hotel.roomTypes ? {
          single: {
            total: hotel.roomTypes.single.total,
            booked: bookedRooms.filter(b => b.roomType === 'single').length,
            available: hotel.roomTypes.single.total - bookedRooms.filter(b => b.roomType === 'single').length
          },
          double: {
            total: hotel.roomTypes.double.total,
            booked: bookedRooms.filter(b => b.roomType === 'double').length,
            available: hotel.roomTypes.double.total - bookedRooms.filter(b => b.roomType === 'double').length
          }
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
      error: error.message
    });
  }
};
```

### Routes
```javascript
// routes/hotelRoutes.js
router.get('/:hotelId/availability', hotelController.getAvailability);
```

### Database Index
```javascript
// Run once in MongoDB
db.bookings.createIndex({
  hotelId: 1,
  checkInDate: 1,
  checkOutDate: 1,
  status: 1
});
```

---

## 2. REVIEW AUTO-PUBLISH

### Update Schema
```javascript
// models/Review.js
const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  userName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, minlength: 20, maxlength: 1000 },
  
  // Remove approval fields:
  // approved: Boolean,
  // adminResponse: String,
  // approvedBy: Schema.Types.ObjectId,
  // approvedAt: Date,
  
  // Add publishing fields:
  published: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Update Submit Endpoint
```javascript
// reviewController.js
exports.submitReview = async (req, res) => {
  try {
    const { userId, hotelId, rating, title, comment } = req.body;

    // Validation
    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating, title, and comment are required"
      });
    }

    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title must be 5-100 characters"
      });
    }

    if (comment.length < 20 || comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be 20-1000 characters"
      });
    }

    // Check for duplicate reviews (optional)
    const existingReview = await Review.findOne({ userId, hotelId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this hotel"
      });
    }

    // Create review
    const review = new Review({
      userId,
      hotelId,
      rating,
      title,
      comment,
      published: true,           // ← AUTO-PUBLISH
      publishedAt: new Date()    // ← SET PUBLISH TIME
    });

    await review.save();

    // Populate user info
    await review.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: "Review posted successfully",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting review",
      error: error.message
    });
  }
};
```

### Remove Approval Endpoints
```javascript
// DELETE these endpoints from reviewController.js
// - getPendingReviews
// - approveReview
// - rejectReview
// - addAdminResponse

// They are no longer needed
```

### Update Get Reviews Endpoint
```javascript
exports.getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    // Remove filter for 'approved'
    const reviews = await Review.find({
      hotelId,
      published: true  // ← PUBLISHED NOT APPROVED
    })
    .populate('userId', 'name email')
    .sort({ publishedAt: -1 })
    .limit(50);

    res.json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};
```

---

## 3. REVIEW STATISTICS

### Endpoint
```
GET /api/reviews/stats/:hotelId
```

### Implementation
```javascript
// reviewController.js
exports.getReviewStats = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Get all published reviews
    const reviews = await Review.find({
      hotelId,
      published: true
    });

    if (reviews.length === 0) {
      return res.json({
        success: true,
        data: {
          stats: {
            hotelId,
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0
            }
          }
        }
      });
    }

    // Calculate statistics
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    let totalRating = 0;
    reviews.forEach(review => {
      totalRating += review.rating;
      ratingDistribution[review.rating]++;
    });

    const averageRating = (totalRating / reviews.length).toFixed(2);

    res.json({
      success: true,
      data: {
        stats: {
          hotelId,
          totalReviews: reviews.length,
          averageRating: parseFloat(averageRating),
          ratingDistribution
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching review statistics",
      error: error.message
    });
  }
};
```

---

## 4. ACTIVE OFFERS ENDPOINT

### Endpoint
```
GET /api/offers/active
```

### Implementation
```javascript
// offerController.js
exports.getActiveOffers = async (req, res) => {
  try {
    const currentDate = new Date();

    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: currentDate },
      validUntil: { $gte: currentDate }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        offers: offers.map(offer => ({
          _id: offer._id,
          code: offer.code,
          title: offer.title,
          description: offer.description,
          discountType: offer.discountType, // 'percentage' or 'fixed'
          discountValue: offer.discountValue,
          applicableHotels: offer.applicableHotels || null,
          maxUsage: offer.maxUsage,
          currentUsage: offer.usageCount || 0,
          validFrom: offer.validFrom,
          validUntil: offer.validUntil,
          minBookingAmount: offer.minBookingAmount
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message
    });
  }
};
```

### Offer Schema
```javascript
// models/Offer.js
const offerSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: { type: Number, required: true },
  applicableHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }], // null = all hotels
  maxUsage: { type: Number, required: true },
  usageCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  minBookingAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## Database Migration Script

```javascript
// migrations/updateReviewsSchema.js
async function migrateReviews() {
  try {
    console.log('Starting review migration...');

    // 1. Remove approval fields
    await db.reviews.updateMany(
      {},
      {
        $unset: {
          approved: "",
          adminResponse: "",
          approvedBy: "",
          approvedAt: ""
        }
      }
    );

    // 2. Add publishing fields
    await db.reviews.updateMany(
      { published: { $exists: false } },
      {
        $set: {
          published: true,
          publishedAt: new Date()
        }
      }
    );

    // 3. Add indexes
    await db.reviews.createIndex({ hotelId: 1, published: 1 });
    await db.reviews.createIndex({ publishedAt: -1 });

    // 4. Create hotel availability index
    await db.bookings.createIndex({
      hotelId: 1,
      checkInDate: 1,
      checkOutDate: 1,
      status: 1
    });

    console.log('✓ Migration completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error);
  }
}

migrateReviews();
```

---

## Routes Setup

```javascript
// server.js or app.js
const hotelRoutes = require('./routes/hotelRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const offerRoutes = require('./routes/offerRoutes');

app.use('/api/hotels', hotelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/offers', offerRoutes);

// New endpoint
app.get('/api/hotels/:hotelId/availability', hotelController.getAvailability);
```

---

## Testing Backend Endpoints

```bash
# 1. Test Room Availability
curl "http://localhost:5000/api/hotels/123/availability?checkInDate=2025-06-20&checkOutDate=2025-06-25"

# Response:
{
  "success": true,
  "data": {
    "hotelId": "123",
    "totalRooms": 50,
    "bookedRooms": 12,
    "availableRooms": 38
  }
}

# 2. Test Submit Review (Auto-Published)
curl -X POST http://localhost:5000/api/reviews/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "hotelId": "hotel123",
    "rating": 4,
    "title": "Amazing Stay",
    "comment": "The hotel is incredibly clean and the staff is very helpful"
  }'

# Response:
{
  "success": true,
  "message": "Review posted successfully",
  "data": {
    "_id": "review123",
    "rating": 4,
    "title": "Amazing Stay",
    "published": true,
    "publishedAt": "2025-06-18T10:30:00Z"
  }
}

# 3. Test Review Statistics
curl http://localhost:5000/api/reviews/stats/hotel123

# Response:
{
  "success": true,
  "data": {
    "stats": {
      "hotelId": "hotel123",
      "totalReviews": 45,
      "averageRating": 4.2,
      "ratingDistribution": {
        "5": 20,
        "4": 18,
        "3": 5,
        "2": 2,
        "1": 0
      }
    }
  }
}

# 4. Test Active Offers
curl http://localhost:5000/api/offers/active

# Response:
{
  "success": true,
  "data": {
    "offers": [
      {
        "_id": "offer1",
        "code": "WELCOME10",
        "title": "Welcome Discount",
        "description": "10% off on your first booking",
        "discountType": "percentage",
        "discountValue": 10,
        "maxUsage": 1000,
        "currentUsage": 234,
        "validFrom": "2025-01-01T00:00:00Z",
        "validUntil": "2025-12-31T23:59:59Z",
        "minBookingAmount": 5000
      }
    ]
  }
}
```

---

## Error Handling

All endpoints should return standard error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in dev)"
}
```

---

## Environment Variables

```env
# .env
MONGODB_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

---

## Deployment Checklist

- [ ] Database backed up
- [ ] New endpoints tested locally
- [ ] Migration script tested
- [ ] Indexes created
- [ ] Environment variables set
- [ ] Error handling verified
- [ ] Rate limiting implemented (optional but recommended)
- [ ] Staging deployment successful
- [ ] Production deployment with zero downtime

---

## Support

For questions or issues, refer to the full [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
