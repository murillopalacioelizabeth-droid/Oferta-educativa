import { TrainingProgram, EnrollmentTimelineStep } from './types';

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  // --- OPERARIO LEVEL ---
  {
    id: 'op-deportiva',
    name: 'Operario en Manejo de Máquinas de Confección Industrial de Ropa Deportiva',
    level: 'Operario',
    duration: '6 meses (880 horas totales)',
    stageLectiva: '3 meses en talleres del centro',
    stageProductiva: '3 meses de práctica empresarial',
    schedule: 'Mañana, Tarde o Noche',
    requirements: [
      'Presentar documento de identidad original y copia.',
      'Edad mínima: 15 años cumplidos.',
      'Nivel escolar: Mínimo 5º grado de primaria aprobado.',
      'Estar registrado e inscrito en la plataforma SofiaPlus.'
    ],
    description: 'Aprende a confeccionar prendas deportivas de alto rendimiento con estándares de calidad industrial, abarcando desde camisetas técnicas y sudaderas, hasta licras y chaquetas rompevientos.',
    profile: 'Al egresar, sabrás ensamblar prendas deportivas ajustando tensiones, puntadas y guías especiales, logrando costuras elásticas y resistentes que exige el mercado de activewear y ropa de alto desempeño.',
    competencies: [
      'Operar máquinas de confección industrial (Plana, Fileteadora, Collarín).',
      'Ensamblar piezas de ropa deportiva siguiendo fichas técnicas.',
      'Controlar la calidad del producto en proceso de confección.',
      'Aplicar normas de seguridad y salud en el trabajo textil.'
    ],
    machinesUsed: [
      'Máquina Plana Industrial (Costura recta)',
      'Máquina Fileteadora con Pegador de Elástico / Overlock',
      'Máquina Collarín o Covertera (Para dobladillos elásticos y asentados)',
      'Encintadora de costuras impermeables'
    ],
    fieldsOfAction: [
      'Confeccionista en empresas de marcas de ropa deportiva y activewear.',
      'Operario de ensamble y control de calidad textil.',
      'Taller satélite de confección deportiva independiente.',
      'Emprendedor de su propia marca de prendas deportivas locales.'
    ],
    genderPopularity: 'Altamente demandado por clústeres deportivos y marcas de moda fitness en Antioquia.'
  },
  {
    id: 'op-interior',
    name: 'Operario en Manejo de Máquinas de Confección Industrial para Ropa Interior',
    level: 'Operario',
    duration: '6 meses (880 horas totales)',
    stageLectiva: '3 meses de formación presencial',
    stageProductiva: '3 meses de etapa productiva en empresa',
    schedule: 'Mañana, Tarde o Noche',
    requirements: [
      'Presentar documento de identidad original y copia.',
      'Edad mínima: 15 años cumplidos.',
      'Nivel escolar: Mínimo 5º grado de primaria aprobado.',
      'Estar registrado e inscrito en la plataforma SofiaPlus.'
    ],
    description: 'Especialízate en el manejo de telas elásticas, encajes finos, sesgos elásticos y costuras delicadas necesarias para confeccionar panties, boxers, brasieres, tops y prendas de dormir de alta precisión.',
    profile: 'Desarrollarás la destreza para manipular materiales livianos y altamente elásticos con extrema precisión, garantizando costuras suaves, simétricas y cómodas que no maltraten la piel.',
    competencies: [
      'Regular la tensión y alimentación de elásticos en máquinas especializadas.',
      'Enhebrar y configurar máquinas industriales para hilos de helanca y licra.',
      'Armar estructuras completas de lencería y ropa interior fina.',
      'Reconocer y solucionar defectos de costura comunes en telas elásticas.'
    ],
    machinesUsed: [
      'Máquina Collarín con dosificador de elástico',
      'Máquina Fileteadora de 3 y 4 hilos',
      'Máquina Zig-Zag de Alta Velocidad (Zigzag de 3 puntadas o tricot)',
      'Máquina Plana de 1 aguja con transporte diferencial'
    ],
    fieldsOfAction: [
      'Operario de costura para reconocidas firmas de lencería y ropa interior.',
      'Inspector de costura y calidad en plantas de confección especializadas.',
      'Emprendimiento independiente de ropa interior personalizada.',
      'Trabajo en cooperativas y talleres de confección de la región.'
    ],
    genderPopularity: 'Antioquia lidera la confección de ropa interior en el país; excelente empleabilidad.'
  },
  {
    id: 'op-denim',
    name: 'Operario en Manejo de Máquinas de Confección Industrial para Prendas en Denim (Jean)',
    level: 'Operario',
    duration: '6 meses (880 horas totales)',
    stageLectiva: '3 meses teórico-prácticos',
    stageProductiva: '3 meses de práctica laboral',
    schedule: 'Mañana, Tarde',
    requirements: [
      'Presentar documento de identidad original y copia.',
      'Edad mínima: 15 años de edad.',
      'Nivel escolar: Mínimo 5º grado de primaria aprobado.',
      'Estar registrado en el portal SofiaPlus.'
    ],
    description: 'Domina los procesos de confección de prendas pesadas y rígidas como jeans, chaquetas de jean, faldas, petos y camisas de denim, manejando costuras reforzadas, pespuntes decorativos y herrajes industriales.',
    profile: 'Estarás entrenado para operar con rapidez máquinas pesadas de motor potente, manejando gruesos calibres de hilos y agujas, y aplicando metodologías de ensamble rápido de piezas.',
    competencies: [
      'Coser mezclilla o denim con agujas y calibres pesados.',
      'Armar bolsillos, portañuelas, tiros y pretinas de pantalones.',
      'Manejar guías aéreas y folders de costuras francesas u ocultas.',
      'Inspeccionar el producto terminado antes de procesos de lavandería.'
    ],
    machinesUsed: [
      'Máquina Plana Pesada (Para telas gruesas)',
      'Máquina Cerradora de Codo de 2 y 3 agujas (Para uniones reforzadas fuertes)',
      'Máquina Presilladora (Para rematar esquinas de bolsillos y pasadores)',
      'Máquina Ojaladora de Ojo (Ojales de jean con gota)'
    ],
    fieldsOfAction: [
      'Operario experto en ensamble de jeans en medianas y grandes textileras.',
      'Auxiliar técnico en procesos de pre-lavado y terminados de denim.',
      'Emprendedor independiente de confección resistente para dotaciones o moda.',
      'Líder de módulo en plantas de confección masiva.'
    ],
    genderPopularity: 'Sector altamente relevante en Medellín e Itagüí, con marcas globales de mezclilla.'
  },
  {
    id: 'op-exterior',
    name: 'Operario en Manejo de Máquinas de Confección Industrial de Ropa Exterior',
    level: 'Operario',
    duration: '6 meses (880 horas totales)',
    stageLectiva: '3 meses',
    stageProductiva: '3 meses',
    schedule: 'Mañana, Tarde o Noche',
    requirements: [
      'Presentar documento de identidad original y copia.',
      'Edad mínima: 15 años.',
      'Nivel escolar: Mínimo 5º grado de primaria.',
      'Estar inscrito en SofiaPlus.'
    ],
    description: 'Confecciona una amplia gama de vestuario exterior cotidiano y de moda rápida: camisas clásicas, blusas fluidas, vestidos, pantalones tipo sastre y chaquetas casuales de uso diario.',
    profile: 'Serás un operario versátil capaz de adaptarte a diferentes siluetas, tipos de tela (tejido de punto y plano) y requerimientos de diseño cambiantes que exigen las marcas del Fast Fashion.',
    competencies: [
      'Ensamblar pantalones, camisas, faldas y blusas según la ficha técnica.',
      'Operar con agilidad máquinas industriales regulando velocidades.',
      'Instalar cremalleras invisibles, cuellos y puños estructurados.',
      'Efectuar reparaciones básicas y mantenimiento preventivo a las máquinas.'
    ],
    machinesUsed: [
      'Máquinas Planas Electrónicas con cortahilos',
      'Fileteadoras con puntada de seguridad',
      'Dobladilladora de puntada invisible o festonera',
      'Fusionadora de entretelas pequeña'
    ],
    fieldsOfAction: [
      'Confeccionista en plantas satélites de moda y vestuario casual.',
      'Auxiliar de operario para prototipos en departamentos de diseño.',
      'Operador de módulo de ensamble multiprenda.',
      'Montaje de taller propio de reparación, ajustes y confección de moda exterior.'
    ],
    genderPopularity: 'El pilar fundamental de la industria de la moda en Antioquia, excelente puente de empleo.'
  },
  {
    id: 'op-corte',
    name: 'Operario en Corte Industrial de Material Textil',
    level: 'Operario',
    duration: '6 meses (880 horas totales)',
    stageLectiva: '3 meses intensivos',
    stageProductiva: '3 meses en talleres o plantas reales',
    schedule: 'Mañana, Tarde',
    requirements: [
      'Presentar documento de identidad.',
      'Edad mínima: 15 años.',
      'Nivel de estudios: Mínimo 5º primaria aprobado.',
      'Habilidades psicomotrices óptimas para el manejo de herramientas de corte.'
    ],
    description: 'Aprende a preparar, trazar, tender y cortar diferentes capas de telas utilizando cortadoras verticales, circulares y sistemas automatizados, garantizando el máximo aprovechamiento del material sin desperdicios.',
    profile: 'Capacitado para planificar la distribución del trazo óptimo, tender metros de tela de manera simétrica y cortar con absoluta precisión las piezas de los moldes que pasarán a costura.',
    competencies: [
      'Analizar fichas técnicas de trazo para calcular el consumo textil.',
      'Programar y realizar tendido de telas de punto y plano.',
      'Operar sierras de cinta, cortadoras verticales manuales y de disco.',
      'Aplicar estrictas medidas de seguridad (uso de guantes de malla de acero).'
    ],
    machinesUsed: [
      'Cortadora Vertical de Hoja Recta (8 a 10 pulgadas)',
      'Cortadora de Disco Giratorio manual',
      'Mesa de tendido industrial con soplado y pinzas de sujeción',
      'Sierra de cinta fija (Troqueladora de cinta sin fin)'
    ],
    fieldsOfAction: [
      'Operario cortador en jefaturas de corte de grandes textileras.',
      'Auxiliar de tendido y tizado en empresas de moda.',
      'Clasificador y despachador de lotes de corte para talleres satélites.',
      'Controlador de inventarios de rollos de tela y retazos.'
    ],
    genderPopularity: 'Es una labor estratégica de planta con gran remuneración y alta demanda de personal calificado.'
  },

  // --- TÉCNICO LEVEL ---
  {
    id: 'tec-patronaje',
    name: 'Técnico en Patronaje Industrial de Prendas de Vestir',
    level: 'Técnico',
    duration: '1 año (2200 horas)',
    stageLectiva: '6 meses presenciales en aulas tecnológicas',
    stageProductiva: '6 meses de etapa práctica o contrato de aprendizaje',
    schedule: 'Mañana, Tarde, Noche o Mixto',
    requirements: [
      'Documento de identidad vigente (Tarjeta de Identidad o Cédula).',
      'Edad mínima: 16 años.',
      'Nivel escolar mínimo: Haber aprobado 9º de bachillerato.',
      'Inscripción aprobada por pruebas del SENA.'
    ],
    description: 'Conviértete en el traductor de las ideas del diseñador: aprende a estructurar y dibujar moldes físicos y digitales, realizar progresiones de tallas (escalado) y verificar que las prendas hormen y queden perfectas.',
    profile: 'Al terminar, dominarás el desarrollo de moldería básica y transformaciones de diseño para mujer, hombre e infantil. Sabrás patronar de forma manual en mesa y usar software especializado de patronaje por computadora (CAD).',
    competencies: [
      'Elaborar moldes base de vestuario según tablas de medidas y diseños.',
      'Realizar escalado industrial de patrones a diferentes curvas de tallas.',
      'Utilizar herramientas digitales CAD para trazo y optimización textil.',
      'Verificar la usabilidad y ensamble de muestras de confección.'
    ],
    machinesUsed: [
      'Software CAD de Patronaje y Trazo (Gerber, Lectra u Optitex)',
      'Plóter industrial para impresión de moldes de trazo ancho',
      'Mesa de patronaje ergonómica con reglas y curvígrafos',
      'Maniquíes de prueba de horma industrial'
    ],
    fieldsOfAction: [
      'Patronista industrial en departamentos de desarrollo de producto.',
      'Escalador técnico de tallas en textileras.',
      'Analista técnico de horma y muestras de confección.',
      'Prestador de servicios de moldería digital y asesoría a microempresas.'
    ],
    genderPopularity: 'Es una de las profesiones más valoradas y mejor pagadas en el sector textil de Antioquia.'
  },
  {
    id: 'tec-mantenimiento',
    name: 'Técnico en Mantenimiento de Máquinas de Confección Industrial',
    level: 'Técnico',
    duration: '1 año (2200 horas)',
    stageLectiva: '6 meses en laboratorios mecánicos',
    stageProductiva: '6 meses de internado industrial / práctica',
    schedule: 'Mañana, Noche',
    requirements: [
      'Copia del documento de identidad ampliado al 150%.',
      'Edad mínima: 16 años.',
      'Nivel de escolaridad: Haber aprobado 9º grado de secundaria.',
      'Superación de las fases de admisibilidad del SENA.'
    ],
    description: 'Adquiere el conocimiento técnico para diagnosticar, reparar, ajustar y sincronizar todo el parque automotor de costura del sector industrial: desde una máquina plana convencional hasta ojaladoras automáticas de alta tecnología.',
    profile: 'Asegurarás el correcto funcionamiento de las líneas de producción textil. Podrás sincronizar lanzaderas, ajustar barras de aguja, reparar motores direct drive (servomotores) y reconfigurar sensores electrónicos de costura.',
    competencies: [
      'Efectuar mantenimiento preventivo y mecánico a máquinas de coser.',
      'Sincronizar tiempos de aguja y looper en fileteadoras y collarines.',
      'Diagnosticar fallas mecánicas, neumáticas y electrónicas en las máquinas.',
      'Gestionar repuestos y lubricación programada en módulos productivos.'
    ],
    machinesUsed: [
      'Equipos de diagnóstico mecánico general y calibradores pie de rey',
      'Máquinas industriales de ciclo programado mecanizadas',
      'Instrumentos de medición eléctrica (Multímetro, osciloscopio básico)',
      'Máquinas Flat Seamer (costuras planas en paralelo de alta gama)'
    ],
    fieldsOfAction: [
      'Mecánico de planta en medianas y grandes textileras.',
      'Asesor técnico o vendedor de repuestos y maquinaria para confección.',
      'Técnico de servicio independiente para talleres satélites locales.',
      'Líder de mantenimiento en cooperativas de confección de Antioquia.'
    ],
    genderPopularity: 'Existe una altísima escasez de mecánicos de confección calificados; la empleabilidad roza el 100%.'
  },

  // --- TECNÓLOGO LEVEL ---
  {
    id: 'tg-mercadeo',
    name: 'Tecnólogo en Desarrollo de Procesos de Mercadeo',
    level: 'Tecnólogo',
    duration: '2 años (3960 horas totales)',
    stageLectiva: '18 meses presenciales y virtuales',
    stageProductiva: '6 meses de pasantía, contrato de aprendizaje o proyecto de grado',
    schedule: 'Mañana, Noche o Mixto',
    requirements: [
      'Copia del acta o diploma de grado de Bachiller (Grado 11 aprobado).',
      'Haber presentado las pruebas de Estado de educación media (ICFES / Saber 11).',
      'Edad mínima: 16 años.',
      'Estar inscrito y superar las evaluaciones del SENA SofiaPlus.'
    ],
    description: 'Especialízate en liderar investigaciones de mercado, estructurar estrategias de comercialización de moda, organizar eventos promocionales y gestionar la marca de colecciones de vestuario tanto física como digitalmente.',
    profile: 'Serás un profesional capaz de estructurar planes de marketing estratégico para el sector textil, analizar tendencias de consumo (coolhunting), formular estrategias de fijación de precios y coordinar campañas de comercio electrónico.',
    competencies: [
      'Estructurar el plan de mercadeo de bienes y servicios para la moda.',
      'Realizar investigaciones de mercado cualitativas y cuantitativas.',
      'Desarrollar canales de distribución y estrategias de venta omnicanal.',
      'Monitorear indicadores de rendimiento (KPIs) comerciales.'
    ],
    machinesUsed: [
      'Software de analítica web e investigación de mercados',
      'Herramientas CRM para fidelización y bases de datos',
      'Plataformas de comercio electrónico y gestión comercial digital',
      'Sistemas de gestión empresarial ERP (módulo mercadeo)'
    ],
    fieldsOfAction: [
      'Coordinador de marketing o mercadeo en marcas de vestuario.',
      'Visual Merchandiser o administrador de tiendas de moda de la región.',
      'Especialista en mercadeo digital o Community Manager de modas.',
      'Consultor o analista de tendencias e investigación de mercados minoristas.'
    ],
    genderPopularity: 'Un perfil clave en Medellín para exportar moda de Antioquia a mercados de Estados Unidos, México y Europa.'
  },
  {
    id: 'tg-software',
    name: 'Tecnólogo en Análisis y Desarrollo de Software',
    level: 'Tecnólogo',
    duration: '2 años (3960 horas totales)',
    stageLectiva: '18 meses b-learning',
    stageProductiva: '6 meses de etapa práctica o proyecto tecnológico',
    schedule: 'Mañana, Tarde o Noche',
    requirements: [
      'Diploma de Bachiller Académico (Grado 11 culminado).',
      'Haber presentado obligatoriamente la prueba de Estado saber 11 (ICFES).',
      'Edad mínima: 16 años.',
      'Estar inscrito y aprobar el riguroso proceso de selección en SofiaPlus.'
    ],
    description: 'Se forma en codificar, construir y diseñar aplicaciones, bases de datos, APIs y portales interactivos aplicados a la transformación tecnológica del sector textil, moda o empresarial general.',
    profile: 'Profesional de la tecnología capaz de recopilar requisitos de software, diseñar bases de datos robustas, codificar en backend y frontend con lenguajes modernos y desplegar aplicaciones para optimizar cadenas de confección.',
    competencies: [
      'Levantar requerimientos y diseñar la arquitectura global del software.',
      'Desarrollar componentes de software frontend (React, JavaScript/TypeScript) y backend.',
      'Configurar y consultar bases de datos relacionales y no relacionales.',
      'Efectuar pruebas de calidad (QA), control de versiones y despliegue continuo.'
    ],
    machinesUsed: [
      'Entornos de desarrollo interactivo (VS Code, JetBrains)',
      'Sistemas Git de control de versiones y repositorios en la nube',
      'Servidores e infraestructura de desarrollo local/contenedores',
      'Herramientas de testing y software de diseño de bases de datos'
    ],
    fieldsOfAction: [
      'Desarrollador Full-Stack Junior en empresas de tecnología locales.',
      'Analista de sistemas o QA tester en fábricas de software.',
      'Ingeniero de soporte de IT orientado al sector de producción textil.',
      'Consultor independiente o creador de software ERP para talleres satélites y PyMes.'
    ],
    genderPopularity: 'La tecnología de software impulsa la digitalización de la industria de la moda (ERP, eCommerce, logística). Alto empleo.'
  }
];

