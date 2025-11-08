import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    // GET - جلب جميع العائلات
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .order('name');

      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST - إضافة عائلة جديدة
    if (req.method === 'POST') {
      const { name, slug, description } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'الاسم والـ slug مطلوبان' });
      }

      const { data, error } = await supabase
        .from('families')
        .insert([{ name, slug, description }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT - تحديث عائلة
    if (req.method === 'PUT') {
      const { id, name, slug, description } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'معرف العائلة مطلوب' });
      }

      const { data, error } = await supabase
        .from('families')
        .update({ name, slug, description })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE - حذف عائلة
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'معرف العائلة مطلوب' });
      }

      const { error } = await supabase
        .from('families')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'تم حذف العائلة بنجاح' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in families API:', error);
    return res.status(500).json({ error: error.message });
  }
}
