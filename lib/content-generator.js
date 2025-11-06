// ============================================
// Trade for Egypt - Content Generator
// ============================================
// توليد المحتوى التلقائي لكل صفحة
// ============================================

// ترجمة الكلمات المفتاحية
const KEYWORD_TRANSLATIONS = {
  'agency': 'توكيل',
  'customer-service': 'خدمة عملاء',
  'hotline': 'خط ساخن',
  'maintenance': 'صيانة',
  'numbers': 'أرقام',
  'warranty': 'ضمان'
};

/**
 * توليد مقدمة الصفحة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @param {Object} family - بيانات العائلة
 * @returns {string} - المقدمة
 */
export function generateIntro(brand, product, keyword, family) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const intros = {
    'agency': [
      `مرحباً بك في دليل ${keywordAr} ${brand.name} ${product.name} الشامل في مصر. نوفر لك جميع المعلومات التي تحتاجها للتواصل مع ${keywordAr} ${brand.name} الرسمي، بما في ذلك العناوين وأرقام الهاتف ومواعيد العمل. ${brand.name} هي واحدة من أشهر العلامات التجارية في مجال ${family.name}، وتقدم منتجات عالية الجودة مع خدمة عملاء ممتازة.`,
      
      `إذا كنت تبحث عن ${keywordAr} ${brand.name} ${product.name} في مصر، فأنت في المكان الصحيح. نقدم لك دليلاً شاملاً يحتوي على جميع معلومات التواصل مع ${keywordAr} ${brand.name} الرسمي. ${brand.name} معروفة بجودة منتجاتها في ${family.name} وخدمة ما بعد البيع الممتازة.`,
      
      `دليل ${keywordAr} ${brand.name} ${product.name} الكامل في مصر. احصل على عناوين وأرقام ${keywordAr} ${brand.name} المعتمد، مع معلومات مفصلة عن الخدمات المقدمة. ${brand.name} تتميز بتقديم أفضل منتجات ${family.name} مع دعم فني متميز.`
    ],
    
    'maintenance': [
      `هل تحتاج إلى ${keywordAr} ${brand.name} ${product.name}؟ نوفر لك دليلاً شاملاً لجميع مراكز ${keywordAr} ${brand.name} المعتمدة في مصر. احصل على أرقام وعناوين مراكز ${keywordAr} ${brand.name} مع معلومات عن الخدمات والأسعار. ${brand.name} توفر خدمة ${keywordAr} احترافية لجميع منتجات ${family.name}.`,
      
      `مراكز ${keywordAr} ${brand.name} ${product.name} المعتمدة في مصر. دليل شامل يحتوي على عناوين وأرقام جميع مراكز ${keywordAr} ${brand.name}، مع معلومات عن مواعيد العمل والخدمات المتاحة. ${brand.name} تضمن لك ${keywordAr} عالية الجودة لمنتجات ${family.name}.`,
      
      `احصل على أفضل خدمة ${keywordAr} لـ ${brand.name} ${product.name} في مصر. نقدم لك دليلاً كاملاً لمراكز ${keywordAr} ${brand.name} المعتمدة مع أرقام التواصل والعناوين. ${brand.name} معروفة بجودة ${keywordAr} منتجات ${family.name}.`
    ],
    
    'warranty': [
      `معلومات ${keywordAr} ${brand.name} ${product.name} الكاملة في مصر. تعرف على شروط ${keywordAr} ${brand.name}، المدة، والتغطية. ${brand.name} توفر ${keywordAr} شامل لجميع منتجات ${family.name} مع خدمة ما بعد البيع الممتازة.`,
      
      `دليل ${keywordAr} ${brand.name} ${product.name} في مصر. احصل على معلومات مفصلة عن ${keywordAr} ${brand.name}، بما في ذلك المدة والشروط والتغطية. ${brand.name} تقدم أفضل ${keywordAr} لمنتجات ${family.name}.`,
      
      `كل ما تحتاج معرفته عن ${keywordAr} ${brand.name} ${product.name} في مصر. معلومات شاملة عن شروط ${keywordAr}، المدة، والخدمات المشمولة. ${brand.name} تضمن لك راحة البال مع ${keywordAr} شامل لمنتجات ${family.name}.`
    ],
    
    'customer-service': [
      `${keywordAr} ${brand.name} ${product.name} في مصر - دليل شامل. احصل على أرقام وعناوين ${keywordAr} ${brand.name} مع معلومات عن مواعيد العمل وطرق التواصل. ${brand.name} توفر ${keywordAr} ممتازة لجميع منتجات ${family.name}.`,
      
      `تواصل مع ${keywordAr} ${brand.name} ${product.name} في مصر. دليل كامل يحتوي على جميع طرق التواصل مع ${keywordAr} ${brand.name}، بما في ذلك الأرقام والعناوين ومواعيد العمل. ${brand.name} معروفة بـ${keywordAr} الممتازة في ${family.name}.`,
      
      `معلومات ${keywordAr} ${brand.name} ${product.name} الكاملة في مصر. احصل على أرقام التواصل، العناوين، ومواعيد العمل لـ${keywordAr} ${brand.name}. ${brand.name} تقدم دعماً متميزاً لعملاء ${family.name}.`
    ],
    
    'hotline': [
      `${keywordAr} ${brand.name} ${product.name} في مصر - اتصل الآن. احصل على أرقام ${keywordAr} ${brand.name} المجانية للتواصل السريع. ${brand.name} توفر ${keywordAr} متاح 24/7 لخدمة عملاء ${family.name}.`,
      
      `أرقام ${keywordAr} ${brand.name} ${product.name} في مصر. دليل شامل لجميع أرقام ${keywordAr} ${brand.name} المجانية مع مواعيد العمل. ${brand.name} تضمن لك تواصل سريع عبر ${keywordAr} لمنتجات ${family.name}.`,
      
      `تواصل مع ${brand.name} ${product.name} عبر ${keywordAr} في مصر. احصل على أرقام ${keywordAr} ${brand.name} المجانية للدعم الفوري. ${brand.name} توفر ${keywordAr} احترافي لعملاء ${family.name}.`
    ],
    
    'numbers': [
      `جميع ${keywordAr} ${brand.name} ${product.name} في مصر. دليل شامل يحتوي على ${keywordAr} التواصل، التوكيل، الصيانة، وخدمة العملاء. ${brand.name} توفر ${keywordAr} متعددة للتواصل مع عملاء ${family.name}.`,
      
      `${keywordAr} ${brand.name} ${product.name} الكاملة في مصر. احصل على جميع ${keywordAr} التواصل مع ${brand.name}، بما في ذلك التوكيل والصيانة والدعم الفني. ${brand.name} تسهل عليك التواصل مع ${keywordAr} متعددة لمنتجات ${family.name}.`,
      
      `دليل ${keywordAr} ${brand.name} ${product.name} في مصر. جميع ${keywordAr} التواصل مع ${brand.name} في مكان واحد، بما في ذلك التوكيل والصيانة وخدمة العملاء. ${brand.name} توفر ${keywordAr} شاملة لعملاء ${family.name}.`
    ]
  };
  
  const keywordIntros = intros[keyword] || intros['agency'];
  const hash = (brand.slug + product.slug + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % keywordIntros.length;
  return keywordIntros[index];
}