export const FAQ_DATA = [
  {
    q: '¿La formación en el SENA Calatrava cuesta algo?',
    a: '¡Ningún valor, mijo! Todos los programas de formación que imparte el SENA son 100% gratuitos y financiados por el Estado colombiano. No dejes que nadie te cobre por inscripciones, formularios o exámenes; el proceso es transparente y libre de roscas.'
  },
  {
    q: '¿Qué apoyos socioeconómicos ofrece este centro?',
    a: 'El centro tiene varios beneficios para apoyarte si los recursos están escasos: contamos con Apoyos de Alimentación (almuerzo gratuito en el casino), Subsidio de Transporte bajo convenios de la Alcaldía de Itagüí, y el Apoyo de Sostenimiento de FIC para aprendices de construcción/confección que demuestren condiciones de vulnerabilidad.'
  },
  {
    q: '¿Dónde queda exactamente la sede del centro?',
    a: 'Estamos ubicados en Itagüí, Antioquia, en el sector de Calatrava (Calle 63 sur # 55-15). La sede cuenta con amplios talleres industriales de costura, laboratorios CAD de punta, zonas de esparcimiento verde, cafetería y biblioteca. El transporte integrado del Metro tiene rutas que te dejan directamente en la puerta.'
  },
  {
    q: '¿Qué es el Fondo Emprender y cómo me ayuda a crear marca?',
    a: 'Ave María, ¡es un orgullo del SENA! Si terminas el Técnico en Patronaje o un Tecnólogo y tienes una idea berraca para montar tu propia marca de ropa interior, deportiva o jeans, el Fondo Emprender te brinda capital semilla condonable (que no debes devolver) y asesoría técnica para poner a rodar tu negocio.'
  },
  {
    q: '¿Qué es la Etapa Productiva?',
    a: 'Es la fase práctica del programa, ¡donde te untás del mundo real! Dura de 3 a 6 meses (según el nivel). La haces trabajando directamente en una empresa del sector (como Leonisa, GEF, C.I. Jeans, etc.) bajo un contrato de aprendizaje, donde te pagan el 75% o 100% del Salario Mínimo más seguridad social. ¡La mejor manera de quedar contratado fijo!'
  },
  {
    q: '¿Qué requisitos cambian entre Operario, Técnico y Tecnólogo?',
    a: 'Ponele cuidado, pues:\n- **Operario:** Mínimo 5º de primaria y tener 15 años.\n- **Técnico:** Mínimo 9º de bachillerato aprobado y tener 16 años.\n- **Tecnólogo:** Mínimo Título de Bachiller Académico (11º culminado) y haber presentado la prueba nacional ICFES Saber 11, además de tener 16 años.'
  },
  {
    q: '¿Cuándo son las fechas de inscripción para el 2026?',
    a: 'El SENA abre inscripciones trimestralmente (Febrero, Mayo, Agosto y Noviembre) para programas presenciales, y de manera continua para programas virtuales. Te recomendamos consultar constantemente SofiaPlus. ¡Nuestra IA te puede dar las pautas exactas!'
  }
];

