import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    // GET - جلب جميع المنتجات أو منتج واحد
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        // جلب منتج واحد
        const { data, error } = await supabase
          .from('products')
          .select('*, families(id, name, slug)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return res.status(200).json(data);
      }
      
      // جلب جميع المنتجات
      const { data, error } = await supabase
        .from('products')
        .select('*, families(id, name, slug)')
        .order('name');

      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST - إضافة منتج جديد
    if (req.method === 'POST') {
      const { name, slug, description, family_id } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'الاسم والـ slug مطلوبان' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          slug, 
          description: description || null,
          family_id: family_id || null
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT - تحديث منتج
    if (req.method === 'PUT') {
      const { id, name, slug, description, family_id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'معرف المنتج مطلوب' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (slug) updateData.slug = slug;
      if (description !== undefined) updateData.description = description || null;
      if (family_id !== undefined) updateData.family_id = family_id || null;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE - حذف منتج
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'معرف المنتج مطلوب' });
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in products API:', error);
    return res.status(500).json({ error: error.message });
  }
}
