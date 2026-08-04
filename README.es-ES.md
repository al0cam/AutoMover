

# AutoMover Plugin

Este plugin se utiliza para designar carpetas en las que tus archivos se moverán automáticamente.
Busca ser una alternativa al plugin https://github.com/farux/obsidian-auto-note-mover de farux.
El problema que tenía con ese plugin era la falta de soporte para expresiones regulares (regex) y grupos de regex en las rutas de destino.

Por lo tanto, este plugin admite expresiones regulares y grupos de regex para crear las rutas de destino a menos que ya existan.

## Características

- **Movimiento automático de archivos** basado en patrones de nombres de archivo, etiquetas o metadatos de proyectos
- **Soporte para regex** con grupos de captura para la creación dinámica de carpetas
- **Organización basada en proyectos** utilizando metadatos frontmatter
- **Reglas basadas en etiquetas** para organizar archivos por etiquetas
- **Reglas de exclusión** para proteger archivos/carpetas específicas de ser movidos
- **Múltiples desencadenantes**: al abrir un archivo, ejecución manual o automatización basada en tiempo
- **Interfaz colapsable** para una mejor organización de conjuntos de reglas complejos
- **Importación/Exportación** de configuraciones para un fácil respaldo y compartir

## Documentación

- [UI Guide](https://github.com/al0cam/AutoMover/blob/master/docs/ui-guide.md) - Descripción completa de la interfaz y la configuración del plugin
- [Moving Rules](https://github.com/al0cam/AutoMover/blob/master/docs/moving-rules.md) - Reglas basadas en nombres de archivo con ejemplos de regex
- [Tag Rules](https://github.com/al0cam/AutoMover/blob/master/docs/tag-rules.md) - Reglas basadas en etiquetas con ejemplos de regex
- [Project Rules](https://github.com/al0cam/AutoMover/blob/master/docs/project-rules.md) - Organiza archivos por proyecto usando frontmatter
- [Exclusion Rules](https://github.com/al0cam/AutoMover/blob/master/docs/exclusion-rules.md) - Protege archivos y carpetas específicos

## Primeros Pasos

1. Instala el plugin desde los Complementos de la Comunidad de Obsidian
2. Abre Configuración → AutoMover
3. Crea tu primera regla:
   - **Criterios de búsqueda**: Introduce un patrón de nombre de archivo o regex (por ejemplo, "Meeting")
   - **Carpeta de destino**: Introduce la ruta de la carpeta destino (por ejemplo, "Work/Meetings")
4. Activa la opción "Move on open" para habilitar el movimiento automático
5. Utiliza el botón "Move files" para aplicar las reglas a los archivos existentes

### Prioridad de las Reglas

El plugin verifica las reglas en este orden:
1. **Reglas de exclusión** - Los archivos que coincidan con estas nunca se moverán
2. **Reglas de proyecto** - Los archivos con frontmatter `Project` coinciden primero
3. **Reglas de movimiento** - Coincidencia de patrones basada en el nombre del archivo
4. **Reglas de etiquetas** - Coincidencia basada en etiquetas (si ninguna regla de nombre de archivo coincidió)

## Instalación

### Desde los Complementos de la Comunidad de Obsidian (Recomendado)
1. Abre Configuración → Complementos de la Comunidad
2. Explora y busca "AutoMover"
3. Haz clic en Instalar, luego en Habilitar

### Instalación Manual
1. Descarga la última versión desde GitHub
2. Extrae los archivos en `.obsidian/plugins/AutoMover/`
3. Recarga Obsidian
4. Habilita el plugin en Configuración → Complementos de la Comunidad

## Solicitar Funcionalidades e Informar Problemas

Si deseas solicitar una funcionalidad o informar un problema, hazlo creando un issue en la pestaña de issues de este repositorio.
En caso de que por alguna razón desees contactarme directamente, puedes hacerlo enviándome un correo electrónico que aparece en mi perfil de GitHub o a través de LinkedIn, que también se muestra en mi perfil de GitHub.

## Contribución

Si deseas contribuir a este plugin, puedes hacerlo haciendo fork de este repositorio y creando un pull request con tus cambios, junto con una explicación detallada de qué son y por qué.
¡Gracias!


## Planes Futuros

- [x] Agregar soporte para carpetas excluidas
- [x] Agregar soporte para archivos excluidos
- [x] Agregar soporte regex para carpetas y archivos excluidos (debe soportar acentos de idiomas como ñ, á, š, đ, こ, 猫, etc.)
- [x] Agregar ejecución basada en tiempo para la clasificación de reglas
- [x] Exponer el botón de mover archivos en la barra de herramientas izquierda
- [x] Exponer la función de mover archivos en los comandos accesibles mediante la paleta de comandos
- [x] Agregar importación y exportación de reglas
- [x] Agregar soporte para reglas #tag
- [ ] Agregar un archivo similar a .gitignore que contenga todas las reglas de movimiento (asumo que la lista puede crecer bastante para algunas personas)
- [ ] Etiquetado automático de los archivos movidos con el nombre de la carpeta de destino (última carpeta en la ruta)
- [ ] Agregar botón de deshacer en el cuadro emergente de notificación para los archivos movidos


- [x] Agregar botón para colapsar/expandir todas las reglas
- [x] Agregar reglas de movimiento de Proyecto
	- [x] Nombre del proyecto y ruta de destino
	- [x] Subcampo que contiene las reglas de movimiento para el proyecto
- [x] Agregar interfaz de usuario para reglas de proyecto
- [x] Lógica de negocio para reglas de proyecto