export const ENROLLMENT_STEPS: EnrollmentTimelineStep[] = [
  {
    id: 1,
    title: 'Registro Inicial',
    subtitle: 'Crear cuenta en SofiaPlus',
    description: 'Ingresa al portal www.senasofiaplus.edu.co. Registra tus datos personales con tu número de documento de identidad fiel a la realidad. ¡Asegura bien tu contraseña que no se te olvide!',
    dateEst: 'Permanente',
    status: 'completado'
  },
  {
    id: 2,
    title: 'Carga de Documentos',
    subtitle: 'Requisitos Básicos',
    description: 'Carga la copia en PDF de tu documento al portal. Elige tu programa de preferencia del SENA Calatrava y suscríbete apenas abra la convocatoria.',
    dateEst: 'Fechas de Convocatoria',
    status: 'en_curso'
  },
  {
    id: 3,
    title: 'Prueba Fase I',
    subtitle: 'Prueba Virtual de Aptitud',
    description: 'Realizas una prueba virtual de selección múltiple enfocada en lógica, competencias básicas y compresión lectora. Debes ingresar el día asignado según el último número de tu cédula.',
    dateEst: '5 a 8 días después de inscribirte',
    status: 'proximo'
  },
  {
    id: 4,
    title: 'Prueba Fase II',
    subtitle: 'Evaluación Técnica / Psicotécnica',
    description: 'Para algunos niveles como Tecnólogos o Técnicos específicos, te citaremos a los talleres físicos de Calatrava para un taller práctico, entrevista o prueba actitudinal presencial.',
    dateEst: '15 días después de la Fase I',
    status: 'proximo'
  },
  {
    id: 5,
    title: 'Matrícula Oficial',
    subtitle: 'Entrega de Papeles y Examen',
    description: 'Si fuiste preseleccionado, deberás enviar los documentos oficiales en formato digital o físico (Diploma de Bachiller, ICFES para tecnólogos, examen médico laboral cubierto por el SENA, etc.).',
    dateEst: '1 semana antes de clases',
    status: 'proximo'
  },
  {
    id: 6,
    title: 'Inducción e Inicio',
    subtitle: 'Primer día de taller presencial',
    description: '¡Bienvenido, mijo! Comienzas tu inducción general en la sede de Calatrava, Itagüí. Conocerás los talleres, las normas de confección, tus instructores y empezarás el camino textil.',
    dateEst: 'Fecha oficial de inicio',
    status: 'proximo'
  }
];

export const GENERAL_INFO = {
  centerName: 'Centro de Formación en Diseño, Confección y Moda — Regional Antioquia',
  location: 'Sede Calatrava (Calle 63 sur # 55-15, Itagüí, Antioquia)',
  phone: '01 8000 910270 (Sugerencias)',
  mainAgencies: [
    { name: 'Agencia Pública de Empleo (APE) SENA', desc: 'Te conecta en tiempo real con las mejores ofertas laborales del clúster textil de Antioquia. Es una bolsa de empleo gratuita.' },
    { name: 'Fondo Emprender', desc: 'Apoyo para mentes creativas del diseño y confección con capital semilla de hasta 80 millones de pesos no reembolsables si cumples el plan de negocio.' },
    { name: 'Bienestar al Aprendiz', desc: 'Gestiones para apoyos socioeconómicos de transporte, almuerzos, actividades lúdicas, apoyo psicológico e integral.' }
  ]
};
