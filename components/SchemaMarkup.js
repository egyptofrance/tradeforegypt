/**
 * SchemaMarkup Component
 * إضافة Schema.org JSON-LD للصفحة (للنجوم الصفراء)
 */
export default function SchemaMarkup({ schemas }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
