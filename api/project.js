import db from '../lib/db';

export default async function handler(req, res) {
  try {
    // Correct logic using the 'projects' table name directly
    const result = await db.execute("SELECT * FROM projects LIMIT 10");
    
    return res.status(200).json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error("SQL Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to fetch project data" 
    });
  }
}