/**
 * توليد قسم عن الماركة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} family - بيانات العائلة
 * @returns {string} - محتوى عن الماركة
 */
export function generateBrandSection(brand, family) {
  const templates = [
    `${brand.name} هي واحدة من أشهر العلامات التجارية العالمية في مجال ${family.name}. تأسست الشركة منذ عقود وأصبحت رائدة في تقديم منتجات عالية الجودة مع خدمة عملاء ممتازة. ${brand.name} معروفة بالابتكار والجودة والموثوقية، وتوفر مجموعة واسعة من المنتجات التي تلبي احتياجات العملاء في مصر والعالم العربي.`,
    
    `تتميز ${brand.name} بتقديم أفضل منتجات ${family.name} في السوق المصري. الشركة لديها شبكة واسعة من التوكيلات ومراكز الصيانة المعتمدة في جميع أنحاء مصر، مما يضمن حصول العملاء على أفضل خدمة ما بعد البيع. ${brand.name} تستثمر باستمرار في تطوير منتجاتها وتحسين خدماتها لتلبية توقعات العملاء.`,
    
    `${brand.name} تقدم مجموعة متنوعة من منتجات ${family.name} التي تتميز بالجودة العالية والأسعار التنافسية. الشركة حاصلة على العديد من الشهادات والجوائز العالمية، وتحظى بثقة الملايين من العملاء حول العالم. في مصر، ${brand.name} لديها حضور قوي مع شبكة واسعة من الفروع ومراكز الخدمة.`
  ];
  
  const hash = brand.slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % templates.length;
  return templates[index];
}

/**
 * توليد قسم الخدمات
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - محتوى الخدمات
 */
