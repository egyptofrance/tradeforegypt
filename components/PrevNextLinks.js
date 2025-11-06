import Link from 'next/link';

/**
 * PrevNextLinks Component
 * روابط الصفحة السابقة والتالية
 */
export default function PrevNextLinks({ prev, next }) {
  const KEYWORD_TRANSLATIONS = {
    'agency': 'توكيل',
    'customer-service': 'خدمة عملاء',
    'hotline': 'خط ساخن',
    'maintenance': 'صيانة',
    'numbers': 'أرقام',
    'warranty': 'ضمان'
  };
  
  const getPrevText = () => {
    if (!prev) return null;
    const keyword = KEYWORD_TRANSLATIONS[prev.keyword] || prev.keyword;
    return `السابق: ${keyword}`;
  };
  
  const getNextText = () => {
    if (!next) return null;
    const keyword = KEYWORD_TRANSLATIONS[next.keyword] || next.keyword;
    return `التالي: ${keyword}`;
  };
  
  return (
    <nav className="prev-next-links" aria-label="التنقل بين الصفحات">
      <div className="prev-next-container">
        {prev && (
          <Link 
            href={`/${prev.brand}/${prev.product}/${prev.keyword}`}
            className="prev-link"
            rel="prev"
          >
            <span className="arrow">‹</span>
            <span className="text">{getPrevText()}</span>
          </Link>
        )}
        
        {next && (
          <Link 
            href={`/${next.brand}/${next.product}/${next.keyword}`}
            className="next-link"
            rel="next"
          >
            <span className="text">{getNextText()}</span>
            <span className="arrow">›</span>
          </Link>
        )}
      </div>
      
      <style jsx>{`
        .prev-next-links {
          margin: 3rem 0;
          padding: 2rem 0;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .prev-next-container {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .prev-link,
        .next-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #f5f5f5;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s;
          flex: 1;
          max-width: 45%;
        }
        
        .prev-link {
          justify-content: flex-start;
        }
        
        .next-link {
          justify-content: flex-end;
          margin-left: auto;
        }
        
        .prev-link:hover,
        .next-link:hover {
          background: #0066cc;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .arrow {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .text {
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .prev-next-container {
            flex-direction: column;
          }
          
          .prev-link,
          .next-link {
            max-width: 100%;
          }
          
          .text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </nav>
  );
}
