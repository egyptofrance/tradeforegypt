import Link from 'next/link';

/**
 * Breadcrumb Component
 * مسار التنقل (الرئيسية > الماركة > المنتج > الكلمة)
 */
export default function Breadcrumb({ brand, product, keyword }) {
  const KEYWORD_TRANSLATIONS = {
    'agency': 'توكيل',
    'customer-service': 'خدمة عملاء',
    'hotline': 'خط ساخن',
    'maintenance': 'صيانة',
    'numbers': 'أرقام',
    'warranty': 'ضمان'
  };
  
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  return (
    <nav className="breadcrumb" aria-label="مسار التنقل">
      <ol>
        <li>
          <Link href="/">الرئيسية</Link>
        </li>
        <li>
          <Link href={`/${brand.slug}`}>{brand.name}</Link>
        </li>
        <li>
          <Link href={`/${brand.slug}/${product.slug}`}>{product.name}</Link>
        </li>
        <li aria-current="page">{keywordAr}</li>
      </ol>
      
      <style jsx>{`
        .breadcrumb {
          padding: 1rem 0;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        ol {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
        }
        
        li {
          display: flex;
          align-items: center;
        }
        
        li:not(:last-child)::after {
          content: '›';
          margin-left: 0.5rem;
          color: #666;
          font-size: 1.2rem;
        }
        
        li a {
          color: #0066cc;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        li a:hover {
          color: #004499;
          text-decoration: underline;
        }
        
        li[aria-current="page"] {
          color: #333;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .breadcrumb {
            font-size: 0.9rem;
          }
          
          ol {
            gap: 0.3rem;
          }
        }
      `}</style>
    </nav>
  );
}
