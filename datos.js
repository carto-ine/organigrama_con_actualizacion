// ============================================
// DATOS DEL ORGANIGRAMA
//
// Edita el CSV entre los backticks cuando cambien los datos.
// El campo parent_id indica el id del nodo padre directo.
// Déjalo vacío solo en la raíz (id=1).
//
// Columnas:
//   id           – identificador numérico único de la fila
//   jerarquia    – nivel en el organigrama (1=raíz)
//   pertenecia   – clave del departamento (SDSGE, DDHG, DAGG…)
//   jefe_directo – nombre del responsable del puesto (solo referencia visual)
//   puesto_actual– nombre completo del puesto
//   tipo         – DESPEN | HE | RA
//   cambio       – 0=sin cambio, 1=cambia
//   donde        – destino del cambio (N/A si no aplica)
//   nuevo_puesto – nombre del nuevo puesto (Sin cambio si no aplica)
//   nivel_tabular– clave tabular (XXX si no aplica)
//   parent_id    – id del nodo padre (vacío solo en la raíz)
// ============================================
window.__ORG__ = Object.freeze({
    csv: `id,jerarquia,pertenecia,jefe_directo,puesto_actual,tipo,cambio,donde,nuevo_puesto,nivel_tabular,parent_id
1,1,DCE,ojeda,Dirección de Cartografía Electoral,DESPEN,0,N/A,Sin cambio,XXX,
2,2,SDSGE,benjamín,Subdirección De Desarrollo De Sistemas Geográficos Electorales,DESPEN,0,N/A,Sin cambio,XXX,1
3,4,DCE,benjamín,Gestora Administrativa,RA,0,N/A,Sin cambio,XXX,1
4,4,DCE,benjamín,Asistente Informatica de Enlace,RA,0,N/A,Sin cambio,XXX,1
5,4,DCE,benjamín,Secretaria de Dirección de Área o Equivalente,RA,0,N/A,Sin cambio,XXX,1
6,4,DCE,benjamín,Especialista en Implementación de los Procesos y Servicios Cartograficos,HE,1,RA,Abogado de Procedimientos Administrativos,KA3,1
7,3,SDSGE,luis,Jefe De Departamento De Desarrollo De Herramientas Geoelectorales,DESPEN,0,N/A,Sin cambio,XXX,2
8,3,SDSGE,luis,Jefe De Departamento De Aplicación Geodésica Y Geomática,DESPEN,0,N/A,Sin cambio,XXX,2
9,3,SDSGE,luis,Líder De Migración De Bases Geográficas Digitales,HE,1,RA,Jefe de Departamento de Demarcaciones y SGC,LC4,2
10,4,DDHG,arthur,Líder De Análisis Y Calidad De Software Cartográfico,HE,1,RA,Coordinador/a Técnico/a de Sistemas Cloud,LC2,7
11,4,DDHG,arthur,Líder De Análisis Y Calidad De Software Cartográfico,HE,1,RA,Coordinador/a Técnico/a de Sistemas Geoespaciales,LC2,7
12,4,DDHG,arthur,Desarrollador De Sistemas Cartográficos De Consulta en Alto Volumen,HE,1,RA,Coordinador/a Técnico/a de Integración y Sistemas Transversales,LC2,7
13,4,DAGG,gerzain,Líder De Análisis Y Calidad De Software Cartográfico,HE,1,RA,Coordinador de Sistemas de Actualización Cartográfica,LC2,8
14,5,DDHG,javier,Desarrollador De Sistemas Cartográficos De Consulta en Alto Volumen,HE,1,RA,Ingeniero de Software Geoespacial FullStack,KC1,10
15,5,DDHG,javier,Programador Middle En Sistemas Cartográficos Electorales,HE,1,RA,Ingeniero de Software Geoespacial FullStack,KC1,10
16,5,DDHG,javier,Técnico En Desarrollo Y Administración De Base De Datos Geoelectorales,RA,1,RA,Líder de Automatización Geoespacial y Calidad de Software,KA3,10
17,5,DDHG,eduardo,Programador De Sistemas De Información Geográfico Electorales,HE,1,RA,Ingeniero de Software Geoespacial FullStack,KC1,11
18,5,DDHG,eduardo,Asistente En Supervisión De Información Geográfica Electoral,RA,1,RA,Líder de Automatización Geoespacial y Calidad de Software,KA3,11
19,5,DDHG,erick,Técnico Especialista En Pruebas Usuarias A Sistemas Cartográficos,HE,1,RA,Ingeniero de Software Geoespacial FullStack,KC1,12
20,5,DDHG,erick,Técnico De Aplicaciones Geoelectorales,RA,1,RA,Líder de Automatización Geoespacial y Calidad de Software,KA3,12
21,4,DDHG,arthur,Documentador Y Diseñador UX/UI,HE,1,RA,Ingeniero/a de Diseño de Producto y Servicios cartográficos,KA3,7
22,5,DAGG,adan,Programador Middle En Sistemas Cartográficos Elector,HE,1,RA,Subcordinador de Sistemas Geográfico,KC1,13
23,5,DAGG,adan,Desarrollador De Sistemas Cartográficos De Consulta en Alto Volumen,HE,1,RA,Nuevo Puesto,KC1,13
24,5,DAGG,adan,Desarrollador De Sistemas Cartográficos De Consulta en Alto Volumen,HE,1,RA,Nuevo Puesto,KC1,13
25,5,DAGG,adan,Desarrollador De Sistemas Cartográficos De Consulta en Alto Volumen,HE,1,RA,Nuevo Puesto,KC1,13
26,4,DAGG,gerzain,Asistente en Supervisión de Aplicaciones del Marco Geográfico Elector,RA,1,RA,Nuevo Puesto,KA3,8
27,4,DAGG,gerzain,Asistente en Supervisión de Infraestructura Tecnologica Cartográfica,RA,1,RA,Nuevo Puesto,KA3,8
28,4,DAGG,gerzain,Asistente en Supervisión de Infraestructura Tecnologica Cartográfica (HB3 - José Luis),RA,2,RA,Nuevo Puesto,KA3,8
29,4,DAGG,gerzain,Asistente de Servicios Cartográficos (HB3- Jaime Ruiz C.),RA,2,RA,Nuevo Puesto,KA3,8
30,4,DDTSG,machado,Especialista en Implementacion de Sistemas Cartográficos,HE,1,RA,Nuevo Puesto,JB1,9
31,4,DDTSG,machado,Profesional Especializado en Aplicaciones Cartográficas,HE,1,RA,Nuevo Puesto,JC2,9
32,4,DDTSG,machado,Subcoordinador de Consilta Indígena y Afromexican,HE,1,RA,Nuevo Puesto,LB2,9
33,4,DDTSG,machado,Especialista en Implementacion de Procesos y Servicios Cartográficos,HE,1,RA,Nuevo Puesto,JC2,9
34,4,DDTSG,machado,Especialista en Implementacion de Procesos y Servicios Cartográficos,HE,1,RA,Nuevo Puesto,JC2,9
35,4,DDTSG,machado,Analista de Bases Geográficas Electorales,HE,1,RA,Nuevo Puesto,HC4,9
36,4,DDTSG,machado,Asistente de Servicios Cartográficos,RA,0,N/A,Sin cambio,HB3,9
37,2,SAC,Benjamin,Subdirector de Automatización Cartográfica,DESPEN,0,N/A,Sin cambio,,1
38,4,SAC,Eduardo,Técnica en Validación Gráfica y Alfanumérica,RA,0,RA,Sin cambio,,37
39,3,DDPC,Eduardo,Jefe de Departamento de Diseño y Producción Cartográfica,DESPEN,0,N/A,Sin cambio,,37
40,3,DPIR,Eduardo,Jefa de Departamento de Procesamiento de Imágenes Raster,DESPEN,1,N/A,Jefa de Departamento de Integración de Catálogos Geoelectorales y Procesamiento de Imágenes Raster,,37
41,3,DIACCC,Eduardo,Jefa de Departamento de Integración Automatizadade la Cartografía y Control de Calidad,DESPEN,0,N/A,Sin cambio,,37
42,4,DDPC,Marco,Asistente en supervisión de Producción Cartográfica,RA,0,RA,Sin cambio,,39
43,4,DDPC,Marco,Técnica en Producción Cartográfica,RA,0,RA,Sin cambio,,39
44,4,DDPC,Marco,Técnico en Producción Cartográfica,RA,0,RA,Sin cambio,,39
45,4,DDPC,Marco,Técnico en Producción Cartográfica,RA,0,RA,Sin cambio,,39
46,4,DDPC,Marco,Analista territorial y Poblacional,RA,0,RA,Sin cambio,,39
47,4,DIACCC,Carmen,Asistente en Supervisión del Control de Calidad de la Cartografía Electoral,RA,0,RA,Sin cambio,,41
48,4,DIACCC,Carmen,Técnica en Validación Gráfica y Alfanumérica,RA,0,RA,Sin cambio,,41
49,4,DIACCC,Carmen,Técnica en Producción Cartográfica,RA,1,RA,Técnica en Validación Gráfica y Alfanumérica,,41
50,4,DIACCC,Carmen,Técnico en Validación Gráfica y Alfanumérica,RA,0,RA,Sin cambio,,41
51,4,DIACCC,Carmen,Técnico en Producción Cartográfica,RA,1,RA,Técnico en Validación Gráfica y Alfanumérica,,41
52,4,DPIR,Rosario,Asistente en Supervisión de Imágenes Satelitales,RA,1,RA,Asistente en Supervisión de Catálogos Geoelectorales e Imágenes Raster,,40
53,4,DPIR,Rosario,Técnica en Procesamiento de imágenes Satelitales,RA,1,RA,Técnica en Validación de Catálogos Geoelectorales y Procesamiento de Imágenes Raster,,40
54,4,DPIR,Rosario,Técnico en Procesamiento de imágenes Satelitales,RA,1,RA,Técnico en Validación de Catálogos Geoelectorales y Procesamiento de Imágenes  Raster,,40
55,4,DPIR,Rosario,Técnico en Procesamiento de imágenes Satelitales,RA,1,RA,Técnico en Validación de Catálogos Geoelectorales y Procesamiento de Imágenes  Raster,,40
56,5,DDPC,Marco,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,39
57,5,DDPC,Marco,Programadora de Sistemas de Información Geográfico Electorales,HE,1,RA,Especialista en Desarrollo y Mantenimiento de Sistemas de Información Geográfico Electorales para la generación de Productos Cartográficos,KA3,39
58,5,DPIR,Rosario,Especialista en Implementación de los Procesos y Servicios Cartográficos,HE,1,RA,Especialista en Implementación de los Procesos y Servicios Cartográficos,JC2,40
59,5,DPIR,Rosario,Especialista de Servicios de Información Geográfica,HE,1,RA,Analista de Evaluación de la Cartografía Electoral,JB1,40
60,5,DIACCC,Carmen,Supervisor de Actualización del Marco Geoelectoral,HE,1,RA,Supervisor de Actualización del Marco Geoelectoral,HC3,41
61,5,DIACCC,Carmen,Supervisor de Actualización del Marco Geoelectoral,HE,1,RA,Supervisor de Actualización del Marco Geoelectoral,HC3,41
62,5,DIACCC,Carmen,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,41
63,5,DIACCC,Carmen,Profecional Especializado en Servicios de Información Geográfica,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,41
64,2,SACCELT,Benjamín,Subdirectora de Actualización Cartográfica en Campo y Evaluación de Límites Territoriales,DESPEN,0,N/A,Sin cambio,XXX,1
65,3,DPOAC,Genoveva,Jefa de Departamento de Procedimientos Operativos para la Actualización Cartográfica,DESPEN,0,N/A,Sin cambio,XXX,64
66,4,DPOAC,Blanca,Asistente en Supervisión de Normatividad y Análisis Técnico Seccional,RA,1,RA,Cambia nombre de puesto: Supervisor de Aplicación Normativa Geoelectoral,KA3,65
67,4,DPOAC,Blanca,Secretaria de Subdirección de área Departamento o Equivalente,RA,1,RA,Analista Normativo de la Cartografía Electoral,HC4,65
68,4,DPOAC,Blanca,Técnico en Análisis Seccional y Cartografía,RA,1,RA,Analista Normativo de la Cartografía Electoral,HC4,65
69,4,DPOAC,Blanca,Técnico en Análisis Seccional y Cartografía,RA,1,RA,Analista Normativo de la Cartografía Electoral,HC4,65
70,4,DPOAC,Blanca,Técnico en Análisis Seccional y Cartografía,RA,1,RA,Analista Normativo de la Cartografía Electoral,HC4,65
71,4,DPOAC,Blanca,Técnico en Análisis Seccional y Cartografía,RA,1,RA,Analista Normativo de la Cartografía Electoral,HC4,65
72,4,DPOAC,Blanca,Auxiliar Técnico en Marco Geoelectoral,RA,1,RA,Analista Auxiliar de la Cartografía Electoral,HB3,65
73,4,DPOAC,Blanca,Auxiliar de Oficina y Archivo,RA,0,RA,Sin cambio,HB3,65
74,4,DPOAC,Blanca,Especialista de Servicios de Información Geográfica,HE,1,RA,Analista de Evaluación de la Cartografía Electoral,JB1,65
75,4,DPOAC,Blanca,Profesional Especializado en Servicios de Información Geográfica,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,65
76,4,DPOAC,Blanca,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,65
77,4,DPOAC,Blanca,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,65
78,4,DPOAC,Blanca,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,65
79,4,DPOAC,Blanca,Especialista en Actualizaciones al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,65
80,3,SACCELT,Genoveva,Jefa de Departamento de Evaluación y Seguimiento de los Avances de la Actualización Cartográfica,DESPEN,0,N/A,Sin cambio,LC4,64
81,4,DESAAC,Gloria,Especialista en Implementación de los Procesos y Servicios Cartográficos,HE,1,RA,Especialista en Implementación de los Procesos y Servicios Cartográficos,JC2,80
82,4,DESAAC,Gloria,Especialista de Servicios de Información Geográfica,HE,1,RA,Analista de Evaluación de la Cartografía Electoral,JB1,80
83,4,DESAAC,Gloria,Especialista de Servicios de Información Geográfica,HE,1,RA,Analista de Evaluación de la Cartografía Electoral,JB1,80
84,4,DESAAC,Gloria,Asistente en Supervisión de Actualización Cartográfica,RA,0,RA,Supervisor de Gestión y Actualización Cartográfica,KA3,80
85,5,DESAAC,Gloria,Técnica en Reimpresión y Retiro de Credenciales,RA,1,RA,Analista de Información Cartográfica,HC4,84
86,5,DESAAC,Gloria,Técnico en Mapoteca,RA,1,RA,Técnico en Cartografía y Análisis Territorial,HC4,84
87,5,DESAAC,Gloria,Técnico en Mapoteca,RA,1,RA,Técnico en Cartografía y Análisis Territorial,HC4,84
88,5,DESAAC,Gloria,Técnico en Mapoteca,RA,0,RA,Sin cambio,HB3,84
89,5,DESAAC,Gloria,Técnico en Mapoteca,RA,0,RA,Sin cambio,HB3,84
90,3,DAMGAT,Genoveva,Jefe De Departamento De Análisis Del Marco Geográfico Y Adecuación Territorial,DESPEN,0,N/A,Sin cambio,XXX,64
91,4,DAMGAT,Julian Ernesto,Asistente En Supervisión De Aplicaciones Del Marco Geográfico Electoral,RA,1,RA,Asistente En Supervisión De Información Geográfica Electoral,KA3,90
92,4,DAMGAT,Julian Ernesto,Técnico En Marco Geoelectoral,RA,1,RA,Asistente En Supervisión De Información Geográfica Electoral,KA3,90
93,4,DAMGAT,Julian Ernesto,Técnico En Marco Geoelectoral,RA,0,N/A,Sin Cambio,HB3,90
94,4,DAMGAT,Julian Ernesto,Auxiliar En Seguimiento Y Control De Información Cartográfica,RA,1,RA,Técnico En Marco Geoelectoral,HB3,90
95,4,DAMGAT,Julian Ernesto,Profesional Especializado En Servicios De Información Geográfica,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,90
96,4,DAMGAT,Julian Ernesto,Especialista En Actualizaciones Al Marco Seccional Electoral,HE,1,RA,Analista de Cambios de la Geografía Electoral,HC4,90`
});