export function generateServicesSection(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const services = {
    'agency': `يوفر ${keywordAr} ${brand.name} ${product.name} مجموعة واسعة من الخدمات، بما في ذلك:\n\n- بيع المنتجات الأصلية مع ضمان رسمي\n- استشارات مجانية لاختيار المنتج المناسب\n- خدمة التوصيل والتركيب\n- خدمة ما بعد البيع والدعم الفني\n- عروض وتخفيضات حصرية\n\nجميع فروع ${keywordAr} ${brand.name} مجهزة بأحدث التقنيات وتديرها كوادر مدربة لضمان أفضل تجربة للعملاء.`,
    
    'maintenance': `مراكز ${keywordAr} ${brand.name} ${product.name} المعتمدة تقدم:\n\n- ${keywordAr} دورية وطارئة لجميع المنتجات\n- قطع غيار أصلية مضمونة\n- فنيين معتمدين ومدربين\n- ضمان على أعمال ${keywordAr}\n- خدمة ${keywordAr} منزلية\n- أسعار تنافسية وشفافة\n\nجميع مراكز ${keywordAr} ${brand.name} معتمدة من الشركة الأم وتلتزم بأعلى معايير الجودة.`,
    
    'warranty': `${keywordAr} ${brand.name} ${product.name} يشمل:\n\n- ${keywordAr} شامل ضد عيوب الصناعة\n- مدة ${keywordAr} تختلف حسب المنتج (عادة 1-5 سنوات)\n- ${keywordAr} مجاني خلال فترة ${keywordAr}\n- استبدال المنتج في حالة العيوب المتكررة\n- دعم فني مجاني طوال فترة ${keywordAr}\n\nللاستفادة من ${keywordAr}، يجب الاحتفاظ بفاتورة الشراء وبطاقة ${keywordAr} الرسمية.`,
    
    'customer-service': `${keywordAr} ${brand.name} ${product.name} يوفر:\n\n- دعم فني عبر الهاتف والبريد الإلكتروني\n- استقبال الشكاوى والاقتراحات\n- متابعة طلبات ${keywordAr} والإصلاح\n- معلومات عن المنتجات والأسعار\n- حجز مواعيد ${keywordAr}\n- استشارات مجانية\n\nفريق ${keywordAr} ${brand.name} متاح خلال أوقات العمل الرسمية ويتحدث العربية والإنجليزية.`,
    
    'hotline': `${keywordAr} ${brand.name} ${product.name} يوفر:\n\n- تواصل سريع ومباشر مع ${brand.name}\n- دعم فني فوري\n- حجز مواعيد ${keywordAr}\n- الإبلاغ عن الأعطال\n- استفسارات عن المنتجات\n- متابعة الطلبات\n\n${keywordAr} ${brand.name} متاح خلال أوقات العمل الرسمية، وبعض الخطوط متاحة 24/7 للحالات الطارئة.`,
    
    'numbers': `${keywordAr} ${brand.name} ${product.name} تشمل:\n\n- رقم التوكيل الرئيسي\n- أرقام مراكز ${keywordAr}\n- رقم ${keywordAr} المجاني\n- أرقام خدمة العملاء\n- أرقام الفروع في المحافظات\n- أرقام الدعم الفني\n\nجميع ${keywordAr} محدثة ومتاحة خلال أوقات العمل الرسمية. يمكنك التواصل عبر الهاتف أو الواتساب.`
  };
  
  return services[keyword] || services['agency'];
}

/**
 * توليد خاتمة الصفحة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - الخاتمة
 */
export function generateConclusion(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const conclusions = [
    `نأمل أن يكون هذا الدليل قد ساعدك في العثور على ${keywordAr} ${brand.name} ${product.name} في مصر. ${brand.name} ملتزمة بتقديم أفضل المنتجات والخدمات لعملائها، ونحن نحدث هذه المعلومات باستمرار لضمان دقتها. إذا كان لديك أي استفسار، لا تتردد في التواصل مع ${brand.name} مباشرة.`,
    
    `${brand.name} ${product.name} هو خيار ممتاز لمن يبحث عن الجودة والموثوقية. مع شبكة واسعة من التوكيلات ومراكز الصيانة في مصر، ${brand.name} تضمن لك أفضل تجربة شراء وخدمة ما بعد البيع. استخدم المعلومات الموجودة في هذه الصفحة للتواصل مع ${keywordAr} ${brand.name} المعتمد.`,
    
    `شكراً لزيارتك لدليل ${keywordAr} ${brand.name} ${product.name}. نحن نسعى لتوفير أدق المعلومات وأحدثها لمساعدتك في الحصول على أفضل خدمة من ${brand.name}. إذا وجدت أي معلومات غير صحيحة أو قديمة، يرجى إبلاغنا لتحديثها.`
  ];
  
  const hash = (brand.slug + product.slug + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % conclusions.length;
  return conclusions[index];
}

/**
 * توليد محتوى الصفحة كاملاً
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @param {Object} family - بيانات العائلة
 * @returns {Object} - كائن يحتوي على جميع أجزاء المحتوى
 */
export function generatePageContent(brand, product, keyword, family) {
  return {
    intro: generateIntro(brand, product, keyword, family),
    brandSection: generateBrandSection(brand, family),
    servicesSection: generateServicesSection(brand, product, keyword),
    conclusion: generateConclusion(brand, product, keyword)
  };
}
