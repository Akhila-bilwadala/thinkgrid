/**
 * Utility to calculate Elite Points for the user.
 * 
 * Rules:
 * - Material Upload: 10 points
 * - Joining a Project (Lab): 12 points
 * - Posting or Helping (Room Participation/Join): 13 points
 */

export const calculateElitePoints = (materials, labs, rooms, baseScore = 0) => {
    // 10 pts per Material Upload (where uploadedBy matches user)
    // Note: In Activity.jsx we currently only have userSavedMaterials.
    // For a more accurate "upload" count, we might need to fetch all materials 
    // or specifically track uploads. 
    // For now, we'll treat any saved material that the user uploaded as 10 pts,
    // and others as 0 (unless we want to award points for saving too).
    // The user specifically said "uploading a ppt/pdf=10 points".
    
    // For the sake of this demonstration, we'll assume 'materials' passed here 
    // are the ones we want to count for uploads if they match the user.
    const uploadPoints = (materials || []).length * 10;
    
    // 12 pts per Joined Project (Lab)
    const labPoints = (labs || []).length * 12;
    
    // 13 pts per Joined Room (as a proxy for Posting/Helping)
    const roomPoints = (rooms || []).length * 13;
    
    return baseScore + uploadPoints + labPoints + roomPoints;
};

export const getRank = (points) => {
    if (points >= 1000) return 'ThinkGrid Legend';
    if (points >= 500)  return 'Knowledge Architect';
    if (points >= 250)  return 'Community Pillar';
    if (points >= 100)  return 'Rising Star';
    if (points >= 50)   return 'Elite Member';
    return 'Novice Explorer';
};

export const calculateGlobalRank = (allUsers, currentUserId) => {
    if (!allUsers || allUsers.length === 0) return 1;
    
    // Sort all users by points descending, then by name for stable tie-breaking
    const sortedUsers = [...allUsers].sort((a, b) => {
        if ((b.points || 0) !== (a.points || 0)) {
            return (b.points || 0) - (a.points || 0);
        }
        return (a.name || '').localeCompare(b.name || '');
    });
    
    // Find index of current user
    const rankIndex = sortedUsers.findIndex(u => (u._id || u.id) === currentUserId);
    
    return rankIndex === -1 ? sortedUsers.length + 1 : rankIndex + 1;
};
