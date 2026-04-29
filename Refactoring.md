**Pregunta A.** Busca el string `'Gol'` en todos los archivos del proyecto. ¿En
cuántos archivos aparece? ¿Qué rol tiene en cada uno?

Sale NewEventForm y en EventFeed como los para los nombres tipos de eventos y en Eventfeed biene una segunda vez para los Records icons.


**Pregunta B.** `EventFeed.jsx` tiene un objeto `ICON` y `NewEventForm.jsx` tiene
un array `EVENT_TYPES`. ¿Qué relación conceptual tienen? ¿Qué pasa si un estudiante
agrega `'Prórroga'` al formulario pero se olvida de agregarle un icono?

El Icon se usa para imprimirlo en el frontend mientras que el event_types se usa para selecionado a la hora de hacer un nuevo evento.  


**Pregunta C.** Mira las funciones `goalHome`, `goalAway`, `handleReset` y
`handleAddEvent` en `App.jsx`. ¿Qué tienen en común? ¿Cuántas veces se repite
exactamente el mismo bloque try/catch?

Son funciones asyncronas con un await, un try and catch y una variable de error para el catch. Se repite tres veces handlereset goalHome y goalway. Pero todos tienen un try and catch similar, aunque estos si repiten exactamente el bloque de try and catch.

**Pregunta D.** Si la API REST cambia el nombre del campo `homeScore` a
`home_score`, ¿cómo sabrías qué archivos del frontend hay que actualizar?
¿TypeScript te habría ayudado?

Si, porque typescript detectaria que hay algo mal en los tipos que estoy usando al ser un leguanje tipado y por lo tanto marcaria error en el archivo, justo en la linea donde se esta usando esa varibale.