export default async function handler(req, res) {
  // التحقق من الطريقة
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // الحصول على المسار من query أو body
  const path = req.method === 'GET' ? req.query.path : req.body.path;

  if (!path) {
    return res.status(400).json({ message: 'Path is required' });
  }

  try {
    // تنفيذ revalidation
    await res.revalidate(path);
    
    return res.json({ 
      revalidated: true, 
      path,
      message: `تم تحديث الصفحة: ${path}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ 
      revalidated: false,
      message: 'خطأ في تحديث الصفحة',
      error: err.message 
    });
  }
}
