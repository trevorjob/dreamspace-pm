# ⚠️ TEMPORARY IMAGE URL FIX

**Status:** Active  
**Date Added:** November 23, 2025  
**Priority:** Remove this ASAP when proper image handling is implemented

---

## Issue

Two problems being addressed:
1. Cloudinary image URLs were being returned with `image/upload/` in the path
2. CloudinaryField doesn't properly handle external URLs (like Unsplash) used in seed data

---

## Temporary Solution

Modified serializers to:
1. Detect if the image field contains a full HTTP/HTTPS URL (external images)
2. Return external URLs as-is
3. For Cloudinary URLs, strip `image/upload/` from the path
4. Handle errors gracefully if neither case applies

### Files Modified:

1. **`server/api/moodboards/serializers.py`**
   - `MoodboardItemSerializer.get_image_url()`
   - Strips `image/upload/` from the URL

2. **`server/api/vendors/serializers.py`**
   - `PortfolioItemSerializer.get_image()`
   - Strips `image/upload/` from the URL

---

## Code Pattern

```python
# TODO: REMOVE THIS - Temporary fix to handle both Cloudinary and external URLs
def get_image_url(self, obj):
    if obj.image:
        # Check if it's already a full URL (like Unsplash)
        image_str = str(obj.image)
        if image_str.startswith('http://') or image_str.startswith('https://'):
            return image_str
        # Otherwise treat as Cloudinary field
        try:
            url = obj.image.url
            # Strip 'image/upload/' from Cloudinary URLs
            return url.replace('image/upload/', '') if 'image/upload/' in url else url
        except:
            return image_str
    return None
```

---

## What This Handles

1. **External URLs (Unsplash, etc.):**
   ```
   Input:  https://images.unsplash.com/photo-123?w=800
   Output: https://images.unsplash.com/photo-123?w=800
   ```

2. **Cloudinary URLs:**
   ```
   Input:  https://res.cloudinary.com/xyz/image/upload/v123/sample.jpg
   Output: https://res.cloudinary.com/xyz/v123/sample.jpg
   ```

---

## Proper Solution (TO IMPLEMENT)

1. **Configure Cloudinary properly** in `settings.py`:
   - Ensure `CLOUDINARY_URL` is set correctly
   - Configure proper transformations/formats

2. **Update frontend to handle Cloudinary URLs**:
   - Use Cloudinary's image optimization features
   - Implement proper image transformations
   - Handle responsive images with srcset

3. **Remove the `.replace()` workaround** from both serializers

4. **Test image uploads and display** thoroughly

---

## Affected Models

- `MoodboardItem` - Uses CloudinaryField for `image`
- `PortfolioItem` - Uses CloudinaryField for `image`

---

## Search for Removal

To find all instances of this temporary fix:

```bash
# PowerShell
Select-String -Path "server/api/**/*.py" -Pattern "TODO.*REMOVE THIS.*image/upload"

# Or grep
grep -r "TODO.*REMOVE THIS.*image/upload" server/api/
```

---

## Testing After Removal

When removing this fix:

1. Upload new images through the API
2. Verify image URLs are returned correctly
3. Check frontend displays images properly
4. Test on different environments (dev, staging, prod)
5. Verify existing seeded images still work

---

## Related Files

- `server/api/moodboards/serializers.py`
- `server/api/vendors/serializers.py`
- `server/project/settings.py` (Cloudinary config)

---

**REMEMBER: This is a TEMPORARY workaround. Do not keep this in production!**
