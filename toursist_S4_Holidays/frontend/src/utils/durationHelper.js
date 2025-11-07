/**
 * Extract duration from package title or duration field
 * Supports formats like:
 * - "Andaman (Port Blair – 3 Nights | Havelock – 2 Nights)" → "6D/5N"
 * - "Baku (Baku – 4 Nights | Gabala – 1 Night)" → "6D/5N"
 * - Manual duration field: "5D/4N" → "5D/4N"
 * 
 * @param {string} title - Package title
 * @param {string} durationField - Duration field from database (optional)
 * @returns {string} - Formatted duration
 */
export const getDuration = (title, durationField) => {
  // If duration exists in database and is not empty, use it
  if (durationField && durationField.trim() !== '') {
    return durationField;
  }
  
  // If no title, return default
  if (!title) {
    return 'Enquire';
  }
  
  // Extract all "X Nights" patterns from title
  const nightsMatches = title.match(/(\d+)\s*Nights?/gi);
  
  if (nightsMatches && nightsMatches.length > 0) {
    // Calculate total nights (sum all night counts)
    const totalNights = nightsMatches.reduce((sum, match) => {
      const nights = parseInt(match.match(/\d+/)[0]);
      return sum + nights;
    }, 0);
    
    // Calculate days (typically nights + 1)
    const totalDays = totalNights + 1;
    
    // Return formatted duration
    return `${totalDays}D/${totalNights}N`;
  }
  
  // Fallback if no pattern found
  return 'Enquire';
};


/**
 * Alternative version - returns only first location's duration
 * Use this if you want simpler display
 */
export const getSimpleDuration = (title, durationField) => {
  if (durationField && durationField.trim() !== '') {
    return durationField;
  }
  
  if (!title) {
    return 'Enquire';
  }
  
  // Match first occurrence of "X Nights"
  const match = title.match(/(\d+)\s*Nights?/i);
  
  if (match) {
    const nights = parseInt(match[1]);
    const days = nights + 1;
    return `${days}D/${nights}N`;
  }
  
  return 'Enquire';
};
